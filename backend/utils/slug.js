export function slugify(text) {
  const slug = text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'project';
}

/** Returns a slug for `title` that no other document in `Model` uses. */
export async function uniqueSlug(Model, title, excludeId) {
  const base = slugify(title);
  let slug = base;
  for (let n = 2; ; n += 1) {
    const filter = excludeId ? { slug, _id: { $ne: excludeId } } : { slug };
    if (!(await Model.exists(filter))) return slug;
    slug = `${base}-${n}`;
  }
}
