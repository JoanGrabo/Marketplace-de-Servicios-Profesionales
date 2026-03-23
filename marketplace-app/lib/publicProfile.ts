export function getPublicProfileName(profile: {
  id: string;
  displayName?: string | null;
}): string {
  const name = (profile.displayName ?? "").trim();
  if (name) return name;
  return `GUID-${profile.id}`;
}

export function truncateText(value: string | null | undefined, max = 140): string {
  const text = (value ?? "").trim();
  if (!text) return "";
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
