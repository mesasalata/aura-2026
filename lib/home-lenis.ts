/** Homepage Lenis instance, when the smooth scroller is mounted. */
export type HomeLenis = {
  scrollTo: (target: number | string, options?: { immediate?: boolean }) => void;
};

let homeLenis: HomeLenis | null = null;

export function getHomeLenis() {
  return homeLenis;
}

export function setHomeLenis(instance: HomeLenis | null) {
  homeLenis = instance;
}
