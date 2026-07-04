import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const { data, error } = await supabase
  .from("orders")
  .select("*");

console.log("Orders:", data);
console.log("Error:", error);

  if (!code) {
    return NextResponse.json({
      success: false,
      message: "Thiếu mã chuyển khoản",
    });
  }

  // Tìm đơn hàng đã thanh toán
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("order_code", code)
    .eq("status", "paid")
    .single();

  if (!order) {
    return NextResponse.json({
      success: false,
    });
  }

  // Lấy tài khoản chưa sử dụng
  const { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("used", false)
    .limit(1)
    .single();

  if (!account) {
    return NextResponse.json({
      success: false,
      message: "Hết tài khoản",
    });
  }

  // Đánh dấu đã dùng
  await supabase
    .from("accounts")
    .update({ used: true })
    .eq("id", account.id);

    account.used = true;

  return NextResponse.json({
    success: true,
    account,
  });
}