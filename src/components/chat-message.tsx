import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type ChatMessageProps = {
  message: string
  isUser: boolean
  timestamp?: string
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  return (
    <div className={cn("flex items-start gap-3 mb-4", isUser ? "flex-row-reverse" : "")}>
      <Avatar className="h-8 w-8 mt-1">
        {isUser ? (
          <>
            <AvatarImage src="/placeholder.svg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Assistant" />
            <AvatarFallback>A</AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",
        )}
      >
        <p className="text-sm">{message}</p>
        {timestamp && <p className="text-xs opacity-70 mt-1">{timestamp}</p>}
      </div>
    </div>
  )
}
