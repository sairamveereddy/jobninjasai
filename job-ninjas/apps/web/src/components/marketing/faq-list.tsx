"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/marketing/site";

export function FaqList() {
  const [open, setOpen] = useState<number>(0);

  return (
    <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {FAQS.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : index)}
            >
              <span className="text-[15px] font-medium tracking-[-0.02em] text-white">{item.q}</span>
              <ChevronDown className={`size-4 shrink-0 text-[#707277] transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="pb-4 pr-8 text-[14px] leading-relaxed text-[#b1b3b8]">{item.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
