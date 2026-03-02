"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutCta() {
  return (
    <section
      className="border-border/50 border-t bg-gradient-to-b from-background to-muted/20 px-4 py-16 md:px-8 lg:px-24"
      aria-label="Get started"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Ready to find or list your next property?
        </h2>
        <p className="text-muted-foreground">
          Join Luxestate and start browsing listings or create your seller
          account for unlimited postings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="min-w-[160px]">
            <Link href="/properties">Browse properties</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[160px]">
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
