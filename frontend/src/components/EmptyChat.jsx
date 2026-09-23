import { motion } from "framer-motion";

import {
  Plus,
  Sparkles,
} from "lucide-react";

export default function EmptyChat({ handleFileChange }) {
  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-6 pb-36 text-center">
      {/* Soft glow behind the upload icon */}
      <div className="pointer-events-none absolute left-1/2 top-[42%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.07] blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={{ y: [0, -7, 0], scale: [1, 1.04, 1] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mb-8"
        >
          <label className="group flex h-24 w-24 cursor-pointer items-center justify-center rounded-[28px] border border-violet-300/30 bg-violet-500/[0.08] text-violet-500 shadow-[0_0_70px_rgba(139,92,246,0.08)] transition-colors duration-200 hover:border-violet-400/50 hover:bg-violet-500/[0.14] dark:border-violet-400/20 dark:text-violet-300">
            <Plus
              size={46}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110"
            />

            <input
              type="file"
              onChange={handleFileChange}
              accept=".pdf,application/pdf"
              className="hidden"
            />
          </label>
        </motion.div>

        <div className="mb-3 flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1.5 text-[11px] font-medium text-zinc-500 transition-colors duration-200 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-zinc-500">
          <Sparkles
            size={13}
            className="text-violet-500 dark:text-violet-300"
          />
          YOUR PERSONAL PDF ASSISTANT
        </div>

        <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
          A new chat starts
          <span className="block bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent dark:from-violet-300 dark:to-indigo-300">
            with a document.
          </span>
        </h2>

        <p className="mt-4 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-500">
          Please input a file to continue with your chat. Upload a PDF and
          start asking questions about its contents.
        </p>

        <label className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-violet-500 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-950/20 transition-colors duration-200 hover:bg-violet-400 dark:shadow-violet-950/30">
          <Plus size={17} />
          Choose a PDF

          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,application/pdf"
            className="hidden"
          />
        </label>

        <p className="mt-4 text-[11px] text-zinc-500 dark:text-zinc-600">
          PDF files only · Upload handling will be connected later
        </p>
      </div>
    </div>
  );
}