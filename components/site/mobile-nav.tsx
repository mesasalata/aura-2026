"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { NAV } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { AuraLogo } from "./aura-logo";
import { WikiNavCard } from "./wiki-nav-card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const TRIGGER = "hand-icon inline-flex h-10 w-10 items-center justify-center lg:hidden";

/** The menu button's look without the button, for the nav's on-dark copy. */
export function MobileNavMark({ className }: { className?: string }) {
  return (
    <span className={cn(TRIGGER, className)}>
      <Menu className="h-5 w-5" />
    </span>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className={cn(TRIGGER, "border-ink/15 text-ink")} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[80] flex w-[88%] max-w-sm flex-col bg-milk shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg focus-visible:outline-none"
            >
              <AuraLogo className="h-8" />
              <span className="font-display text-xl font-semibold">AURA</span>
            </Link>
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Close asChild>
              <button className="hand-icon inline-flex h-10 w-10 items-center justify-center border-ink/20" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <Accordion type="multiple" defaultValue={[NAV[0].label]}>
              {NAV.map((group) => (
                <AccordionItem key={group.label} value={group.label}>
                  <AccordionTrigger className="font-display text-lg">{group.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-2 pt-1">
                      {group.links.map((link) => (
                        <WikiNavCard
                          key={link.href}
                          href={link.href}
                          label={link.label}
                          desc={link.desc}
                          accent={link.accent}
                          variant="compact"
                          showCta={false}
                          onNavigate={() => setOpen(false)}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="border-t border-ink/10 p-6">
            <Link
              href="/description"
              onClick={() => setOpen(false)}
              className="hand-pill flex h-12 w-full items-center justify-center bg-ink font-medium text-milk"
            >
              Read the description
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
