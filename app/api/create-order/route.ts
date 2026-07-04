import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("CREATE ORDER BODY:", body);

    const { orderCode, amount } = body;

    if (!orderCode || !amount) {
      return NextResponse.json({
        success: false,
        error: "Thiếu orderCode hoặc amount",
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_code: orderCode,
        amount,
        status: "pending",
      })
      .select();

    if (error) {
      console.log("CREATE ORDER ERROR:", error);
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    console.log("CREATE ORDER SERVER ERROR:", err);
    return NextResponse.json({
      success: false,
      error: "Server lỗi",
    });
  }
}