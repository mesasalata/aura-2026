"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cancelFrame, frame, motion } from "motion/react";
import { NAV } from "@/lib/nav";
import { navToneClips } from "@/lib/nav-tone";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AuraLogo } from "./aura-logo";
import { MobileNav, MobileNavMark } from "./mobile-nav";
import { WikiNavCard } from "./wiki-nav-card";

/** The milk plate and the on-dark type share this fade: 250ms, `--ease-out-soft`. */
const navFade = "duration-250 ease-out-soft";
const navFadeMotion = { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const };

/* The ink row and its milk copy must lay out identically, so they share these. */
const ROW = "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8";
const BRAND = "flex items-center gap-2.5 rounded-lg";
const WORDMARK = "font-display text-2xl font-semibold tracking-tight";
const EDITION = "hidden text-[0.7rem] sm:inline";
const GROUPS = "hidden items-center gap-1 lg:flex";
const GROUP = "rounded-full px-3.5 py-2 text-sm font-medium";
const CTA = "px-5 max-sm:hidden";

export function SiteNav() {
  const pathname = usePathname();
  const [pageCtaVisible, setPageCtaVisible] = useState(pathname === "/");
  const [menuState, setMenuState] = useState<{ pathname: string; openGroup: string | null }>({
    pathname,
    openGroup: null,
  });
  const openGroup = menuState.pathname === pathname ? menuState.openGroup : null;
  const setOpenGroup = (group: string | null) => setMenuState({ pathname, openGroup: group });
  // Keep the last group mounted so the plate can ease shut instead of snapping.
  const [panelGroup, setPanelGroup] = useState<string | null>(null);
  if (openGroup && openGroup !== panelGroup) setPanelGroup(openGroup);
  const panel = NAV.find((group) => group.label === panelGroup);
  const barRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [plateHeight, setPlateHeight] = useState({ closed: 64, open: 64 });
  useLayoutEffect(() => {
    const closed = barRef.current?.offsetHeight ?? 64;
    const open = closed + (menuRef.current?.offsetHeight ?? 0);
    setPlateHeight((prev) => (prev.closed === closed && prev.open === open ? prev : { closed, open }));
  }, [panel]);

  const headerRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const milkTypeRef = useRef<HTMLDivElement>(null);
  const inkWashRef = useRef<HTMLDivElement>(null);
  const milkWashRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    let last = "";
    const update = () => {
      const band = rowRef.current?.offsetHeight ?? 64;
      const { dark, light } = navToneClips(header.clientWidth, band);
      const key = `${dark}|${light}`;
      if (key === last) return;
      last = key;
      for (const el of [milkTypeRef.current, inkWashRef.current]) if (el) el.style.clipPath = dark;
      if (milkWashRef.current) milkWashRef.current.style.clipPath = light;
    };
    // After Motion's render step, so scroll-driven surfaces (the pour's pool) are already in place.
    const schedule = () => frame.postRender(update);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
      cancelFrame(update);
    };
  }, [pathname]);

  useEffect(() => {
    const cta = document.querySelector("[data-description-cta]");
    if (!cta) {
      setPageCtaVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setPageCtaVisible(entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(cta);
    return () => observer.disconnect();
  }, [pathname]);

  const isActiveGroup = (group: (typeof NAV)[number]) =>
    group.links.some((l) => pathname.startsWith(l.href) && l.href !== "/");

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50" onMouseLeave={() => setOpenGroup(null)}>
      {/* Clear over the page. The washes are cut on the same line as the type. */}
      <div
        ref={milkWashRef}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 border-b border-ink/10 bg-milk/70 [clip-path:inset(50%)]"
      />
      <div ref={inkWashRef} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-ink/25" />

      {/* One milk plate behind the links while a group is open. The menu lives inside it, so the bar and the menu are not two fading layers. */}
      <motion.div
        className="absolute inset-x-0 top-0 z-10 box-content origin-top overflow-hidden border-b border-ink/10 bg-milk"
        initial={false}
        animate={{
          height: openGroup ? plateHeight.open : plateHeight.closed,
          opacity: openGroup ? 1 : 0,
          y: openGroup ? 0 : -6,
        }}
        transition={navFadeMotion}
        aria-hidden={!openGroup}
      >
        <div ref={barRef} className="h-16" aria-hidden />
        {panel ? (
          <div
            ref={menuRef}
            className="hidden lg:block"
            inert={!openGroup ? true : undefined}
            aria-hidden={!openGroup}
          >
            <div className="mx-auto max-w-7xl px-8 py-8">
              <p className="mb-5 max-w-md text-sm text-ink-55">{panel.intro}</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                {panel.links.map((link) => (
                  <WikiNavCard
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    desc={link.desc}
                    accent={link.accent}
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </motion.div>

      <div ref={rowRef} className={cn("relative z-20", ROW)}>
        <Link href="/" className={cn(BRAND, "focus-visible:outline-none")} aria-label="AURA home">
          <AuraLogo />
          <span className={cn(WORDMARK, "text-ink")}>AURA</span>
          <span className={cn(EDITION, "text-ink-40")}>iGEM 2026</span>
        </Link>

        {/* Desktop nav */}
        <nav className={GROUPS} aria-label="Primary">
          {NAV.map((group) => {
            const isOpen = openGroup === group.label;
            return (
              <div key={group.label} onMouseEnter={() => setOpenGroup(group.label)}>
                <button
                  className={cn(
                    GROUP,
                    "transition-colors",
                    navFade,
                    isActiveGroup(group) || isOpen ? "text-ink" : "text-ink-70 hover:text-ink",
                  )}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => setOpenGroup(isOpen ? null : group.label)}
                  onFocus={() => setOpenGroup(group.label)}
                >
                  {group.label}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="pink"
            size="sm"
            className={cn("nav-cta-fade", CTA, pageCtaVisible ? "pointer-events-none opacity-0" : "opacity-100")}
          >
            <Link
              href="/description"
              tabIndex={pageCtaVisible ? -1 : 0}
              aria-hidden={pageCtaVisible}
            >
              Read the description <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <MobileNav />
        </div>
      </div>

      {/* Milk type, cut to the part of the bar over dark page. Paint only: pointer and focus land on the ink row under it. */}
      <div
        ref={milkTypeRef}
        aria-hidden
        inert
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-30 transition-opacity",
          navFade,
          openGroup ? "opacity-0" : "opacity-100",
        )}
      >
        <div className={ROW}>
          <div className={BRAND}>
            <AuraLogo className="invisible" />
            <span className={cn(WORDMARK, "text-milk")}>AURA</span>
            <span className={cn(EDITION, "text-milk/45")}>iGEM 2026</span>
          </div>
          <div className={GROUPS}>
            {NAV.map((group) => (
              <div key={group.label}>
                <span className={cn(GROUP, "inline-block", isActiveGroup(group) ? "text-milk" : "text-milk/70")}>
                  {group.label}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(buttonVariants({ variant: "pink", size: "sm" }), CTA, "invisible")}>
              Read the description <ArrowRight className="h-4 w-4" />
            </span>
            <MobileNavMark className="border-milk/30 text-milk" />
          </div>
        </div>
      </div>
    </header>
  );
}
