import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Account = {
  username: string;
  password: string;
  sold: boolean;
};

export async function POST(req: Request) {
  const body = await req.json();
  console.log("SePay webhook:", body);

  const filePath = path.join(process.cwd(), "data", "accounts.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const accounts: Account[] = JSON.parse(raw);

  const account = accounts.find((acc) => acc.sold === false);

  if (!account) {
    return NextResponse.json({
      success: false,
      message: "Hết tài khoản",
    });
  }

  return NextResponse.json({
    success: true,
    message: "Đã cấp tài khoản",
    account: {
      username: account.username,
      password: account.password,
    },
  });
}