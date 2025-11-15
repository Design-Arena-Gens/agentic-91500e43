import { SwipeDeck } from "../components/SwipeDeck";
import { profiles } from "../lib/profiles";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      <BackgroundBlur />
      <SwipeDeck profiles={profiles} />
      <Footer />
    </main>
  );
}

function BackgroundBlur() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-40 top-20 h-72 w-72 rounded-full bg-brand-purple/30 blur-[200px]" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-brand-pink/30 blur-[180px]" />
    </div>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 pb-10 text-xs text-white/40">
      <p>© {new Date().getFullYear()} Spark • Crafted for meaningful connections.</p>
      <p>Made with intention using Next.js, Tailwind CSS, and Framer Motion.</p>
    </footer>
  );
}
