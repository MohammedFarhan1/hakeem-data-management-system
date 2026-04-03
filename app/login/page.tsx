import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(15,92,77,0.16),_transparent_30%),linear-gradient(180deg,_#f8f6f1,_#eef4f0)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.2fr,0.8fr]">
        <section className="rounded-[40px] border border-white/70 bg-white/75 p-8 shadow-float backdrop-blur md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest/70">Secure academic operations</p>
          <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-tight text-ink md:text-6xl">
            Centralize departmental evidence, reports, and institutional records.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            HDMS gives Admin and Faculty teams a structured workflow to submit records, store evidence, review trends,
            and generate export-ready reports from one protected platform.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] bg-tide p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-forest/70">Reusable</p>
              <p className="mt-3 text-lg font-semibold">16 dynamic form categories</p>
            </div>
            <div className="rounded-[24px] bg-[#fff4d8] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-saffron/90">Secure</p>
              <p className="mt-3 text-lg font-semibold">Supabase Auth, RLS, private storage</p>
            </div>
            <div className="rounded-[24px] bg-[#fde6e2] p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-coral/90">Report-ready</p>
              <p className="mt-3 text-lg font-semibold">Dashboard analytics, CSV, and PDF</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-float backdrop-blur">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-forest/70">HDMS Login</p>
            <h2 className="mt-3 font-serif text-3xl text-ink">Sign in to continue</h2>
            <p className="mt-3 text-sm text-slate-600">
              User accounts should be provisioned in Supabase Auth and mapped to `public.users`.
            </p>
          </div>

          <LoginForm />
        </section>
      </div>
    </div>
  );
}
