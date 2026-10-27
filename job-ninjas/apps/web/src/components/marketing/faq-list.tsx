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
    <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
      {FAQS.map((item, index) => {
        const isOpen = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;
        return (
          <div key={item.q}>
            <h3 className="text-[15px] font-medium">
              <button
                id={buttonId}
                ref={(node) => {
                  buttons.current[index] = node;
                }}
                type="button"
                className="flex w-full items-center justify-between gap-4 rounded-[4px] py-4 text-left tracking-[-0.02em] text-white"
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
                <span>{item.q}</span>
                <ChevronDown
                  aria-hidden
                  className={`size-4 shrink-0 text-[#94969c] transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
              <p className="pb-4 pr-8 text-[14px] leading-relaxed text-[#b1b3b8]">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
