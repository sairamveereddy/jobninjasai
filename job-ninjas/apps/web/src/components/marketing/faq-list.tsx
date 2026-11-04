"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/marketing/site";

export function FaqList() {
  const [open, setOpen] = useState<number>(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const focusAt = (index: number) => {
    const next = (index + FAQS.length) % FAQS.length;
    buttons.current[next]?.focus();
  };

  return (
    <div className="space-y-3 font-sans">
      {FAQS.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div 
            key={item.q}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen 
                ? "border-neutral-300 bg-white shadow-xs" 
                : "border-neutral-200/90 bg-white hover:border-neutral-300"
            }`}
          >
            <h3 className="text-sm sm:text-base font-bold">
              <button
                id={buttonId}
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-neutral-900 cursor-pointer"
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
                <span className="font-semibold text-neutral-900">{item.q}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-[#ea4b71]" : ""
                  }`}
                />
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-6 pb-5 pt-1 text-xs sm:text-sm text-neutral-500 leading-relaxed border-t border-neutral-100">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
