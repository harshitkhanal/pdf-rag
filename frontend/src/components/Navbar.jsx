import {
    Sun,
    Moon,
    FileText,

  } from "lucide-react"

export default function Navbar({theme,setTheme}) {
    return( 
          <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/90 px-5 backdrop-blur-xl transition-colors duration-200 dark:border-white/[0.07] dark:bg-[#0b0d10]/90">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-300">
              <FileText size={19} />
            </div>

            <div>
              <h1 className="text-sm font-semibold tracking-tight">
                PaperMind
              </h1>

              <p className="text-[11px] text-zinc-500">
                Chat with your documents
              </p>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            type="button"
            aria-label="Change theme"
            onClick={() =>
              setTheme((prev) =>
                prev === "dark" ? "light" : "dark"
              )
            }
            className="flex h-9 w-9 items-center
             justify-center rounded-xl border
              border-zinc-200 bg-zinc-50
               text-zinc-500 transition
                hover:bg-zinc-100 hover:text-zinc-900
                 dark:border-white/[0.08]
                  dark:bg-white/[0.03]
                   dark:text-zinc-400
                    dark:hover:bg-white/[0.08]
                     dark:hover:text-white"
          >
            {theme === "dark" ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>
        </header>
    )
}