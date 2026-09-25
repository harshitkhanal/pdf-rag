import {
    Send,
    Paperclip,

  } from "lucide-react"
import { useState } from "react";

export default function ChatInput({handleSendMessage,disabled}) {
    const [text,setText] = useState("")

    const submit= ()=>{
        if (!text.trim() || disabled) return ; 
        handleSendMessage(text.trim())
        setText("")
    }
    return(
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-[0_12px_60px_rgba(0,0,0,0.08)] transition focus-within:border-violet-400/30 hover:border-zinc-300 dark:border-white/10 dark:bg-[#15171c] dark:shadow-[0_12px_60px_rgba(0,0,0,0.35)] dark:hover:border-white/[0.16]">

        <input
          placeholder="Ask anything about your document..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submit()
            }
          }}
          className="max-h-40 min-h-[56px] w-full resize-none bg-transparent px-5 pt-5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-600"
        />

        <div className="flex items-center justify-between px-3 pb-3">

          <div className="flex items-center gap-2">

         

            <span className="hidden text-[11px] text-zinc-500 sm:block dark:text-zinc-600">
              Answers are based on your uploaded PDF
            </span>
          </div>

          <button
            type="button"
            aria-label="Send message"
            onClick={submit}
            disabled={disabled}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500 text-white transition hover:bg-violet-400 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

    )
}