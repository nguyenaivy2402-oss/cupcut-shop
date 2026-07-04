import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ success: false });
  }

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_code", code)
    .eq("status", "paid")
    .single();

  if (!order) {
    return NextResponse.json({ success: false });
  }

  return NextResponse.json({
    success: true,
    account: {
      email: order.account_username,
      password: order.account_password,
    },
  });
}