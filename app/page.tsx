import Link from "next/link";
import { ArrowUpRight, Lock, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <section className="flex min-h-[78vh] flex-col justify-center">
      <p className="eyebrow">Members only. Everyone else, welcome.</p>
      <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] sm:text-7xl">
        For you, it&apos;s pocket change.<br />
        <span className="text-gold">For them, it&apos;s breathing room.</span>
      </h1>
      <p className="mt-6 max-w-xl text-white/60">
        An anonymous exchange where the very wealthy erase the small, absurd bills
        that ruin ordinary weeks. No thanks required. None accepted.
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        <Link href="/submit"
          className="group border border-edge bg-vault p-8 transition hover:border-gold">
          <Sparkles size={18} className="text-gold" />
          <h2 className="mt-8 font-serif text-3xl">Submit an Injustice</h2>
          <p className="mt-2 text-sm text-white/50">A fine. A leak. A bill with a sense of humor.</p>
          <span className="mt-8 flex items-center gap-1 text-xs uppercase tracking-widest text-white/60 group-hover:text-gold">
            Plead your case <ArrowUpRight size={14} />
          </span>
        </Link>
        <Link href="/vault"
          className="group border border-gold/50 bg-gold/5 p-8 transition hover:bg-gold/10">
          <Lock size={18} className="text-gold" />
          <h2 className="mt-8 font-serif text-3xl">Enter the Vault</h2>
          <p className="mt-2 text-sm text-white/50">Browse the pool. Erase one. Tell no one.</p>
          <span className="mt-8 flex items-center gap-1 text-xs uppercase tracking-widest text-gold">
            Patrons only <ArrowUpRight size={14} />
          </span>
        </Link>
      </div>
      <Link href="/hall" className="mt-8 text-xs uppercase tracking-widest text-white/40 hover:text-gold">
        View the Shadow Lords Hall →
      </Link>
    </section>
  );
}
