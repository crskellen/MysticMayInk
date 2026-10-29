// Studio clocks are America/New_York. createTime is UTC unix seconds.
export function postedLabel(createTime) {
  const ms = Number(createTime) * 1000;
  if (!Number.isFinite(ms)) return "";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(ms));
}
