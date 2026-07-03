export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <section className="mx-auto max-w-5xl text-center">
        <div className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-zinc-950 via-black to-purple-950 p-8 shadow-2xl">
          <p className="text-purple-400 font-bold">SHOP PREMIUM</p>
          <h1 className="mt-4 text-5xl font-black">CAPCUT PRO</h1>
          <p className="mt-3 text-zinc-300">
            Chỉnh sửa video chuyên nghiệp – mọi lúc, mọi nơi
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-purple-500 bg-zinc-950 p-8">
              <h2 className="text-3xl font-bold">7 NGÀY</h2>
              <p className="mt-6 text-6xl font-black text-purple-400">10K</p>
              <p className="mt-2 text-zinc-400">10.000đ</p>
              <button className="mt-6 w-full rounded-full bg-purple-600 py-3 font-bold hover:bg-purple-500">
                Mua ngay
              </button>
            </div>

            <div className="rounded-3xl border border-blue-500 bg-zinc-950 p-8">
              <h2 className="text-3xl font-bold">30 NGÀY</h2>
              <p className="mt-6 text-6xl font-black text-blue-400">50K</p>
              <p className="mt-2 text-zinc-400">50.000đ</p>
              <button className="mt-6 w-full rounded-full bg-blue-600 py-3 font-bold hover:bg-blue-500">
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
              <li>
                🛡️ <b>Bảo hành:</b> Trọn hạn sử dụng, vi phạm các điều trên là mất bảo hành.
              </li>
            </ul>
          </div>

          <div className="mt-8 rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 p-6">
            <h3 className="text-2xl font-black">THÔNG TIN LIÊN HỆ MUA</h3>
            <p className="mt-3 text-3xl font-black">0899.593.209</p>
          </div>
        </div>
      </section>
    </main>
  );
}