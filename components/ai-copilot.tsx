"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send, Loader2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your FactoryPulse AI Copilot. I can help you with predictive maintenance insights, troubleshooting recommendations, spare parts availability, and maintenance planning. Ask me anything about your machines or upcoming maintenance schedules.",
    timestamp: new Date(Date.now() - 5 * 60000),
  },
]

const sampleResponses = [
  "Motor M-42 shows elevated vibration levels (3.2mm/s) that exceed normal operating thresholds. I recommend scheduling a bearing inspection within the next 48 hours to prevent catastrophic failure. Parts P-847 (bearing set) and P-921 (coupling) are in stock.",
  "Based on predictive analytics, Pump P-18 has an 87% probability of failure within 7 days. Root cause analysis suggests seal degradation. Recommended action: Order seal kit S-104 (2-3 day lead time) and schedule replacement during next maintenance window.",
  "The compressor fleet shows anomalous power consumption patterns. Compressor C-5 is 23% above baseline. This could indicate filter clogging or thermal inefficiency. Suggest immediate filter inspection and thermal imaging diagnostics.",
  "Your MTTR has improved 34% over the last quarter! Automated predictive alerts have reduced unplanned downtime by 18 hours. Current system health score: 8.7/10.",
]

export function AICopilot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: sampleResponses[Math.floor(Math.random() * sampleResponses.length)],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Copilot</CardTitle>
        <CardDescription>Predictive maintenance insights and troubleshooting assistant</CardDescription>
      </CardHeader>
      <Separator />
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary font-bold text-sm">
                  FP
                </div>
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted text-muted-foreground rounded-bl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                <Loader2 className="size-4 animate-spin" />
              </div>
              <div className="bg-muted text-muted-foreground rounded-lg rounded-bl-none px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <Separator />
      <CardContent className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about machine health, maintenance schedules..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
            className="text-sm"
          />
          <Button size="sm" onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
