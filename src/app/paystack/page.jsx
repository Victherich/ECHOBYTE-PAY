"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import styled, { createGlobalStyle, keyframes } from "styled-components";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { paymentDb, db } from "@/firebaseConfig";
import { CURRENCIES, getCurrency } from "@/currencies";

/* =====================================================
   CONFIGURATION
===================================================== */

const PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

const SESSION_KEY = "echopay_paystack_session";
const REFERENCE_KEY = "echopay_paystack_reference";

// Update this collection name if your Paystack webhook writes to a specific collection
const WEBHOOK_COLLECTION = "paystack_webhooks";
const SUCCESS_COLLECTION = "successful_transactions";

const VERIFY_INTERVAL = 5000;

/* =====================================================
   GLOBAL STYLES
===================================================== */

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #f5f7fb;
    font-family: Inter, Arial, sans-serif;
    color: #14213d;
  }

  button, input, select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }
`;

/* =====================================================
   HELPERS & CONDITIONAL COMMISSION LOGIC
===================================================== */

function parseObject(value, fallback = {}) {
  if (!value) return fallback;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeParams(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  const params = { ...input };

  [
    "customer",
    "customizations",
    "meta",
    "metadata",
    "subaccounts",
    "channels",
  ].forEach((key) => {
    if (params[key] !== undefined) {
      params[key] = parseObject(
        params[key],
        key === "subaccounts" || key === "channels" ? [] : {}
      );
    }
  });

  // Normalize reference key (accept tx_ref or reference)
  if (!params.tx_ref && params.reference) {
    params.tx_ref = params.reference;
  }

  return params;
}

function extractIncomingParams(queryString) {
  const searchParams = new URLSearchParams(queryString);
  const serialized = searchParams.get("params");

  if (serialized) {
    try {
      return normalizeParams(JSON.parse(serialized));
    } catch (error) {
      console.error("Invalid payment parameters:", error);
      throw new Error("The supplied payment parameters are invalid.");
    }
  }

  const direct = Object.fromEntries(searchParams.entries());
  delete direct.params;

  if (!Object.keys(direct).length) return null;

  return normalizeParams(direct);
}

function getSuccessUrl(params) {
  return (
    params.success_url ||
    params.successUrl ||
    params.return_url ||
    params.redirect_url ||
    params.callback_url ||
    ""
  );
}

function safeNumber(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

async function fetchNgnRate(currencyCode) {
  const code = String(currencyCode || "NGN").toUpperCase();
  if (code === "NGN") return 1;

  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${code}`, {
      cache: "no-store",
    });
    const result = await response.json();

    if (!response.ok || result.result !== "success" || !result.rates?.NGN) {
      throw new Error(`Unable to fetch NGN exchange rate for ${code}.`);
    }

    return Number(result.rates.NGN);
  } catch (err) {
    console.error("Exchange rate fetch error:", err);
    return 1;
  }
}

function getCommission(amount, ngnPerUnit, hasSplit) {
  if (!hasSplit) return 0;
  if (!amount || amount <= 0 || !ngnPerUnit || ngnPerUnit <= 0) return 0;

  const percentageFee = amount * 0.015;
  const maxCapInSelectedCurrency = 2000 / ngnPerUnit;

  return Number(Math.min(percentageFee, maxCapInSelectedCurrency).toFixed(2));
}

function hasPaystackSplit(rawParams) {
  if (!rawParams) return false;
  if (rawParams.split_code || rawParams.subaccount || rawParams.subaccountCode) {
    return true;
  }
  return Array.isArray(rawParams.subaccounts) && rawParams.subaccounts.length > 0;
}

function buildPaystackSplitOptions(rawParams, commission) {
  // 1. Multi-split group code (SPL_...)
  if (rawParams.split_code) {
    return {
      split_code: rawParams.split_code,
    };
  }

  // 2. Single subaccount via object array or direct code (ACCT_...)
  const primarySub =
    Array.isArray(rawParams.subaccounts) && rawParams.subaccounts.length > 0
      ? rawParams.subaccounts[0]
      : null;

  const subaccountCode =
    primarySub?.id ||
    primarySub?.subaccount_code ||
    primarySub?.subaccountCode ||
    rawParams.subaccountCode ||
    rawParams.subaccount;

  if (!subaccountCode) return {};

  const splitOptions = {
    subaccountCode,
    bearer: primarySub?.bearer || rawParams.bearer || "account",
  };

  // In Paystack, transactionCharge (in kobo/subunits) is the flat fee retained by your main account
  if (commission > 0) {
    splitOptions.transactionCharge = Math.round(commission * 100);
  }

  return splitOptions;
}

function splitCustomerName(fullName = "") {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function appendRedirectParams(successUrl, data) {
  if (!successUrl) return null;

  try {
    const url = new URL(successUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    url.searchParams.set("reference", data.tx_ref);
    url.searchParams.set("tx_ref", data.tx_ref);
    url.searchParams.set("transaction_reference", data.tx_ref);
    url.searchParams.set("transaction_id", String(data.id || ""));
    url.searchParams.set("amount", String(data.amount));
    url.searchParams.set("paid_amount", String(data.amount));
    url.searchParams.set("currency", data.currency);

    return url.toString();
  } catch {
    return null;
  }
}

/* =====================================================
   PAYSTACK INLINE V2 SCRIPT LOADER
===================================================== */

function loadPaystackScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.PaystackPop) {
      resolve();
      return;
    }

    const existing = document.querySelector(
      'script[src="https://js.paystack.co/v2/inline.js"]'
    );

    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });

      if (window.PaystackPop) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;

    script.onload = resolve;
    script.onerror = reject;

    document.body.appendChild(script);
  });
}

const WAITING_TIPS = [
  "Sit back and relax while your transaction is securely processed.",
  "Banking networks can occasionally take a minute or two to sync — we've got your back.",
  "Your funds are safe and handled with bank-grade encryption at every step.",
  "Almost there! Our automated systems are keeping a close eye on your confirmation.",
  "Thank you for choosing us — we appreciate your patience while everything finalizes.",
];

/* =====================================================
   MAIN CHECKOUT
===================================================== */

function Checkout() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const [message, setMessage] = useState("Waiting for your payment...");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);

  const [manualChecking, setManualChecking] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [waitingTipIndex, setWaitingTipIndex] = useState(0);

  const verifyLock = useRef(false);
  const successLock = useRef(false);
  const pollTimer = useRef(null);
  const sessionRef = useRef(null);

  /* =====================================================
     ROTATING WAITING TIPS
  ===================================================== */
  useEffect(() => {
    const tipInterval = setInterval(() => {
      setWaitingTipIndex((prev) => (prev + 1) % WAITING_TIPS.length);
    }, 20000);

    return () => clearInterval(tipInterval);
  }, []);

  /* =====================================================
     SESSION PERSISTENCE
  ===================================================== */

  const updateSession = useCallback((updated) => {
    sessionRef.current = updated;
    setSession(updated);

    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));

      if (updated.tx_ref) {
        localStorage.setItem(REFERENCE_KEY, updated.tx_ref);
      }
    } catch (err) {
      console.error("Session persistence error:", err);
    }
  }, []);

  /* =====================================================
     INITIALIZE OR RESTORE SESSION
  ===================================================== */

  useEffect(() => {
    let active = true;

    const initializeSession = async () => {
      try {
        setLoading(true);
        setError("");

        const incoming = extractIncomingParams(queryString);

        if (incoming) {
          const amount = safeNumber(incoming.amount);

          if (amount <= 0) {
            throw new Error("A valid payment amount is required.");
          }

          if (!incoming.customer?.email && !incoming.email) {
            throw new Error("Customer email is required.");
          }

          const tx_ref = incoming.tx_ref;

          if (typeof tx_ref !== "string" || !tx_ref.trim()) {
            throw new Error(
              "Missing transaction reference. The client application must provide tx_ref or reference."
            );
          }

          const originalCurrency = String(
            incoming.currency || "NGN"
          ).toUpperCase();

          const hasSplit = hasPaystackSplit(incoming);
          const ngnPerUnit = await fetchNgnRate(originalCurrency);
          const initialCommission = getCommission(
            amount,
            ngnPerUnit,
            hasSplit
          );

          let existingCanPay = true;
          try {
            const savedData = localStorage.getItem(SESSION_KEY);
            if (savedData) {
              const parsedSaved = JSON.parse(savedData);
              if (
                parsedSaved.tx_ref === tx_ref.trim() &&
                parsedSaved.canPay !== undefined
              ) {
                existingCanPay = parsedSaved.canPay;
              }
            }
          } catch (e) {
            console.error("Error reading saved session state:", e);
          }

          const newSession = {
            tx_ref: tx_ref.trim(),
            rawParams: incoming,
            originalAmount: amount,
            originalCurrency,
            amount,
            currency: originalCurrency,
            commission: initialCommission,
            exchangeRate: 1,
            ngnPerUnit,
            successUrl: getSuccessUrl(incoming),
            status: "pending",
            canPay: existingCanPay,
            createdAt: new Date().toISOString(),
          };

          if (active) {
            updateSession(newSession);
            setMessage("Waiting for your payment...");
          }

          return;
        }

        const saved = localStorage.getItem(SESSION_KEY);

        if (!saved) {
          throw new Error("No payment session was provided.");
        }

        const restored = JSON.parse(saved);

        if (!restored.tx_ref || !restored.rawParams) {
          throw new Error("The saved payment session is invalid.");
        }

        if (active) {
          updateSession(restored);

          if (restored.status === "successful") {
            setMessage("Payment successful.");
          } else if (restored.status === "cancelled") {
            setMessage("Payment session cancelled.");
          } else {
            setMessage("Restored payment session. Checking payment...");
          }
        }
      } catch (err) {
        console.error("ECHOPAY PAYSTACK SESSION ERROR:", err);
        if (active) {
          setError(err.message || "Unable to initialize payment session.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeSession();

    return () => {
      active = false;
    };
  }, [queryString, updateSession]);

  /* =====================================================
     CURRENCY CONVERSION
  ===================================================== */

  const changeCurrency = async (newCurrency) => {
    const current = sessionRef.current;

    if (
      !current ||
      currencyLoading ||
      current.status === "successful" ||
      current.status === "cancelled"
    ) {
      return;
    }

    setCurrencyLoading(true);
    setError("");

    try {
      const currency = newCurrency.toUpperCase();

      const response = await fetch(
        `https://open.er-api.com/v6/latest/${currency}`,
        { cache: "no-store" }
      );

      const result = await response.json();

      if (!response.ok || result.result !== "success") {
        throw new Error("Unable to obtain exchange rates.");
      }

      const rates = result.rates;
      const ngnPerUnit = currency === "NGN" ? 1 : Number(rates.NGN);
      const originalPerSelected =
        currency === current.originalCurrency
          ? 1
          : Number(rates[current.originalCurrency]);

      if (
        !Number.isFinite(ngnPerUnit) ||
        ngnPerUnit <= 0 ||
        !Number.isFinite(originalPerSelected) ||
        originalPerSelected <= 0
      ) {
        throw new Error("Currency conversion is unavailable.");
      }

      const convertedAmount = Number(
        (current.originalAmount / originalPerSelected).toFixed(2)
      );

      const hasSplit = hasPaystackSplit(current.rawParams);

      const commission = getCommission(
        convertedAmount,
        ngnPerUnit,
        hasSplit
      );
      const exchangeRate = convertedAmount / current.originalAmount;

      const updated = {
        ...current,
        amount: convertedAmount,
        currency,
        exchangeRate,
        ngnPerUnit,
        commission,
        currencyChangedAt: new Date().toISOString(),
      };

      updateSession(updated);
    } catch (err) {
      setError(err.message || "Currency conversion failed.");
    } finally {
      setCurrencyLoading(false);
    }
  };


  /* =====================================================
   NORMALIZE WEBHOOK PAYLOAD (HANDLES NESTED `data` MAP)
===================================================== */

function extractPaystackData(rawDoc) {
  if (!rawDoc || typeof rawDoc !== "object") return null;

  // Top-level webhook doc has { createdAt, event, data: { reference, status, amount, ... } }
  const inner =
    rawDoc.data && typeof rawDoc.data === "object" ? rawDoc.data : rawDoc;

  // In case Paystack's raw envelope { event, data: { ... } } was nested inside `data`
  const payload =
    inner.data && typeof inner.data === "object" && !inner.reference && !inner.status
      ? inner.data
      : inner;

  return {
    event: rawDoc.event || inner.event || "",
    createdAt: rawDoc.createdAt || null,
    payload,
  };
}

/* =====================================================
   FIND WEBHOOK DOC BY DOC ID OR BY `data.reference` FIELD
===================================================== */

async function findWebhookDocByReference(txRef) {
  const cleanRef = String(txRef || "").trim();
  if (!cleanRef) return null;

  // 1. Try direct document lookup by reference (encoded or raw)
  const directIds = Array.from(
    new Set([encodeURIComponent(cleanRef), cleanRef])
  );

  for (const docId of directIds) {
    const snap = await getDoc(doc(paymentDb, WEBHOOK_COLLECTION, docId));
    if (snap.exists()) {
      return snap.data();
    }
  }

  // 2. Fallback: query collection where `data.reference == txRef`
  const q = query(
    collection(paymentDb, WEBHOOK_COLLECTION),
    where("data.reference", "==", cleanRef)
  );
  const querySnap = await getDocs(q);

  if (!querySnap.empty) {
    // Pick the latest matching document if multiple exist
    const docs = querySnap.docs.map((d) => d.data());
    docs.sort((a, b) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
    );
    return docs[0];
  }

  return null;
}

/* =====================================================
   SAVE VERIFIED SUCCESSFUL TRANSACTION
===================================================== */

const saveSuccessfulTransaction = useCallback(
  async (webhookDocData, eventName = "") => {
    if (successLock.current) return;
    successLock.current = true;

    try {
      const current = sessionRef.current;

      if (!current?.tx_ref) {
        throw new Error("Transaction reference is missing.");
      }

      const { payload } = extractPaystackData(webhookDocData);
      const txData = payload || webhookDocData;

      // Paystack amounts are in subunits (kobo = NGN * 100)
      const rawWebhookAmount = safeNumber(txData.amount);
      const normalizedPaidAmount =
        txData.amountInMajorUnit !== undefined
          ? safeNumber(txData.amountInMajorUnit)
          : Number((rawWebhookAmount / 100).toFixed(2));

      const verifiedCurrency = String(
        txData.currency || current.currency
      ).toUpperCase();

      const transactionId =
        txData.id || txData.transaction_code || txData.transfer_code || "";

      const transactionRecord = {
        reference: current.tx_ref,
        status: "successful",
        event: eventName || webhookDocData?.event || "charge.success",
        amount: normalizedPaidAmount,
        paidAmount: normalizedPaidAmount,
        rawSubunitAmount: rawWebhookAmount,
        currency: verifiedCurrency,
        originalAmount: current.originalAmount,
        originalCurrency: current.originalCurrency,
        exchangeRate: current.exchangeRate,
        commission: current.commission,
        commissionCurrency: current.currency,
        customer: current.rawParams.customer || {},
        subaccounts: current.rawParams.subaccounts || [],
        metadata:
          current.rawParams.meta || current.rawParams.metadata || {},
        projectName:
          current.rawParams.customizations?.title ||
          current.rawParams.projectName ||
          "Unknown Project",
        projectId: current.rawParams.projectId || null,
        paymentParameters: current.rawParams,
        paystackTransaction: txData,
        paystackWebhookDoc: webhookDocData,
        paystackTransactionId: transactionId,
        paystackReference: txData.reference || current.tx_ref,
        paymentType:
          txData.channel ||
          txData.authorization?.channel ||
          txData.session?.provider ||
          "paystack",
        processorResponse:
          txData.gateway_response || txData.status || "Successful",
        successUrl: current.successUrl,
        verifiedAt: new Date().toISOString(),
      };

      await setDoc(
        doc(db, SUCCESS_COLLECTION, encodeURIComponent(current.tx_ref)),
        transactionRecord,
        { merge: true }
      );

      const completedSession = {
        ...current,
        status: "successful",
        verifiedData: txData,
        completedAt: new Date().toISOString(),
      };

      updateSession(completedSession);
      setMessage("Payment successful! Redirecting...");

      const redirectUrl = appendRedirectParams(current.successUrl, {
        tx_ref: current.tx_ref,
        id: transactionId,
        amount: normalizedPaidAmount,
        currency: verifiedCurrency,
      });

      if (redirectUrl) {
        window.location.assign(redirectUrl);
      }
    } catch (err) {
      successLock.current = false;
      console.error("Transaction saving error:", err);
      setError(
        "Payment is verified, but saving the transaction failed. Please do not pay again. Contact support or retry the save."
      );
    }
  },
  [updateSession]
);

/* =====================================================
   EVALUATE PAYSTACK WEBHOOK DOCUMENT FROM FIRESTORE
===================================================== */

const processWebhookSnapshot = useCallback(
  async (rawDoc) => {
    const current = sessionRef.current;
    if (!current || !rawDoc) return;

    const extracted = extractPaystackData(rawDoc);
    const data = extracted?.payload;
    if (!data) return;

    const docRef = String(data.reference || "").trim();

    if (docRef && docRef !== current.tx_ref) {
      console.warn("Reference mismatch:", docRef, "expected:", current.tx_ref);
      return;
    }

    const status = String(data.status || "").toLowerCase();

    if (status === "success" || status === "successful") {
      // Paystack saves amount in kobo/subunits (e.g. 807500 -> 8075.00 NGN)
      const rawAmount = safeNumber(data.amount);
      const majorAmount =
        data.amountInMajorUnit !== undefined
          ? safeNumber(data.amountInMajorUnit)
          : Number((rawAmount / 100).toFixed(2));

      const verifiedCurrency = String(
        data.currency || current.currency
      ).toUpperCase();

      if (
        verifiedCurrency !== current.currency ||
        majorAmount + 0.01 < current.amount
      ) {
        setError(
          `Payment amount (${verifiedCurrency} ${majorAmount}) does not match expected (${current.currency} ${current.amount}). Please contact support.`
        );
        setMessage("Payment requires manual review.");
        return;
      }

      await saveSuccessfulTransaction(rawDoc, extracted.event);
    } else if (
      status === "failed" ||
      status === "abandoned" ||
      status === "reversed"
    ) {
      setMessage("Paystack reported that this payment was unsuccessful.");
      setError("Payment was not successful.");
    } else {
      setMessage("Waiting for your payment confirmation...");
    }
  },
  [saveSuccessfulTransaction]
);

/* =====================================================
   FIRESTORE POLLING VERIFICATION
===================================================== */

const verifyPayment = useCallback(async () => {
  const current = sessionRef.current;

  if (
    !current?.tx_ref ||
    current.status === "cancelled" ||
    current.status === "successful" ||
    verifyLock.current ||
    successLock.current
  ) {
    return;
  }

  verifyLock.current = true;

  try {
    const webhookDoc = await findWebhookDocByReference(current.tx_ref);

    if (!webhookDoc) {
      setMessage(
        "After payment, please wait for confirmation. Usually takes 1 to 3 minutes. You can also click the I HAVE MADE THE PAYMENT button below and wait for confirmation."
      );
      return;
    }

    await processWebhookSnapshot(webhookDoc);
  } catch (err) {
    console.error("Firestore verification polling error:", err);
    setMessage("Connection interrupted. We will try again...");
  } finally {
    verifyLock.current = false;
  }
}, [processWebhookSnapshot]);

/* =====================================================
   AUTOMATIC FIRESTORE POLLING + QUERY LISTENER
===================================================== */

useEffect(() => {
  if (
    !session?.tx_ref ||
    session.status === "cancelled" ||
    session.status === "successful"
  ) {
    return;
  }

  // 1. Immediate check + 5-second Firestore polling interval
  verifyPayment();
  pollTimer.current = setInterval(verifyPayment, VERIFY_INTERVAL);

  // 2. Real-time listener on `data.reference == session.tx_ref`
  const q = query(
    collection(paymentDb, WEBHOOK_COLLECTION),
    where("data.reference", "==", session.tx_ref)
  );

  const unsubscribe = onSnapshot(
    q,
    (snap) => {
      if (!snap.empty && !successLock.current) {
        const docs = snap.docs.map((d) => d.data());
        docs.sort((a, b) =>
          String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
        );
        processWebhookSnapshot(docs[0]);
      }
    },
    (err) => {
      console.error("Firestore query listener error:", err);
    }
  );

  return () => {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
    unsubscribe();
  };
}, [session?.tx_ref, session?.status, verifyPayment, processWebhookSnapshot]);

//   /* =====================================================
//      SAVE VERIFIED SUCCESSFUL TRANSACTION
//   ===================================================== */

//   const saveSuccessfulTransaction = useCallback(
//     async (webhookDocData) => {
//       if (successLock.current) return;
//       successLock.current = true;

//       try {
//         const current = sessionRef.current;

//         if (!current?.tx_ref) {
//           throw new Error("Transaction reference is missing.");
//         }

//         // Paystack webhooks store amount in subunits (kobo) unless already normalized
//         const rawWebhookAmount = safeNumber(webhookDocData.amount);
//         const normalizedPaidAmount =
//           webhookDocData.amountInMajorUnit !== undefined
//             ? safeNumber(webhookDocData.amountInMajorUnit)
//             : rawWebhookAmount >= current.amount * 10
//             ? Number((rawWebhookAmount / 100).toFixed(2))
//             : rawWebhookAmount;

//         const verifiedCurrency = String(
//           webhookDocData.currency || current.currency
//         ).toUpperCase();

//         const transactionId =
//           webhookDocData.id ||
//           webhookDocData.transactionId ||
//           webhookDocData.data?.id ||
//           "";

//         const transactionRecord = {
//           reference: current.tx_ref,
//           status: "successful",
//           amount: normalizedPaidAmount,
//           paidAmount: normalizedPaidAmount,
//           currency: verifiedCurrency,
//           originalAmount: current.originalAmount,
//           originalCurrency: current.originalCurrency,
//           exchangeRate: current.exchangeRate,
//           commission: current.commission,
//           commissionCurrency: current.currency,
//           customer: current.rawParams.customer || {},
//           subaccounts: current.rawParams.subaccounts || [],
//           metadata:
//             current.rawParams.meta || current.rawParams.metadata || {},
//           projectName:
//             current.rawParams.customizations?.title ||
//             current.rawParams.projectName ||
//             "Unknown Project",
//           projectId: current.rawParams.projectId || null,
//           paymentParameters: current.rawParams,
//           paystackTransaction: webhookDocData,
//           paystackTransactionId: transactionId,
//           paystackReference: webhookDocData.reference || current.tx_ref,
//           paymentType:
//             webhookDocData.channel ||
//             webhookDocData.authorization?.channel ||
//             "paystack",
//           processorResponse:
//             webhookDocData.gateway_response || webhookDocData.status,
//           successUrl: current.successUrl,
//           verifiedAt: new Date().toISOString(),
//         };

//         await setDoc(
//           doc(
//             db,
//             SUCCESS_COLLECTION,
//             encodeURIComponent(current.tx_ref)
//           ),
//           transactionRecord,
//           { merge: true }
//         );

//         const completedSession = {
//           ...current,
//           status: "successful",
//           verifiedData: webhookDocData,
//           completedAt: new Date().toISOString(),
//         };

//         updateSession(completedSession);
//         setMessage("Payment successful! Redirecting...");

//         const redirectUrl = appendRedirectParams(current.successUrl, {
//           tx_ref: current.tx_ref,
//           id: transactionId,
//           amount: normalizedPaidAmount,
//           currency: verifiedCurrency,
//         });

//         if (redirectUrl) {
//           window.location.assign(redirectUrl);
//         }
//       } catch (err) {
//         successLock.current = false;
//         console.error("Transaction saving error:", err);
//         setError(
//           "Payment is verified, but saving the transaction failed. Please do not pay again. Contact support or retry the save."
//         );
//       }
//     },
//     [updateSession]
//   );

//   /* =====================================================
//      EVALUATE PAYSTACK WEBHOOK DOCUMENT FROM FIRESTORE
//   ===================================================== */

//   const processWebhookSnapshot = useCallback(
//     async (rawData) => {
//       const current = sessionRef.current;
//       if (!current || !rawData) return;

//       // Support both flat webhook docs and nested Paystack event payloads ({ event: 'charge.success', data: {...} })
//       const data =
//         rawData.data && typeof rawData.data === "object" && !rawData.status
//           ? rawData.data
//           : rawData;

//       const docRef = String(
//         data.reference || rawData.reference || current.tx_ref
//       ).trim();

//       if (docRef !== current.tx_ref) {
//         console.error("Transaction reference mismatch.");
//         setMessage("Checking transaction reference...");
//         return;
//       }

//       const status = String(
//         data.status || rawData.status || ""
//       ).toLowerCase();

//       if (status === "success" || status === "successful") {
//         // Paystack amounts are in subunits (kobo/cents)
//         const rawAmount = safeNumber(data.amount);
//         const majorAmount =
//           data.amountInMajorUnit !== undefined
//             ? safeNumber(data.amountInMajorUnit)
//             : rawAmount >= current.amount * 10
//             ? Number((rawAmount / 100).toFixed(2))
//             : rawAmount;

//         const verifiedCurrency = String(
//           data.currency || current.currency
//         ).toUpperCase();

//         if (
//           verifiedCurrency !== current.currency ||
//           majorAmount + 0.01 < current.amount
//         ) {
//           setError(
//             "Payment details do not match the expected amount or currency. Please contact support."
//           );
//           setMessage("Payment requires manual review.");
//           return;
//         }

//         await saveSuccessfulTransaction(data);
//       } else if (
//         status === "failed" ||
//         status === "abandoned" ||
//         status === "reversed"
//       ) {
//         setMessage("Paystack reported that this payment was unsuccessful.");
//         setError("Payment was not successful.");
//       } else {
//         setMessage("Waiting for your payment confirmation...");
//       }
//     },
//     [saveSuccessfulTransaction]
//   );

//   /* =====================================================
//      FIRESTORE POLLING VERIFICATION
//   ===================================================== */

//   const verifyPayment = useCallback(async () => {
//     const current = sessionRef.current;

//     if (
//       !current?.tx_ref ||
//       current.status === "cancelled" ||
//       current.status === "successful" ||
//       verifyLock.current ||
//       successLock.current
//     ) {
//       return;
//     }

//     verifyLock.current = true;

//     try {
//       const webhookDocRef = doc(
//         paymentDb,
//         WEBHOOK_COLLECTION,
//         encodeURIComponent(current.tx_ref)
//       );
//       const snap = await getDoc(webhookDocRef);

//       if (!snap.exists()) {
//         setMessage(
//           "After payment, please wait for confirmation. Usually takes 1 to 3 minutes. You can also click the I HAVE MADE THE PAYMENT button below and wait for confirmation."
//         );
//         return;
//       }

//       await processWebhookSnapshot(snap.data());
//     } catch (err) {
//       console.error("Firestore verification polling error:", err);
//       setMessage("Connection interrupted. We will try again...");
//     } finally {
//       verifyLock.current = false;
//     }
//   }, [processWebhookSnapshot]);

  /* =====================================================
     MANUAL VERIFICATION HANDLER
  ===================================================== */

  const handleManualVerify = async () => {
    if (manualChecking || verifyLock.current || successLock.current) return;

    setPaymentSubmitted(true);
    setManualChecking(true);
    setError("");
    setMessage("Checking payment confirmation...");

    await verifyPayment();

    setManualChecking(false);
  };

  /* =====================================================
     AUTOMATIC FIRESTORE POLLING + REAL-TIME LISTENER
  ===================================================== */

  useEffect(() => {
    if (
      !session?.tx_ref ||
      session.status === "cancelled" ||
      session.status === "successful"
    ) {
      return;
    }

    // 1. Immediate check + 5-second Firestore polling interval
    verifyPayment();
    pollTimer.current = setInterval(verifyPayment, VERIFY_INTERVAL);

    // 2. Real-time Firestore listener on the webhook document for zero-latency confirmation
    const webhookDocRef = doc(
      paymentDb,
      WEBHOOK_COLLECTION,
      encodeURIComponent(session.tx_ref)
    );
    const unsubscribe = onSnapshot(
      webhookDocRef,
      (snap) => {
        if (snap.exists() && !successLock.current) {
          processWebhookSnapshot(snap.data());
        }
      },
      (err) => {
        console.error("Firestore snapshot listener error:", err);
      }
    );

    return () => {
      if (pollTimer.current) {
        clearInterval(pollTimer.current);
        pollTimer.current = null;
      }
      unsubscribe();
    };
  }, [session?.tx_ref, session?.status, verifyPayment, processWebhookSnapshot]);

  /* =====================================================
     START PAYSTACK CHECKOUT (INLINE V2)
  ===================================================== */

  const startPayment = async () => {
    const current = sessionRef.current;
    if (!current || checkoutLoading) return;

    if (!PUBLIC_KEY) {
      setError("Paystack public key is missing.");
      return;
    }

    const raw = current.rawParams;
    const customerEmail = raw.customer?.email || raw.email;

    if (!customerEmail) {
      setError("Customer email is required.");
      return;
    }

    if (current.status === "cancelled") {
      setError("This payment session was cancelled.");
      return;
    }

    if (current.status === "successful") {
      setError("This transaction has already been completed.");
      return;
    }

    setCheckoutLoading(true);
    setError("");

    const updatedSession = {
      ...current,
      canPay: false,
    };
    updateSession(updatedSession);

    try {
      await loadPaystackScript();

      if (!window.PaystackPop) {
        throw new Error("Paystack checkout could not be loaded.");
      }

      const { firstName, lastName } = splitCustomerName(
        raw.customer?.name || ""
      );

      const amountInSubunits = Math.round(Number(current.amount) * 100);

      const splitOptions = buildPaystackSplitOptions(
        raw,
        current.commission
      );

      const paystackOptions = {
        key: PUBLIC_KEY,
        email: customerEmail,
        amount: amountInSubunits,
        currency: current.currency,
        reference: current.tx_ref,
        firstName: raw.customer?.first_name || firstName || undefined,
        lastName: raw.customer?.last_name || lastName || undefined,
        phone:
          raw.customer?.phone_number || raw.customer?.phone || undefined,
        ...(Array.isArray(raw.channels) && raw.channels.length > 0
          ? { channels: raw.channels }
          : {}),
        ...splitOptions,
        metadata: {
          projectName:
            raw.customizations?.title || raw.projectName || "ECHOBYTE PAY",
          projectId: raw.projectId || null,
          originalAmount: current.originalAmount,
          originalCurrency: current.originalCurrency,
          exchangeRate: current.exchangeRate,
          commission: current.commission,
          ...(raw.meta || raw.metadata || {}),
        },

        onLoad: () => {
          setCheckoutLoading(false);
          setMessage("Waiting for your payment...");
        },

        onSuccess: (transaction) => {
          console.log("Paystack onSuccess callback:", transaction);

          const submittedSession = {
            ...sessionRef.current,
            canPay: false,
          };
          updateSession(submittedSession);

          setPaymentSubmitted(true);
          setCheckoutLoading(false);
          setMessage("Payment received! Confirming webhook record...");

          verifyPayment();
        },

        onCancel: () => {
          setCheckoutLoading(false);
          setMessage("Checkout closed. Waiting for payment confirmation...");
        },

        onError: (err) => {
          console.error("Paystack popup error:", err);
          setCheckoutLoading(false);
          setError(err?.message || "An error occurred in Paystack checkout.");
        },
      };

      const popup = new window.PaystackPop();
      popup.newTransaction(paystackOptions);
    } catch (err) {
      console.error("Paystack checkout error:", err);
      setError(err.message || "Unable to open Paystack checkout.");
      setCheckoutLoading(false);
    }
  };

  /* =====================================================
     CANCEL LOCAL PAYMENT SESSION
  ===================================================== */

  const cancelTransaction = () => {
    const current = sessionRef.current;
    if (!current || current.status === "successful") return;

    const confirmed = window.confirm(
      "Cancel this payment session? Verification will stop on this page."
    );

    if (!confirmed) return;

    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }

    const cancelled = {
      ...current,
      status: "cancelled",
      canPay: true,
      cancelledAt: new Date().toISOString(),
    };

    updateSession(cancelled);
    setMessage("Payment session cancelled.");
    setError("");
  };

  /* =====================================================
     10-MINUTE COUNTDOWN & AUTO-CANCEL TIMER
  ===================================================== */

  useEffect(() => {
    if (
      !session?.tx_ref ||
      session.status === "cancelled" ||
      session.status === "successful"
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (pollTimer.current) {
            clearInterval(pollTimer.current);
            pollTimer.current = null;
          }

          const expiredSession = {
            ...sessionRef.current,
            status: "cancelled",
            cancelledAt: new Date().toISOString(),
          };

          updateSession(expiredSession);
          setMessage("Payment session expired after 10 minutes.");
          setError("Payment window has expired. Please restart checkout.");

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.tx_ref, session?.status, updateSession]);

  /* =====================================================
     LOADING STATE
  ===================================================== */

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <FullScreen>
          <Spinner />
          <p>Loading your payment session...</p>
        </FullScreen>
      </>
    );
  }

  /* =====================================================
     ERROR STATE
  ===================================================== */

  if (error && !session) {
    return (
      <>
        <GlobalStyle />
        <FullScreen>
          <PaymentCard>
            <Logo>
              ECHOPAY<span>1</span>
            </Logo>
            <ErrorIcon>!</ErrorIcon>
            <h2>Payment unavailable</h2>
            <p>{error}</p>
          </PaymentCard>
        </FullScreen>
      </>
    );
  }

  if (!session) return null;

  const selectedCurrency = getCurrency(session.currency);
  const customer = session.rawParams.customer || {};
  const projectName =
    session.rawParams.customizations?.title ||
    session.rawParams.projectName ||
    "Secure Checkout";

  const isCancelled = session.status === "cancelled";
  const isSuccessful = session.status === "successful";

  /* =====================================================
     CHECKOUT UI
  ===================================================== */

  return (
    <>
      <GlobalStyle />
      <PageWrapper>
        <Header>
          <Logo>
            ECHOBYTE <span>PAY</span>
          </Logo>
          <SecureLabel>
            <ShieldIcon>✓</ShieldIcon>
            Secure Checkout
          </SecureLabel>
        </Header>

        <Main>
          <PaymentCard>
            {session.canPay && (
              <>
                <MerchantSection>
                  {session.rawParams.customizations?.logo && (
                    <MerchantLogo
                      src={session.rawParams.customizations.logo}
                      alt="Merchant logo"
                    />
                  )}
                  <MerchantName>{projectName}</MerchantName>
                  <MerchantDescription>
                    Complete your payment securely
                  </MerchantDescription>
                </MerchantSection>

                {!isSuccessful && !isCancelled && (
                  <TimerBox>
                    <span>⏱ Please complete payment within:</span>
                    <strong>{formatTime(timeLeft)}</strong>
                  </TimerBox>
                )}

                <Divider />

                <AmountSection>
                  <SmallLabel>AMOUNT TO PAY</SmallLabel>
                  <Amount>
                    {selectedCurrency.symbol}
                    {Number(session.amount).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Amount>
                  <CurrencyCode>{session.currency}</CurrencyCode>

                  <CurrencyLabel>CHANGE CURRENCY</CurrencyLabel>
                  <CurrencySelect
                    value={session.currency}
                    disabled={currencyLoading || isCancelled || isSuccessful}
                    onChange={(e) => changeCurrency(e.target.value)}
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.code})
                      </option>
                    ))}
                  </CurrencySelect>

                  {currencyLoading && (
                    <ConversionText>Converting currency...</ConversionText>
                  )}

                  {session.currency !== session.originalCurrency && (
                    <ConversionText>
                      Converted from {session.originalCurrency}{" "}
                      {session.originalAmount.toLocaleString()}
                    </ConversionText>
                  )}
                </AmountSection>

                <Divider />

                <CustomerSection>
                  <SmallLabel>PAYMENT DETAILS</SmallLabel>
                  <CustomerRow>
                    <CustomerIcon>👤</CustomerIcon>
                    <div>
                      <CustomerName>{customer.name || "Customer"}</CustomerName>
                      <CustomerEmail>
                        {customer.email || session.rawParams.email}
                      </CustomerEmail>
                    </div>
                  </CustomerRow>
                </CustomerSection>

                <Divider />
              </>
            )}

            <ReferenceSection>
              <SmallLabel>TRANSACTION REFERENCE</SmallLabel>
              <Reference>{session.tx_ref}</Reference>
            </ReferenceSection>

            <Divider />

            <StatusSection>
              {!session.canPay && (
                <>
                  {!isSuccessful && !isCancelled && <Spinner />}
                  <WaitingTipBox>
                    {WAITING_TIPS[waitingTipIndex]}
                  </WaitingTipBox>
                </>
              )}

              {isSuccessful && <SuccessIcon>✓</SuccessIcon>}
              {isCancelled && <CancelledIcon>×</CancelledIcon>}

              <StatusText $success={isSuccessful} $cancelled={isCancelled}>
                {isSuccessful
                  ? "Payment successful, Please wait while we redirect you..."
                  : isCancelled
                  ? "Payment cancelled"
                  : message}
              </StatusText>

              {!isSuccessful && !isCancelled && (
                <StatusDescription>
                  We automatically check your transaction.
                </StatusDescription>
              )}

              {error && <ErrorMessage>{error}</ErrorMessage>}
            </StatusSection>

            {!isSuccessful && !isCancelled && (
              <>
                <PayButton
                  onClick={startPayment}
                  disabled={
                    checkoutLoading ||
                    currencyLoading ||
                    manualChecking ||
                    session.canPay === false
                  }
                >
                  {checkoutLoading ? "Opening checkout..." : "PAY NOW"}
                </PayButton>
                <VerifyButton
                  onClick={handleManualVerify}
                  disabled={manualChecking || checkoutLoading}
                >
                  {manualChecking
                    ? "CHECKING STATUS..."
                    : "I HAVE MADE THE PAYMENT"}
                </VerifyButton>
                <CancelButton onClick={cancelTransaction}>
                  CANCEL TRANSACTION
                </CancelButton>
              </>
            )}

            {isCancelled && (
              <RestartButton onClick={() => window.location.reload()}>
                RETURN TO CHECKOUT
              </RestartButton>
            )}

            <Footer>Payments securely processed by Paystack</Footer>
          </PaymentCard>
        </Main>

        <BottomFooter>
          © {new Date().getFullYear()} ECHOBYTE PAY. All rights reserved.
        </BottomFooter>
      </PageWrapper>
    </>
  );
}

/* =====================================================
   PAGE EXPORT
===================================================== */

export default function Home() {
  return (
    <Suspense
      fallback={
        <>
          <GlobalStyle />
          <FullScreen>
            <Spinner />
            <p>Loading checkout...</p>
          </FullScreen>
        </>
      }
    >
      <Checkout />
    </Suspense>
  );
}

/* =====================================================
   STYLED COMPONENTS
===================================================== */

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const FullScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  color: #64748b;
  font-size: 14px;
`;

const Header = styled.header`
  height: 76px;
  background: white;
  border-bottom: 1px solid #e9edf4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 7%;

  @media (max-width: 600px) {
    padding: 0 20px;
  }
`;

const Logo = styled.div`
  font-size: 25px;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #10234d;

  span {
    color: #1677ff;
  }
`;

const SecureLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
`;

const ShieldIcon = styled.span`
  width: 23px;
  height: 23px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #087b50;
  background: #e4f8ef;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 55px 20px;

  @media (max-width: 600px) {
    padding: 25px 13px;
  }
`;

const PaymentCard = styled.div`
  width: 100%;
  max-width: 475px;
  background: white;
  border: 1px solid #e8edf5;
  border-radius: 17px;
  padding: 35px;
  box-shadow: 0 15px 50px rgba(22, 40, 80, 0.06);

  @media (max-width: 500px) {
    padding: 25px 19px;
  }
`;

const MerchantSection = styled.div`
  text-align: center;
`;

const MerchantLogo = styled.img`
  width: 58px;
  height: 58px;
  border-radius: 12px;
  object-fit: contain;
  margin-bottom: 12px;
`;

const MerchantName = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #17294d;
`;

const MerchantDescription = styled.p`
  font-size: 12px;
  color: #8994a7;
  margin: 8px 0 0;
`;

const Divider = styled.div`
  height: 1px;
  background: #edf0f5;
  margin: 25px 0;
`;

const AmountSection = styled.div`
  text-align: center;
`;

const SmallLabel = styled.div`
  color: #8b96a9;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
`;

const Amount = styled.div`
  margin-top: 12px;
  color: #122650;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -1.5px;

  @media (max-width: 400px) {
    font-size: 32px;
  }
`;

const CurrencyCode = styled.div`
  margin-top: 5px;
  color: #8994a7;
  font-size: 12px;
`;

const CurrencyLabel = styled.div`
  margin-top: 27px;
  text-align: left;
  font-size: 10px;
  font-weight: 800;
  color: #53647e;
  letter-spacing: 0.8px;
`;

const CurrencySelect = styled.select`
  width: 100%;
  margin-top: 9px;
  height: 49px;
  border: 1px solid #dfe5ef;
  background: #fbfcfe;
  border-radius: 9px;
  padding: 0 13px;
  outline: none;
  color: #233653;
  font-size: 13px;

  &:focus {
    border-color: #1677ff;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const ConversionText = styled.p`
  font-size: 11px;
  color: #8491a5;
  text-align: left;
  margin: 9px 0 0;
`;

const CustomerSection = styled.div``;

const CustomerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const CustomerIcon = styled.div`
  width: 42px;
  height: 42px;
  background: #f0f5ff;
  border-radius: 10px;
  display: grid;
  place-items: center;
`;

const CustomerName = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #273955;
`;

const CustomerEmail = styled.div`
  font-size: 12px;
  color: #8994a7;
  margin-top: 4px;
`;

const ReferenceSection = styled.div``;

const Reference = styled.div`
  font-size: 11px;
  margin-top: 9px;
  color: #53647e;
  overflow-wrap: anywhere;
  background: #f7f9fc;
  border-radius: 7px;
  padding: 11px;
`;

const StatusSection = styled.div`
  text-align: center;
  padding: 4px 0 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #1677ff;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const SuccessIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #e4f8ef;
  color: #087b50;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
`;

const CancelledIcon = styled.div`
  width: 32px;
  height: 32px;
  background: #ffeeec;
  color: #e03131;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
  font-size: 18px;
`;

const ErrorIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #ffeeec;
  color: #e03131;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: bold;
  margin: 0 auto 15px;
`;

const StatusText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(props) =>
    props.$success ? "#087b50" : props.$cancelled ? "#e03131" : "#1e293b"};
`;

const StatusDescription = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: #e03131;
  background: #ffeeec;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 6px;
  width: 100%;
`;

const PayButton = styled.button`
  width: 100%;
  height: 52px;
  background: #1677ff;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
  transition: background 0.2s;

  &:hover {
    background: #0958d9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  height: 44px;
  background: transparent;
  color: #64748b;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 12px;
  margin-top: 10px;

  &:hover {
    color: #e03131;
    background: #f8fafc;
  }
`;

const RestartButton = styled.button`
  width: 100%;
  height: 48px;
  background: #f1f5f9;
  color: #334155;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 13px;

  &:hover {
    background: #e2e8f0;
  }
`;

const Footer = styled.div`
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 25px;
`;

const BottomFooter = styled.footer`
  text-align: center;
  padding: 20px;
  font-size: 12px;
  color: #94a3b8;
`;

const TimerBox = styled.div`
  background: #fff8eb;
  border: 1px solid #ffeeba;
  border-radius: 9px;
  padding: 12px;
  text-align: center;
  font-size: 12px;
  color: #856404;
  margin-top: 10px;

  strong {
    display: block;
    font-size: 16px;
    margin-top: 3px;
    letter-spacing: 1px;
  }
`;

const VerifyButton = styled.button`
  width: 100%;
  height: 48px;
  background: #f0f5ff;
  color: #1677ff;
  border: 1px solid #bae0ff;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.4px;
  margin-top: 10px;
  transition: all 0.2s;

  &:hover {
    background: #e6f4ff;
    border-color: #1677ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const WaitingTipBox = styled.div`
  margin-top: 12px;
  background: #f0f7ff;
  border: 1px solid #bae0ff;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 1rem;
  color: #1d39c4;
  text-align: center;
  font-weight: 600;
  line-height: 1.4;
  animation: fadeIn 0.4s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;





// {
//   "tx_ref": "ECHOPAY-PS-TX-998822",
//   "amount": 75000,
//   "currency": "NGN",
//   "projectId": "PROJ-2026-004",
//   "projectName": "EchoByte Digital Store",
//   "customer": {
//     "name": "Victor Ndu",
//     "email": "victherich@gmail.com",
//     "phone_number": "+2348012345678"
//   },
//   "subaccounts": [
//     {
//       "id": "ACCT_a1b2c3d4e5f6g7h8",
//       "bearer": "account"
//     }
//   ],
//   "channels": ["card", "bank", "ussd", "bank_transfer"],
//   "customizations": {
//     "title": "EchoByte Concept Academy",
//     "description": "Full-Stack Web Development Masterclass",
//     "logo": "https://echobytedigital.web.app/logo.png"
//   },
//   "meta": {
//     "course_id": "FSWD-2026",
//     "cohort": "Batch 3"
//   },
//   "success_url": "https://myclientproject.com/checkout/success"
// }



// http://localhost:3000/paystack?params=%7B%22tx_ref%22%3A%22ECHOPAY-PS-TX-998822%22%2C%22amount%22%3A75000%2C%22currency%22%3A%22NGN%22%2C%22projectId%22%3A%22PROJ-2026-004%22%2C%22projectName%22%3A%22EchoByte%20Digital%20Store%22%2C%22customer%22%3A%7B%22name%22%3A%22Victor%20Ndu%22%2C%22email%22%3A%22victherich%40gmail.com%22%2C%22phone_number%22%3A%22%2B2348012345678%22%7D%2C%22subaccounts%22%3A%5B%7B%22id%22%3A%22ACCT_a1b2c3d4e5f6g7h8%22%2C%22bearer%22%3A%22account%22%7D%5D%2C%22channels%22%3A%5B%22card%22%2C%22bank%22%2C%22ussd%22%2C%22bank_transfer%22%5D%2C%22customizations%22%3A%7B%22title%22%3A%22EchoByte%20Concept%20Academy%22%2C%22description%22%3A%22Full-Stack%20Web%20Development%20Masterclass%22%2C%22logo%22%3A%22https%3A%2F%2Fechobytedigital.web.app%2Flogo.png%22%7D%2C%22meta%22%3A%7B%22course_id%22%3A%22FSWD-2026%22%2C%22cohort%22%3A%22Batch%203%22%7D%2C%22success_url%22%3A%22https%3A%2F%2Fmyclientproject.com%2Fcheckout%2Fsuccess%22%7D

