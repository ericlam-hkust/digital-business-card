import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { cardConfig } from "@/config/card.config";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({ expired: s["expired"] === "1" || s["expired"] === 1 ? "1" : undefined }),
  head: () => ({
    meta: [
      { title: "Sign in | Card settings" },
      { name: "description", content: "Private sign-in for the card owner." },
      { property: "og:title", content: "Sign in | Card settings" },
      { property: "og:description", content: "Private sign-in for the card owner." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { expired } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin/settings", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) navigate({ to: "/admin/settings", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!z.string().email().safeParse(email.trim()).success) {
      setState("error");
      setError("Enter a valid email address.");
      return;
    }
    setState("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/admin/login` },
    });
    if (error) {
      // Same message for unknown accounts, so the page doesn't reveal who has access.
      setState("error");
      setError(/rate|seconds/i.test(error.message) ? "Too many attempts. Please wait a minute and try again." : "We couldn't send a sign-in link to that address.");
      return;
    }
    setState("sent");
  };

  return (
    <div className="grid min-h-dvh place-items-center bg-background px-4">
      <main className="w-full max-w-sm rounded-3xl border border-border bg-card p-6">
        {cardConfig.logoUrl && <img src={cardConfig.logoUrl} alt="Tonric" className="h-6 w-auto" />}
        <h1 className="mt-5 text-xl font-semibold">Card settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in with the owner email. We'll email you a one-time link.</p>
        {expired && <p role="alert" className="mt-4 rounded-lg border border-primary/40 px-3 py-2 text-sm text-primary">Your session ended. Please sign in again.</p>}
        {state === "sent" ? (
          <p role="status" className="mt-5 rounded-xl bg-secondary p-4 text-sm">Check your inbox for the sign-in link. You can close this tab after opening it.</p>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <label className="block text-sm font-medium">
              Email
              <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" />
            </label>
            {state === "error" && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <button type="submit" disabled={state === "sending"} className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground disabled:opacity-60">
              {state === "sending" ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
