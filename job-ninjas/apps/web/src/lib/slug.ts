export function slugifyRole(title: string): string {
  if (!title) return "board";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function roleToBoardSlug(role: { id: string; title: string }): string {
  const slug = slugifyRole(role.title) || "role";
  return slug;
}

export function roleToBoardUrl(role: { id: string; title: string }): string {
  return `/roles/${roleToBoardSlug(role)}/board`;
}
