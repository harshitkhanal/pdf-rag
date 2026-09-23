import {

    FileText,

  } from "lucide-react"

export default function DocumentHeader({pdf,pdfUrl}) {
    return(
        <div className="mb-10 flex items-center justify-between">
        <div>
          <p className="mb-2 text-xs font-medium text-violet-600 dark:text-violet-300">
            DOCUMENT CHAT
          </p>

          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
            <FileText size={13} />

            {pdf.filename}

            <span className="text-zinc-300 dark:text-zinc-700">
              ·
            </span>

            {pdf.pages}
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-zinc-400 dark:hover:bg-white/[0.07] dark:hover:text-zinc-200"
          onClick={() => {
            if (pdfUrl) {
              window.open(pdfUrl, "_blank");
            }
          }}
        >
          <FileText size={14} />
          View document
        </button>
      </div>
    )
}