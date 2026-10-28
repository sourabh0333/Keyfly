// Joins class names, skipping falsy values.
export function cx(...names) {
  return names.filter(Boolean).join(" ");
}
