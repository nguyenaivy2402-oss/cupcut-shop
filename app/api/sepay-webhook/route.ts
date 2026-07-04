import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, message: "Webhook alive" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("SEPAY BODY:", JSON.stringify(body));

    const amount = Number(
      body.transferAmount || body.amount || body.money || body.value || 0
    );

    const content = Object.values(body).join(" ");
    console.log("CONTENT:", content);
    console.log("AMOUNT:", amount);

    const { data: orders, error: findError } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending");

    if (findError) {
      console.log("SUPABASE FIND ERROR:", findError);
      return NextResponse.json({ success: false, error: findError.message });
    }

    const order = orders?.find((o) => content.includes(o.order_code));

    if (!order) {
      console.log("NO ORDER MATCH:", content);
      return NextResponse.json({ success: false, message: "Không tìm thấy đơn" });
    }

    if (amount < order.amount) {
      console.log("WRONG AMOUNT:", amount, order.amount);
      return NextResponse.json({ success: false, message: "Sai số tiền" });
    }

    const productId = order.amount >= 50000 ? 1 : 0;

    const res = await fetch("https://nasnabisupermarket.com/nasnabi-bot/orders", {
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

    const data = await res.json();
    console.log("NASNABI:", JSON.stringify(data));

    const raw = data?.order?.accounts?.[0];

    if (!raw) {
      return NextResponse.json({
        success: false,
        message: "Nasnabi không trả tài khoản",
        nasnabi: data,
      });
    }

    const [username, password] = String(raw).split("|");

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        account_username: username,
        account_password: password,
      })
      .eq("id", order.id);

    if (updateError) {
      console.log("UPDATE ERROR:", updateError);
      return NextResponse.json({ success: false, error: updateError.message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("WEBHOOK ERROR:", error);
    return NextResponse.json({ success: false, message: "Webhook lỗi" });
  }
}