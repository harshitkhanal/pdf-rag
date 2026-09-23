
import { motion } from "framer-motion";

import {
  FileText,
  LoaderCircle,
} from "lucide-react";

export default function FileProcessing({ name }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_12px_50px_rgba(0,0,0,0.10)] transition-colors duration-200 dark:border-white/10 dark:bg-[#15171c] dark:shadow-[0_12px_50px_rgba(0,0,0,0.45)]">

      {/* Upload status */}
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Upload in progress
      </p>

      {/* Animated loader */}
      <div className="flex flex-col items-center py-8">

        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="mb-5 text-violet-500 dark:text-violet-400"
        >
          <LoaderCircle size={48} strokeWidth={2.5} />
        </motion.div>

        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Preparing your document
        </h2>

        <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Extracting text and building your search index...
        </p>
      </div>

      {/* PDF information */}
      <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 transition-colors duration-200 dark:border-white/[0.06] dark:bg-white/[0.04]">

        {/* PDF icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:text-red-400">
          <FileText size={20} />
        </div>

        {/* Filename */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {name}
          </p>

          <p className="mt-0.5 text-xs text-zinc-500">
            PDF document
          </p>
        </div>

        {/* Processing status */}
        <span className="shrink-0 text-xs font-medium text-blue-600 dark:text-blue-400">
          Working
        </span>
      </div>
    </div>
  );
}

