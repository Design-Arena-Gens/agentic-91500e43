import { motion } from "framer-motion";
import Image from "next/image";
import { Profile } from "../lib/profiles";
import { clsx } from "clsx";

type ProfileCardProps = {
  profile: Profile;
  index: number;
  activeIndex: number;
  exitX: number | null;
  isDraggable?: boolean;
  onDrag?: (info: { offset: { x: number } }) => void;
  onDragEnd?: (info: { offset: { x: number }; velocity: { x: number } }) => void;
  previewDirection?: "like" | "pass" | null;
};

export function ProfileCard({
  profile,
  index,
  activeIndex,
  exitX,
  isDraggable,
  onDrag,
  onDragEnd,
  previewDirection
}: ProfileCardProps) {
  const isActive = index === activeIndex;
  const isNext = index === activeIndex + 1;

  return (
    <motion.article
      layout
      initial={{ scale: 0.95, opacity: 0, y: 60 }}
      animate={{
        scale: isActive ? 1 : isNext ? 0.97 : 0.94,
        opacity: index <= activeIndex + 1 ? 1 : 0,
        y: isActive ? 0 : isNext ? 20 : 50,
        zIndex: profilesStackLayer(index, activeIndex)
      }}
      exit={{
        opacity: 0,
        x: exitX ?? 0,
        rotate: exitX ? (exitX > 0 ? 12 : -12) : 0,
        scale: 0.9
      }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      drag={isDraggable ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDrag={(_, info) => {
        if (!isDraggable || !onDrag) return;
        onDrag({ offset: { x: info.offset.x } });
      }}
      onDragEnd={(_, info) => {
        if (!isDraggable || !onDragEnd) return;
        onDragEnd({ offset: { x: info.offset.x }, velocity: { x: info.velocity.x } });
      }}
      className={clsx(
        "absolute inset-0 rounded-3xl bg-neutral-900/90 backdrop-blur-xs shadow-card origin-center overflow-hidden border border-white/10",
        "flex flex-col"
      )}
    >
      {previewDirection && (
        <div
          className={clsx(
            "pointer-events-none absolute inset-0 z-50 flex items-start justify-start p-6",
            previewDirection === "like" ? "text-emerald-300" : "text-pink-300",
            "font-semibold tracking-[0.6em] uppercase text-sm"
          )}
        >
          <span
            className={clsx(
              "rounded-lg border px-4 py-2",
              previewDirection === "like"
                ? "border-emerald-400/60 bg-emerald-400/10"
                : "border-pink-400/60 bg-pink-400/10"
            )}
          >
            {previewDirection === "like" ? "Spark" : "Pass"}
          </span>
        </div>
      )}
      <div className="relative h-4/6">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          priority={isActive}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-semibold">
              {profile.name}
              <span className="text-2xl font-light text-white/70"> {profile.age}</span>
            </h2>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium tracking-wide uppercase text-white/80">
              {profile.compatibility}% Match
            </span>
          </div>
          <p className="text-sm text-white/70">{profile.pronouns}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-6">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">About</p>
          <p className="mt-2 text-base leading-relaxed text-white/80">{profile.bio}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
            <p className="text-white/40 uppercase tracking-[0.25em] text-xs">Works At</p>
            <p className="mt-1 text-base text-white/80">
              {profile.jobTitle} @ {profile.company}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
            <p className="text-white/40 uppercase tracking-[0.25em] text-xs">Location</p>
            <p className="mt-1 text-base text-white/80">{profile.location}</p>
          </div>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">Interests</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-sm text-white/80"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function profilesStackLayer(cardIndex: number, activeIndex: number) {
  if (cardIndex === activeIndex) return 50;
  if (cardIndex === activeIndex + 1) return 40;
  return 30 - (cardIndex - activeIndex);
}
