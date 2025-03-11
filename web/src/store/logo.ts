export let Logo: string | null = null;

export function setLogo(path: string) {
  if (path && path !== '') Logo = path;
}
