import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="text-2xl font-bold text-orange-600">
            FoodDelivery
          </a>

          <a
            href="/register"
            className="text-sm font-medium text-gray-700 hover:text-orange-600"
          >
            Create an account
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">
            Log in
          </h1>

          <p className="mt-2 text-gray-600">
            Log in to your FoodDelivery account.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-orange-600 hover:text-orange-700"
            >
              Register
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
