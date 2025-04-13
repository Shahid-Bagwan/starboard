"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChatMessage } from "@/components/chat-message"

type Message = {
  id: string
  text: string
  isUser: boolean
  timestamp: string
}

export default function WorkshopPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Received",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="container mx-auto px-2 py-6 ">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deal Workshop</h1>
          <p className="text-muted-foreground">280 Richards, Brooklyn, NYC</p>
        </div>
        <div className="text-right">
          <h2 className="font-medium">Underwriting Model</h2>
          <p className="text-sm text-muted-foreground">Industrial Template v2.4.xlsx</p>
        </div>
      </div>

     

      {/* Chat area with light gray background */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 h-[300px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.text}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="relative">
        <Input
          className="pr-24"
          placeholder="Ask A Question"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="absolute right-2 top-2 flex space-x-1">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleSendMessage}>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
