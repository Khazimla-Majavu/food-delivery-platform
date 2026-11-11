import LoginForm from "../components/LoginForm";

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;
  const redirect = params.redirect || "/";

  return (
    <main className="min-h-screen bg-[var(--chow-bg)] text-[#F3EFE5]">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B8B7AE]">
              Welcome back
            </p>

            <h1 className="mt-3 font-serif text-5xl font-semibold tracking-[-0.04em]">
              Log in
            </h1>

            <p className="mt-4 text-base leading-7 text-[#B8B7AE]">
              Log in to your Chow account to continue your order.
            </p>
          </div>

          <div className="rounded-3xl border border-[#303D3E] bg-[#1C2728] p-8 shadow-xl shadow-black/10 sm:p-10">
            <LoginForm redirect={redirect} />
          </div>
        </div>
      </section>
    </main>
  );
}
