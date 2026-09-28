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
    <main className="min-h-screen bg-gray-50">
      <section className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">Log in</h1>

          <p className="mt-2 text-gray-600">
            Log in to your FoodDelivery account.
          </p>

          <div className="mt-8">
            <LoginForm redirect={redirect} />
          </div>
        </div>
      </section>
    </main>
  );
}
