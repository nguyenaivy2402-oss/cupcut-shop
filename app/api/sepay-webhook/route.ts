import { NextResponse } from "next/server";

type SePayBody = {
  transferAmount?: number;
  amount?: number;
  referenceCode?: string;
  id?: string | number;
};

export async function POST(req: Request) {
  try {
    const body: SePayBody = await req.json();
    console.log("SePay webhook:", body);

    const amount = Number(body.transferAmount || body.amount || 0);

    let productId = 0;

    if (amount >= 50000) {
      productId = 1; // 30 ngày
    } else if (amount >= 10000) {
      productId = 0; // 7 ngày
    } else {
      return NextResponse.json({
        success: false,
        message: "Số tiền không hợp lệ",
        amount,
      });
    }

    const shopOrderId = String(
      body.referenceCode || body.id || `SEPAY-${Date.now()}`
    );

    const orderRes = await fetch(
      "https://nasnabisupermarket.com/nasnabi-bot/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": process.env.NASNABI_API_KEY || "",
        },
        body: JSON.stringify({
          productId,
          qty: 1,
          shopOrderId,
        }),
      }
    );

    const orderData = await orderRes.json();

    if (!orderRes.ok || !orderData.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Nasnabi tạo đơn lỗi",
          nasnabi: orderData,
        },
        { status: 200 }
      );
    }

    const rawAccount = orderData.order?.accounts?.[0] || "";
    const [username, password] = rawAccount.split("|");

    return NextResponse.json({
      success: true,
      message: "Đã cấp tài khoản",
      amount,
      productId,
      orderCode: orderData.order?.orderCode,
      account: {
        username,
        password,
        raw: rawAccount,
      },
    });
  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi server webhook",
      },
      { status: 200 }
    );
  }
}