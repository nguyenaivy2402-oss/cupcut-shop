import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { orderCode, amount } = body;

  const { error } = await supabase.from("orders").insert({
    order_code: orderCode,
    amount,
    status: "pending",
  });

  if (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }

  return NextResponse.json({
    success: true,
  });
}