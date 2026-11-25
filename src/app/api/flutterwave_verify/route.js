


// import { NextResponse } from "next/server";

// const CORS_HEADERS = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// function jsonWithCors(body, init = {}) {
//   return NextResponse.json(body, {
//     ...init,
//     headers: {
//       ...CORS_HEADERS,
//       ...(init.headers || {}),
//     },
//   });
// }

// export async function OPTIONS() {
//   return new NextResponse(null, {
//     status: 204,
//     headers: CORS_HEADERS,
//   });
// }

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const tx_ref = searchParams.get("tx_ref");

//     if (!tx_ref) {
//       return jsonWithCors(
//         { success: false, error: "Missing transaction reference (tx_ref)." },
//         { status: 400 }
//       );
//     }

//     const secretKey = process.env.FLW_SECRET_KEY;

//     if (!secretKey) {
//       console.error("FLW_SECRET_KEY is missing from environment variables.");
//       return jsonWithCors(
//         { success: false, error: "Server payment configuration error." },
//         { status: 500 }
//       );
//     }

//     // Call Flutterwave API to fetch transaction details by reference
//     const flwResponse = await fetch(
//       `https://api.flutterwave.com/v3/transactions?tx_ref=${encodeURIComponent(
//         tx_ref
//       )}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${secretKey}`,
//           "Content-Type": "application/json",
//         },
//         cache: "no-store",
//       }
//     );

//     const flwResult = await flwResponse.json();

//     // Check if Flutterwave returned a valid transaction array
//     if (
//       !flwResponse.ok ||
//       flwResult.status !== "success" ||
//       !Array.isArray(flwResult.data) ||
//       flwResult.data.length === 0
//     ) {
//       return jsonWithCors({
//         success: false,
//         message: "Transaction not found or confirmation pending.",
//       });
//     }

//     // Flutterwave returns an array of matching records; take the first one
//     const transaction = flwResult.data[0];

//     return jsonWithCors({
//       success: true,
//       data: {
//         id: transaction.id,
//         tx_ref: transaction.tx_ref,
//         flw_ref: transaction.flw_ref,
//         amount: transaction.amount,
//         charged_amount: transaction.charged_amount,
//         currency: transaction.currency,
//         status: transaction.status, // "successful", "failed", "pending"
//         payment_type: transaction.payment_type,
//         processor_response: transaction.processor_response,
//         customer: transaction.customer,
//         created_at: transaction.created_at,
//       },
//     });
//   } catch (err) {
//     console.error("Payment verification API error:", err);
//     return jsonWithCors(
//       { success: false, error: "Internal server error while verifying payment." },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonWithCors(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      ...CORS_HEADERS,
      ...(init.headers || {}),
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tx_ref = searchParams.get("tx_ref");
    const transaction_id = searchParams.get("transaction_id");

    if (!tx_ref && !transaction_id) {
      return jsonWithCors(
        { success: false, error: "Missing transaction reference (tx_ref) or transaction_id." },
        { status: 400 }
      );
    }

    const secretKey = process.env.FLW_SECRET_KEY;

    if (!secretKey) {
      console.error("FLW_SECRET_KEY is missing from environment variables.");
      return jsonWithCors(
        { success: false, error: "Server payment configuration error." },
        { status: 500 }
      );
    }

    // 1. FASTEST: Verify directly by Flutterwave transaction ID if available,
    //    otherwise use Flutterwave's dedicated verify_by_reference endpoint.
    const flwUrl = transaction_id
      ? `https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transaction_id)}/verify`
      : `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(tx_ref)}`;

    const flwResponse = await fetch(flwUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const flwResult = await flwResponse.json();

    // Both endpoints return a single transaction object in flwResult.data
    const transaction = Array.isArray(flwResult.data)
      ? flwResult.data[0]
      : flwResult.data;

    if (!flwResponse.ok || flwResult.status !== "success" || !transaction) {
      return jsonWithCors({
        success: false,
        pending: true,
        message: "Transaction not found or confirmation pending.",
      });
    }

    // Ensure tx_ref matches if both were supplied
    if (tx_ref && transaction.tx_ref !== tx_ref) {
      return jsonWithCors(
        { success: false, error: "Transaction reference mismatch." },
        { status: 400 }
      );
    }

    return jsonWithCors({
      success: true,
      data: {
        id: transaction.id,
        tx_ref: transaction.tx_ref,
        flw_ref: transaction.flw_ref,
        amount: transaction.amount,
        charged_amount: transaction.charged_amount,
        currency: transaction.currency,
        status: transaction.status, // "successful", "failed", "pending"
        payment_type: transaction.payment_type,
        processor_response: transaction.processor_response,
        customer: transaction.customer,
        created_at: transaction.created_at,
      },
    });
  } catch (err) {
    console.error("Payment verification API error:", err);
    return jsonWithCors(
      { success: false, error: "Internal server error while verifying payment." },
      { status: 500 }
    );
  }
}