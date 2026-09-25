import {
    Plus,
    PanelLeftClose,
    MessageSquare,

    ChevronDown,
    MoreHorizontal,
  } from "lucide-react"

export default function Sidebar({recentChats,currChat,onNewChat,onSelectChat}) {
return (
    <aside className="fixed bottom-0 left-0 top-16 z-40 flex w-[260px] flex-col border-r border-zinc-200 bg-white transition-colors duration-200 dark:border-white/[0.07] dark:bg-[#0e1014]">

    <div className="flex h-16 items-center justify-between px-4">

  

      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-300 dark:hover:bg-white/[0.08]"
        onClick={onNewChat}
      >
        <Plus size={15} />
        New chat
      </button>
    </div>

    {/* Recent chats */}
    <div className="px-4 pb-2 pt-3">
      <p className="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-600">
        Recent chats
      </p>
    </div>

    <nav className="flex-1 space-y-1 overflow-y-auto px-3">
      {recentChats.map((chat) => (
        <button
          key={chat.id}
          type="button"
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
            currChat === chat.id
              ? "bg-zinc-100 text-zinc-900 dark:bg-white/[0.07] dark:text-zinc-100"
              : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-zinc-200"
          }`}
          onClick={()=>onSelectChat(chat)}
        >
          <MessageSquare
            size={16}
            className="shrink-0 text-zinc-500"
          />

          <span className="flex-1 truncate">
            {chat?.title}
          </span>

          <MoreHorizontal
            size={16}
            className="shrink-0 text-zinc-500 opacity-0 transition group-hover:opacity-100 dark:text-zinc-600"
          />
        </button>
      ))}
    </nav>

    {/* Bottom profile */}
    <div className="border-t border-zinc-200 p-4 dark:border-white/[0.07]">
      <div className="flex items-center gap-3 rounded-xl px-2 py-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-semibold text-white">
          U
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Your workspace
          </p>

          <p className="text-xs text-zinc-500">
            PDF assistant
          </p>
        </div>

        <ChevronDown
          size={15}
          className="text-zinc-500"
        />
      </div>
    </div>
  </aside>
)
    
}