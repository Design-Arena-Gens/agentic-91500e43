"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Profile } from "../lib/profiles";
import { ProfileCard } from "./ProfileCard";
import { clsx } from "clsx";

type SwipeDeckProps = {
  profiles: Profile[];
};

type Decision = {
  profile: Profile;
  direction: "like" | "pass";
  timestamp: number;
};

export function SwipeDeck({ profiles }: SwipeDeckProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [dragDirection, setDragDirection] = useState<"like" | "pass" | null>(null);
  const [previewDirection, setPreviewDirection] = useState<"like" | "pass" | null>(null);

  const activeProfile = profiles[activeIndex];

  const handleDecision = useCallback(
    (direction: "like" | "pass") => {
      if (!activeProfile) return;

      setDragDirection(direction);
      setPreviewDirection(null);
      const profile = activeProfile;
      const timestamp = Date.now();

      setTimeout(() => {
        setDecisions((prev) => [...prev, { profile, direction, timestamp }]);
        setActiveIndex((prev) => prev + 1);
      }, 0);

      setTimeout(() => setDragDirection(null), 350);
    },
    [activeProfile]
  );

  const likes = useMemo(() => decisions.filter((d) => d.direction === "like"), [decisions]);
  const passes = useMemo(() => decisions.filter((d) => d.direction === "pass"), [decisions]);

  const deckFinished = activeIndex >= profiles.length;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-12 pt-16">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Spark</h1>
          <p className="text-sm text-white/50">
            Swipe with intention. Discover people you vibe with, not just profiles.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Meter label="Matches" value={likes.length} accent="from-brand-pink to-brand-purple" />
          <Meter label="Passes" value={passes.length} accent="from-white/20 to-white/5" />
        </div>
      </header>

      <div className="relative flex min-h-[540px] flex-col-reverse gap-6 lg:flex-row">
        <div className="relative flex-1">
          <div className="relative mx-auto h-[30rem] w-full max-w-md">
            <AnimatePresence mode="popLayout">
              {profiles
                .slice(activeIndex, activeIndex + 3)
                .map((profile, index) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    index={activeIndex + index}
                    activeIndex={activeIndex}
                    exitX={
                      index === 0 && dragDirection
                        ? dragDirection === "like"
                          ? 500
                          : -500
                        : null
                    }
                    isDraggable={index === 0}
                    previewDirection={index === 0 ? previewDirection : null}
                    onDrag={({ offset }) => {
                      if (Math.abs(offset.x) < 40) {
                        setPreviewDirection(null);
                        return;
                      }
                      setPreviewDirection(offset.x > 0 ? "like" : "pass");
                    }}
                    onDragEnd={({ offset, velocity }) => {
                      const power = offset.x + velocity.x * 20;
                      if (power > 180) {
                        handleDecision("like");
                      } else if (power < -180) {
                        handleDecision("pass");
                      } else {
                        setPreviewDirection(null);
                      }
                    }}
                  />
                ))}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <SwipeButton
              label="Pass"
              onClick={() => handleDecision("pass")}
              disabled={deckFinished}
              variant="ghost"
              icon="👋"
            />
            <SwipeButton
              label="Like"
              onClick={() => handleDecision("like")}
              disabled={deckFinished}
              variant="primary"
              icon="🔥"
            />
          </div>
        </div>

        <aside className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-white/5 bg-white/[0.04] p-6 backdrop-blur">
          <h2 className="text-lg font-medium text-white/80">Tonight&apos;s energy</h2>
          <p className="text-sm text-white/60">
            Swipe, match, and spark conversations with creatives, founders, and explorers in your city.
          </p>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-sm uppercase tracking-[0.4em] text-white/40">Now Playing</h3>
            <p className="mt-3 text-xl text-white/80">Neon Skyline • Spark Radio</p>
            <div className="mt-4 flex items-center gap-3">
              <WaveBar active />
              <WaveBar delay={0.1} />
              <WaveBar delay={0.2} active />
              <WaveBar delay={0.3} />
              <WaveBar delay={0.4} active />
            </div>
          </div>

          <div className="grid gap-3 text-sm">
            <ActivityCard title="Creative mixer this Friday" emoji="🎧" />
            <ActivityCard title="You and Maya both love indie films" emoji="🎬" />
            <ActivityCard title="3 new likes waiting" emoji="💌" />
          </div>
        </aside>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium text-white/80">Your vibe check</h2>
        {deckFinished ? (
          <p className="mt-2 text-sm text-white/60">
            That&apos;s everyone for now. Check back tomorrow for a fresh drop of people curated for your vibe.
          </p>
        ) : (
          <p className="mt-2 text-sm text-white/60">
            {profiles.length - activeIndex} more {profiles.length - activeIndex === 1 ? "profile" : "profiles"} waiting to explore with you.
          </p>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <DecisionStack title="Sparked" decisions={likes} emptyLabel="No sparks yet. Keep swiping!" />
          <DecisionStack title="Passed" decisions={passes} emptyLabel="No passes yet. Take your time." />
        </div>
      </section>
    </div>
  );
}

function SwipeButton({
  label,
  onClick,
  disabled,
  variant,
  icon
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant: "ghost" | "primary";
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "flex items-center gap-3 rounded-full px-8 py-3 text-lg font-medium transition-all duration-300",
        variant === "primary"
          ? "bg-gradient-to-r from-brand-pink to-brand-purple text-white shadow-lg shadow-brand-pink/30 hover:scale-105 disabled:opacity-60"
          : "border border-white/20 bg-white/5 text-white/80 hover:bg-white/10 disabled:opacity-60"
      )}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

function DecisionStack({
  title,
  decisions,
  emptyLabel
}: {
  title: string;
  decisions: Decision[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-white/80">{title}</h3>
        <span className="text-xs uppercase tracking-[0.3em] text-white/30">{decisions.length}</span>
      </div>
      {decisions.length === 0 ? (
        <p className="mt-3 text-sm text-white/50">{emptyLabel}</p>
      ) : (
        <ul className="mt-4 space-y-3 text-sm text-white/70">
          {decisions.slice(-4).reverse().map((decision) => (
            <li key={`${decision.profile.id}-${decision.timestamp}`} className="flex items-center gap-3">
              <div
                className={clsx(
                  "h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/10",
                  decision.direction === "like" ? "ring-2 ring-brand-pink/60" : ""
                )}
              >
                <motion.img
                  src={decision.profile.image}
                  alt={decision.profile.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{decision.profile.name}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  {decision.direction === "like" ? "Sparked" : "Passed"}
                </p>
              </div>
              <span className="text-xs text-white/40">
                {new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(
                  decision.timestamp
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Meter({
  label,
  value,
  accent
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex h-16 w-24 flex-col justify-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 text-center">
      <span className="text-xs uppercase tracking-[0.35em] text-white/40">{label}</span>
      <span className={clsx("text-xl font-semibold bg-clip-text text-transparent", `bg-gradient-to-r ${accent}`)}>
        {value}
      </span>
    </div>
  );
}

function ActivityCard({ title, emoji }: { title: string; emoji: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <span className="text-2xl">{emoji}</span>
      <p className="text-white/70">{title}</p>
    </div>
  );
}

function WaveBar({ active = false, delay = 0 }: { active?: boolean; delay?: number }) {
  return (
    <motion.span
      className={clsx(
        "h-6 w-1 rounded-full bg-gradient-to-b from-brand-pink/80 to-brand-purple/70",
        !active && "opacity-40"
      )}
      animate={{ scaleY: [0.8, 1.5, 0.9] }}
      transition={{ repeat: Infinity, duration: 1.2, delay, ease: "easeInOut" }}
    />
  );
}
