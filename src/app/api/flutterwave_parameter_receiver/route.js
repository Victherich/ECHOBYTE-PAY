import { NextResponse } from "next/server";

// Helper function to attach CORS headers to any response
function setCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*"); // Or specify allowed domains, e.g., "https://yourclientdomain.com"
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

// Handle browser preflight OPTIONS requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  return setCorsHeaders(response);
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate minimum required fields
    if (!body || !body.tx_ref || !body.amount || !body.customer?.email) {
      const errorResponse = NextResponse.json(
        { success: false, error: "Missing required payment parameters (tx_ref, amount, customer email)." },
        { status: 400 }
      );
      return setCorsHeaders(errorResponse);
    }

    // Construct the central payment frontend URL with the serialized parameters
    const centralFrontendUrl = process.env.NEXT_PUBLIC_CENTRAL_FRONTEND_URL || "https://pay.echobyte.com";
    const serializedParams = encodeURIComponent(JSON.stringify(body));
    const redirectUrl = `${centralFrontendUrl}/?params=${serializedParams}`;

    const successResponse = NextResponse.json({
      success: true,
      redirectUrl: redirectUrl,
    });

    return setCorsHeaders(successResponse);

  } catch (err) {
    console.error("Backend payment route error:", err);
    const errorResponse = NextResponse.json(
      { success: false, error: "Failed to process payment parameters." },
      { status: 500 }
    );
    return setCorsHeaders(errorResponse);
  }
}