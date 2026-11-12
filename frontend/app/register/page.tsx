import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[var(--chow-bg)] text-[#F3EFE5]">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8B7AE]">
              Join Chow
            </p>

            <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.04em]">
              Create an account
            </h1>

            <p className="mt-4 text-base leading-7 text-[#B8B7AE]">
              Create your Chow account and start ordering from local restaurants.
            </p>
          </div>

          <div className="rounded-3xl border border-[#303D3E] bg-[#1C2728] p-8 shadow-xl sm:p-10">
            <RegisterForm />

            <p className="mt-8 text-center text-sm text-[#B8B7AE]">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-[#A8DFC5] underline underline-offset-4 transition hover:text-[#F3EFE5]"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
