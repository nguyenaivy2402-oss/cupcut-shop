import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Webhook:", body);

    const amount = Number(body.transferAmount || body.amount || 0);
    const content = String(
      body.content || body.description || body.referenceCode || body.id || ""
    );

    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending");

    const order = orders?.find((o) => content.includes(o.order_code));

    if (!order) {
      return NextResponse.json({ success: false, message: "Không tìm thấy đơn" });
    }

    if (amount < order.amount) {
      return NextResponse.json({ success: false, message: "Sai số tiền" });
    }

    const productId = order.amount >= 50000 ? 1 : 0;

    const orderRes = await fetch("https://nasnabisupermarket.com/nasnabi-bot/orders", {
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
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok || !orderData.ok) {
      return NextResponse.json({
        success: false,
        message: "Nasnabi lỗi",
        nasnabi: orderData,
      });
    }

    const rawAccount = orderData.order?.accounts?.[0] || "";
    const [username, password] = rawAccount.split("|");

    await supabase
      .from("orders")
      .update({
        status: "paid",
        account_username: username,
        account_password: password,
      })
      .eq("id", order.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Webhook lỗi" });
  }
}