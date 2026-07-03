"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [showQR, setShowQR] = useState(false);
  const [amount, setAmount] = useState(0);
  const [plan, setPlan] = useState("");

  const buy = (price: number, packageName: string) => {
    setAmount(price);
    setPlan(packageName);
    setShowQR(true);
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-purple-700 bg-zinc-950 p-8 text-center">
        <p className="font-bold text-purple-400">SHOP PREMIUM</p>
        <h1 className="mt-4 text-6xl font-black">CAPCUT PRO</h1>
        <p className="mt-4 text-zinc-300">Chỉnh sửa video chuyên nghiệp – mọi lúc, mọi nơi</p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-purple-500 bg-zinc-950 p-8">
            <h2 className="text-3xl font-bold">7 NGÀY</h2>
            <p className="mt-6 text-6xl font-black text-purple-400">10K</p>
            <p className="mt-2 text-zinc-400">10.000đ</p>
            <button onClick={() => buy(10000, "7 ngày")} className="mt-6 w-full rounded-full bg-purple-600 py-3 font-bold">
              Mua ngay
            </button>
          </div>

          <div className="rounded-3xl border border-blue-500 bg-zinc-950 p-8">
            <h2 className="text-3xl font-bold">30 NGÀY</h2>
            <p className="mt-6 text-6xl font-black text-blue-400">50K</p>
            <p className="mt-2 text-zinc-400">50.000đ</p>
            <button onClick={() => buy(50000, "30 ngày")} className="mt-6 w-full rounded-full bg-blue-600 py-3 font-bold">
              Mua ngay
            </button>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
          <h3 className="text-2xl font-black">✂️ THÔNG TIN SẢN PHẨM</h3>
          <ul className="mt-5 space-y-3 text-zinc-300">
            <li>✅ Đăng nhập tối đa 2 thiết bị (PC / Điện thoại).</li>
            <li>✅ Không chia sẻ tài khoản cho người khác dùng chung.</li>
            <li>✅ Không đổi tên user để shop check kỹ tài khoản.</li>
            <li>🛡️ <b>Bảo hành:</b> Trong hạn sử dụng, vi phạm các điều trên là mất bảo hành.</li>
          </ul>
        </div>

        <div className="mt-8 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-6">
          <h3 className="text-2xl font-black">THÔNG TIN LIÊN HỆ MUA</h3>
          <p className="mt-3 text-3xl font-black">0899.593.209</p>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-900 p-6 text-center">
            <h2 className="text-2xl font-bold">Thanh toán {plan}</h2><p className="mt-3 text-zinc-300">Số tiền</p>
            <p className="text-4xl font-black text-purple-400">{amount.toLocaleString("vi-VN")}đ</p>

            <div className="mt-5 flex justify-center">
              <Image src="/qr.jpg" alt="QR thanh toán" width={260} height={260} />
            </div>

            <div className="mt-5 text-left text-sm text-zinc-300">
              <p><b>Nội dung:</b> CAPCUT</p>
              <p><b>SĐT shop:</b> 0899.593.209</p>
            </div>

            <button onClick={() => setShowQR(false)} className="mt-6 w-full rounded-full bg-purple-600 py-3 font-bold">
              Đóng
            </button>
          </div>
        </div>
      )}
    </main>
  );
}