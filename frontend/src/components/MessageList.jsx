import {

    Bot,
    User,
 
  } from "lucide-react"

 import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function MessageList({messages,loading}) {
    return(
        <div className="space-y-8">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 ${
              message.role === "user"
                ? "justify-end"
                : ""
            }`}
          >

            {/* Assistant avatar */}
            {message.role === "assistant" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-600 dark:text-violet-300">
                <Bot size={18} />
              </div>
            )}

            <div
              className={`min-w-0 max-w-[85%] ${
                message.role === "user"
                  ? "rounded-2xl bg-zinc-100 px-5 py-3.5 dark:bg-[#1b1e25]"
                  : "pt-1"
              }`}
            >

              {/* User message */}
              {message.role === "user" ? (
                <p className="text-sm leading-7 text-zinc-800 dark:text-zinc-200">
                  {message.content}
                </p>
              ) : (

                /* Assistant markdown */
                <div
                  className="
                    prose prose-sm max-w-none break-words
                    text-zinc-700 dark:prose-invert dark:text-zinc-300

                    [--tw-prose-body:theme(colors.zinc.700)]
                    [--tw-prose-headings:theme(colors.zinc.900)]

                    dark:[--tw-prose-invert-body:theme(colors.zinc.300)]
                    dark:[--tw-prose-invert-headings:theme(colors.zinc.100)]

                    prose-p:my-2
                    prose-p:leading-relaxed

                    prose-headings:font-semibold
                    prose-headings:tracking-tight

                    prose-h1:mt-6
                    prose-h1:mb-3
                    prose-h1:text-xl

                    prose-h2:mt-5
                    prose-h2:mb-2.5
                    prose-h2:text-lg

                    prose-h3:mt-4
                    prose-h3:mb-2
                    prose-h3:text-base

                    prose-ul:my-2.5
                    prose-ol:my-2.5

                    prose-li:my-0.5
                    prose-li:leading-relaxed

                    prose-table:my-4
                    prose-table:w-full
                    prose-table:border-collapse
                    prose-table:text-left

                    prose-th:border-b
                    prose-th:border-zinc-200
                    prose-th:p-2
                    prose-th:font-medium
                    prose-th:text-zinc-800

                    dark:prose-th:border-zinc-700/80
                    dark:prose-th:text-zinc-200

                    prose-td:border-b
                    prose-td:border-zinc-200
                    prose-td:p-2
                    prose-td:text-zinc-700

                    dark:prose-td:border-zinc-800/60
                    dark:prose-td:text-zinc-300

                    prose-strong:font-medium
                    prose-strong:text-zinc-900
                    dark:prose-strong:text-zinc-100

                    prose-a:text-violet-600
                    prose-a:no-underline
                    hover:prose-a:underline
                    prose-a:transition-colors

                    dark:prose-a:text-violet-400

                    prose-blockquote:border-l-violet-500/70
                    prose-blockquote:pl-4
                    prose-blockquote:italic
                    prose-blockquote:text-zinc-500

                    dark:prose-blockquote:text-zinc-400

                    prose-hr:my-6
                    prose-hr:border-zinc-200
                    dark:prose-hr:border-zinc-800

                    prose-code:rounded
                    prose-code:bg-zinc-100
                    prose-code:px-1.5
                    prose-code:py-0.5
                    prose-code:font-mono
                    prose-code:text-xs
                    prose-code:text-violet-700
                    prose-code:before:content-none
                    prose-code:after:content-none

                    dark:prose-code:bg-white/[0.08]
                    dark:prose-code:text-violet-200

                    prose-pre:my-4
                    prose-pre:overflow-x-auto
                    prose-pre:rounded-xl
                    prose-pre:border
                    prose-pre:border-zinc-200
                    prose-pre:bg-zinc-100
                    prose-pre:p-4

                    dark:prose-pre:border-zinc-800
                    dark:prose-pre:bg-zinc-900/90
                  "
                >
                  <ReactMarkdown
                    remarkPlugins={[
                      remarkGfm,
                      remarkMath,
                    ]}
                    rehypePlugins={[
                      rehypeKatex,
                    ]}
                    components={{
                      a: ({
                        node,
                        href,
                        children,
                        ...props
                      }) => (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 underline underline-offset-2 hover:text-violet-500 dark:text-violet-400 dark:hover:text-violet-300"
                          {...props}
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            {/* User avatar */}
            {message.role === "user" && (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-500 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-zinc-400">
                <User size={17} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <span className="animate-pulse text-xl text-zinc-500 dark:text-white">
            ...
          </span>
        )}
      </div>
    )
}