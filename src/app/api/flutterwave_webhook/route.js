// app/api/flutterwave/webhook/route.js
import crypto from "crypto";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs"; // firebase-admin requires the Node runtime
export const dynamic = "force-dynamic";

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

export async function POST(request) {
  try {
    const secretHash = process.env.FLW_SECRET_HASH?.trim();
    const secretKey = process.env.FLW_SECRET_KEY?.trim();
    const signature = request.headers.get("verif-hash")?.trim();

    if (!secretHash || !secretKey) {
      console.error("Missing FLW_SECRET_HASH or FLW_SECRET_KEY env vars.");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    if (!signature || !safeEqual(signature, secretHash)) {
      // Never log the received signature
      console.warn("Webhook signature mismatch (401).");
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature." },
        { status: 401 }
      );
    }

    const payload = await request.json();

    // Support both nested { event, data } and flat v3 test webhook payloads
    const rawData =
      payload?.data && typeof payload.data === "object" ? payload.data : payload;

    const transactionId = rawData?.id;
    const incomingTxRef = rawData?.tx_ref || rawData?.txRef || null;
    const eventName =
      payload?.event ||
      payload?.["event.type"] ||
      rawData?.charge_type ||
      "unknown";

    if (!transactionId) {
      console.error("Webhook missing transaction id:", payload);
      return NextResponse.json(
        { success: false, error: "Missing transaction id in webhook payload." },
        { status: 400 }
      );
    }

    // Re-query Flutterwave to confirm the real status
    let verifiedTx = rawData;
    let verified = false;

    try {
      const verifyResponse = await fetch(
        `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(
          String(transactionId)
        )}/verify`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      const verifyResult = await verifyResponse.json();

      if (
        verifyResponse.ok &&
        verifyResult.status === "success" &&
        verifyResult.data
      ) {
        verifiedTx = verifyResult.data;
        verified = true;
      } else {
        console.warn(
          "Verify failed for tx id:",
          transactionId,
          verifyResult?.message
        );
      }
    } catch (verifyErr) {
      console.warn("Verify fetch error, using webhook payload:", verifyErr);
    }

    const finalTxRef = String(
      verifiedTx?.tx_ref || verifiedTx?.txRef || incomingTxRef || transactionId
    ).trim();

    // Slashes would break Firestore document paths
    const docId = finalTxRef.replace(/\//g, "_");

    const webhookRecord = {
      event: eventName,
      // false means the data came only from the webhook body (e.g. dashboard
      // test webhooks). Do NOT mark orders as paid when this is false.
      verified,
      transactionId: verifiedTx.id ?? transactionId,
      tx_ref: finalTxRef,
      flw_ref:
        verifiedTx.flw_ref || verifiedTx.flwRef || rawData.flwRef || null,
      status: verifiedTx.status || rawData.status || null,
      amount: Number(verifiedTx.amount ?? rawData.amount ?? 0),
      charged_amount: Number(
        verifiedTx.charged_amount ?? rawData.charged_amount ?? 0
      ),
      app_fee: Number(verifiedTx.app_fee ?? rawData.appfee ?? 0),
      merchant_fee: Number(verifiedTx.merchant_fee ?? rawData.merchantfee ?? 0),
      currency: verifiedTx.currency || rawData.currency || null,
      payment_type:
        verifiedTx.payment_type ||
        payload?.["event.type"] ||
        rawData.charge_type ||
        null,
      processor_response: verifiedTx.processor_response || null,
      customer: verifiedTx.customer || rawData.customer || {},
      entity: rawData.entity || null,
      rawWebhookPayload: payload,
      verifiedData: verifiedTx,
      receivedAt: new Date().toISOString(),
    };

    try {
      const db = getAdminDb();
      await db
        .collection("flutterwave_webhooks")
        .doc(docId)
        .set(webhookRecord, { merge: true });

      console.log("Saved webhook to Firestore flutterwave_webhooks:", docId);
    } catch (fsErr) {
      console.error("Firestore write failed:", {
        code: fsErr?.code,
        message: fsErr?.message,
        docId,
      });
      return NextResponse.json(
        { success: false, error: "Firestore write failed." },
        { status: 500 }
      );
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Flutterwave webhook processing error:", err);
    return NextResponse.json(
      { success: false, error: "Internal webhook processing error." },
      { status: 500 }
    );
  }
}