export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return basePath ? `${basePath}${normalized}` : normalized;
}
