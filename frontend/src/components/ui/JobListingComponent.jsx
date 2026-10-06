"use client"

import React, { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useOnClickOutside } from "usehooks-ts"
import { CheckCircle2, Building2, MapPin, Briefcase, Check } from "lucide-react"

export default function JobListingComponent({
  jobs,
  className,
  onJobClick,
}) {
  const [activeItem, setActiveItem] = useState(null)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setActiveItem(null))

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActiveItem(null)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  return (
    <div className={`relative w-full ${className || ""}`}>
      <AnimatePresence>
        {activeItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm pointer-events-auto"
            onClick={() => setActiveItem(null)}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>
        {activeItem ? (
          <div className="fixed inset-0 z-[60] grid place-items-center p-4 pointer-events-none">
            <motion.div
              className="bg-background flex h-fit w-full max-w-lg cursor-default flex-col items-start gap-4 overflow-hidden border border-border p-6 shadow-xl pointer-events-auto"
              ref={ref}
              layoutId={`workItem-${activeItem.company}-${activeItem.id || activeItem.title}`}
              style={{ borderRadius: 12 }}
            >
              <div className="flex w-full items-center gap-4">
                <motion.div layoutId={`workItemLogo-${activeItem.company}-${activeItem.id || activeItem.title}`} className="w-12 h-12 flex-shrink-0 bg-secondary rounded-md border border-border p-1.5 flex items-center justify-center">
                  {activeItem.logo}
                </motion.div>
                <div className="flex grow items-center justify-between min-w-0">
                  <div className="flex w-full flex-col gap-0.5 min-w-0">
                    <motion.div
                      layoutId={`workItemTitle-${activeItem.company}-${activeItem.id || activeItem.title}`}
                      className="text-foreground text-lg font-bold truncate tracking-tight"
                    >
                      {activeItem.title} {activeItem.salary && ` / ${activeItem.salary}`}
                    </motion.div>
                    <motion.p
                      className="text-muted-foreground font-medium truncate"
                      layoutId={`workItemCompany-${activeItem.company}-${activeItem.id || activeItem.title}`}
                    >
                      {activeItem.company}
                    </motion.p>
                    <motion.div
                      className="text-muted-foreground flex flex-row items-center gap-2 text-xs"
                      layoutId={`workItemExtras-${activeItem.company}-${activeItem.id || activeItem.title}`}
                    >
                      <span>{activeItem.location}</span>
                      {activeItem.remote && <span> | {activeItem.remote}</span>}
                      <span> | {activeItem.job_time}</span>
                    </motion.div>
                  </div>
                </div>
              </div>
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="text-muted-foreground text-sm leading-relaxed mt-2 max-h-[60vh] overflow-y-auto pr-2"
              >
                {activeItem.job_description}
              </motion.div>
              <motion.div 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full pt-4 mt-auto border-t border-border flex justify-end gap-3"
              >
                 <button 
                  onClick={() => setActiveItem(null)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onJobClick) onJobClick(activeItem);
                  }}
                  className="vercel-button px-6 py-2 h-9 text-sm"
                >
                  Apply Now
                </button>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
        {jobs.map((role) => {
          const roleWithVerified = { ...role };

          return (
            <motion.div
              layoutId={`workItem-${role.company}-${role.id || role.title}`}
              key={role.id || role.company + role.title}
              className="vercel-card group flex w-full cursor-pointer flex-col p-4 transition-all duration-300 relative overflow-hidden active:scale-[0.98]"
              onClick={() => onJobClick(roleWithVerified)}
            >
              <div className="flex items-start gap-3 mb-4">
                <motion.div layoutId={`workItemLogo-${role.company}-${role.id || role.title}`} className="w-10 h-10 flex-shrink-0 bg-secondary rounded-md p-1.5 flex items-center justify-center border border-border group-hover:border-muted-foreground transition-colors">
                  {role.logo}
                </motion.div>
                <div className="flex flex-col min-w-0 flex-1 pt-0.5">
                  <motion.div
                    className="text-foreground font-semibold text-sm leading-tight line-clamp-2 transition-colors"
                    layoutId={`workItemTitle-${role.company}-${role.id || role.title}`}
                  >
                    {role.title}
                  </motion.div>
                  <motion.div
                    className="text-muted-foreground text-[11px] font-medium mt-1 inline-flex items-center gap-1.5"
                    layoutId={`workItemCompany-${role.company}-${role.id || role.title}`}
                  >
                    <Building2 className="w-3 h-3 opacity-70" /> {role.company}
                  </motion.div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                <motion.div
                  className="text-muted-foreground flex flex-wrap items-center gap-2 text-[11px] font-medium"
                  layoutId={`workItemExtras-${role.company}-${role.id || role.title}`}
                >
                  <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    <MapPin className="w-3 h-3 opacity-70" /> <span className="truncate max-w-[90px]">{role.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    <Briefcase className="w-3 h-3 opacity-70" /> <span>{role.job_time}</span>
                  </div>

                  {role.salary && role.salary !== 'Competitive' && (
                    <div className="flex items-center gap-1 bg-foreground text-background px-2 py-1 rounded-md ml-auto">
                      <span className="font-semibold">{role.salary}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}
