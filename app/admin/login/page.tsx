import type { Metadata } from "next";
import { signIn } from "./actions";

export const metadata: Metadata = {
  title: "Admin sign in",
};

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main className="flex min-h-screen items-center bg-gesso px-5 py-12 text-ink sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.82fr] lg:gap-20">
        <div className="max-w-xl">
          <p className="font-body text-[0.66rem] uppercase tracking-[0.22em] text-ink/50">B-Edge Artworks <span className="px-2 text-gilt">/</span> Private workspace</p>
          <h1 className="mt-6 font-display text-5xl italic leading-[1.05] tracking-tight text-ink sm:text-6xl">
            The gallery, <span className="text-ink/45">behind the scenes.</span>
          </h1>
          <p className="mt-6 max-w-md font-body text-base leading-8 text-ink/60">
            Sign in to manage artworks, artist profiles, collection details, and messages from collectors.
          </p>
          <div className="mt-12 hidden border-t border-ink/15 pt-5 sm:block">
            <span className="font-body text-[0.62rem] uppercase tracking-[0.18em] text-ink/40">B-Edge Artworks · Studio administration</span>
          </div>
        </div>

        <div className="border border-ink/12 bg-white p-7 sm:p-10">
          <p className="font-body text-[0.63rem] uppercase tracking-[0.2em] text-ink/45">Administrator access</p>
          <h2 className="mt-3 font-display text-3xl italic text-ink">Welcome back.</h2>
          <p className="mt-2 font-body text-sm leading-6 text-ink/55">Enter your account details to continue.</p>

          {searchParams.error && (
            <p role="alert" className="mt-6 border border-red-200 bg-red-50 px-4 py-3 font-body text-sm text-red-800">
              {searchParams.error}
            </p>
          )}

          <form action={signIn} className="mt-8 grid gap-6">
            <div>
              <label htmlFor="email" className="font-body text-[0.66rem] uppercase tracking-[0.16em] text-ink/60">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full border border-ink/15 bg-white px-3 py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="font-body text-[0.66rem] uppercase tracking-[0.16em] text-ink/60">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full border border-ink/15 bg-white px-3 py-3 font-body text-sm text-ink placeholder:text-ink/35 focus:border-gilt focus:outline-none focus:ring-2 focus:ring-gilt/20"
              />
            </div>
            <button
              type="submit"
              className="mt-2 flex min-h-12 w-full items-center justify-center border border-ink bg-ink px-6 py-3 font-body text-[0.68rem] uppercase tracking-[0.18em] text-gesso transition-colors hover:border-gilt hover:bg-gilt hover:text-ink"
            >
              Sign in to workspace <span aria-hidden className="ml-3 text-gilt">↗</span>
            </button>
          </form>
          <p className="mt-7 border-t border-ink/10 pt-5 font-body text-xs leading-5 text-ink/45">
            Access is restricted to authorised B-Edge Artworks administrators.
          </p>
        </div>
      </div>
    </main>
  );
}
