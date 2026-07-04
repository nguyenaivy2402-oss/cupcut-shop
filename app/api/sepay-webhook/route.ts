import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook body:", body);

    const amount = Number(body.transferAmount || body.amount || 0);
    const content = String(
      body.content ||
        body.description ||
        body.transferContent ||
        body.referenceCode ||
        body.id ||
        ""
    );

    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending");

    const order = orders?.find((o) => content.includes(o.order_code));

    if (!order) {
      return NextResponse.json({
        success: false,
        message: "Không tìm thấy đơn pending",
        content,
      });
    }

    if (amount < order.amount) {
      return NextResponse.json({
        success: false,
        message: "Sai số tiền",
        amount,
        required: order.amount,
      });
    }

    const productId = order.amount >= 50000 ? 1 : 0;

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
          shopOrderId: order.order_code,
        }),
      }
    );

    const orderData = await orderRes.json();
    console.log("Nasnabi response:", JSON.stringify(orderData, null, 2));

    const rawAccount =
      orderData?.order?.accounts?.[0] ||
      orderData?.accounts?.[0] ||
      orderData?.data?.accounts?.[0] ||
      orderData?.data?.order?.accounts?.[0] ||
      "";

    if (!orderRes.ok || !rawAccount) {
      return NextResponse.json({
        success: false,
        message: "Nasnabi không trả tài khoản",
        nasnabi: orderData,
      });
    }

    let username = "";
    let password = "";

    if (typeof rawAccount === "string") {
      const parts = rawAccount.includes("|")
        ? rawAccount.split("|")
        : rawAccount.split(":");

      username = parts[0]?.trim() || "";
      password = parts[1]?.trim() || "";
    } else {
      username = rawAccount.username || rawAccount.email || rawAccount.account || "";
      password = rawAccount.password || rawAccount.pass || "";
    }

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: "Không tách được username/password",
        rawAccount,
      });
    }

    await supabase
      .from("orders")
      .update({
        status: "paid",
        account_username: username,
        account_password: password,
      })
      .eq("id", order.id);

    return NextResponse.json({
      success: true,
      message: "Đã xác nhận thanh toán và cấp tài khoản",
      order_code: order.order_code,
    });
  } catch (error) {console.error("Webhook error:", error);

    return NextResponse.json({
      success: false,
      message: "Lỗi server webhook",
    });
  }
}