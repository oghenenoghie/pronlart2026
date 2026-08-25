import type { Metadata } from "next";
import { signIn } from "./actions";

export const metadata: Metadata = {
  title: "Admin sign in",
};

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="font-body text-label uppercase tracking-[0.18em] text-ash">Pronlart</p>
      <h1 className="mt-2 font-display text-h2 italic text-gesso">Admin sign in</h1>

      {searchParams.error && <p className="mt-4 font-body text-sm text-red-400">{searchParams.error}</p>}

      <form action={signIn} className="mt-8 grid gap-6">
        <div>
          <label htmlFor="email" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="font-body text-label uppercase tracking-[0.18em] text-ash">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full border border-line bg-ink px-3 py-2 font-body text-sm text-gesso focus:border-gilt focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-fit border border-gilt px-6 py-2.5 font-body text-label uppercase tracking-[0.18em] text-gesso transition-colors hover:bg-gilt hover:text-ink"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
