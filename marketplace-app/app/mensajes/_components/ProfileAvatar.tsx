import { getPublicProfileName } from "@/lib/publicProfile";

type ProfileLike = {
  id: string;
  displayName?: string | null;
  avatarUrl?: string | null;
};

const sizeClass = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
} as const;

export default function ProfileAvatar({
  profile,
  size = "md",
}: {
  profile: ProfileLike;
  size?: keyof typeof sizeClass;
}) {
  const name = getPublicProfileName(profile);
  const initial = name.trim().slice(0, 1).toUpperCase() || "?";

  if (profile.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatarUrl}
        alt=""
        className={`${sizeClass[size]} shrink-0 rounded-full object-cover ring-2 ring-white shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass[size]} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--connectia-gold)]/25 to-gray-200 font-semibold text-[var(--connectia-gray)] ring-2 ring-white shadow-sm`}
      aria-hidden
    >
      {initial}
    </div>
  );
}
