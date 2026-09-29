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
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Welcome back
            </p>

            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em]">
              Log in
            </h1>

            <p className="mt-4 text-base leading-7 text-neutral-500">
              Log in to your Chow account to continue your order.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
            <LoginForm redirect={redirect} />
          </div>
        </div>
      </section>
    </main>
  );
}
