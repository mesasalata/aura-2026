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

export function MobileNav({ onDark = false }: { onDark?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden",
            onDark ? "border border-milk/30 text-milk" : "border border-ink/15 text-ink",
          )}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out" />
        <Dialog.Content className="mobile-nav-sheet fixed inset-y-0 right-0 z-[80] flex w-[88%] max-w-sm flex-col shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg"
            >
              <AuraLogo className="h-8" />
              <span className="font-display text-xl font-semibold">AURA</span>
            </Link>
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <Dialog.Description className="sr-only">
              Primary wiki sections and pages.
            </Dialog.Description>
            <Dialog.Close asChild>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="mobile-nav-scroll flex-1 overflow-y-auto py-4 pr-6">
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
              className="flex h-12 w-full items-center justify-center rounded-full bg-ink font-medium text-milk"
            >
              Explore the Project
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
