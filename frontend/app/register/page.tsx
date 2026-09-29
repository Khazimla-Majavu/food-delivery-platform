import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center justify-center px-6 py-16 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Join Chow
            </p>

            <h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em]">
              Create an account
            </h1>

            <p className="mt-4 text-base leading-7 text-neutral-500">
              Create your Chow account and start ordering from local restaurants.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
            <RegisterForm />

            <p className="mt-8 text-center text-sm text-neutral-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-black underline underline-offset-4 transition hover:text-neutral-600"
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
