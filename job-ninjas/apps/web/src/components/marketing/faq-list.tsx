"use client";

import { useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQS } from "@/lib/marketing/site";

export function FaqList() {
  const [open, setOpen] = useState<number>(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const focusAt = (index: number) => {
    const next = (index + FAQS.length) % FAQS.length;
    buttons.current[next]?.focus();
  };

  return (
    <div className="space-y-3">
      {FAQS.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div 
            key={item.q}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen 
                ? "border-[#ff6d5a]/40 bg-[#0e1017] shadow-lg shadow-black/40" 
                : "border-white/[0.08] bg-[#0c0d14]/60 hover:border-white/20 hover:bg-[#0e1017]/80"
            }`}
          >
            <h3 className="text-sm sm:text-base font-bold">
              <button
                id={buttonId}
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-white cursor-pointer"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    focusAt(index + 1);
                  } else if (event.key === "ArrowUp") {
                    event.preventDefault();
                    focusAt(index - 1);
                  } else if (event.key === "Home") {
                    event.preventDefault();
                    focusAt(0);
                  } else if (event.key === "End") {
                    event.preventDefault();
                    focusAt(FAQS.length - 1);
                  }
                }}
              >
                <span className="font-semibold">{item.q}</span>
                <ChevronDown
                  aria-hidden
                  className={`size-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#ff7a68]" : "text-slate-400"
                  }`}
                />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-6 pb-5 pt-1">
                <p className="text-xs sm:text-sm leading-relaxed text-slate-300">{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
