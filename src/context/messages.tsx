import { ReactNode, createContext, useState } from "react";
import { Message } from "@/lib/validators/message";
import { nanoid } from "nanoid";


export const MessagesContext = createContext<{
    messages: Message[]
    isMessageUpdating: boolean
    addMessage: (message: Message) => void
    removeMessage: (id: string) => void
    updateMessage: (id: string, updatefn: (prevText: string) => string) => void
    setIsMessageUpdating: (isUpdating: boolean) => void
}>({
    messages: [],
    isMessageUpdating: false,
    addMessage: () => { },
    removeMessage: () => { },
    updateMessage: () => { },
    setIsMessageUpdating: () => { }
})

export const MessagesProvider = ({ children }: { children: ReactNode }) => {

    const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: nanoid(),
            text: 'Hello, how can i help you?',
            isUserMessage: false
        }
    ])

    const addMessage = (message: Message) => {
        setMessages((prev) => [...prev, message])
    }

    const removeMessage = (id: string) => {
        setMessages((prev) => prev.filter((msg) => msg.id !== id))
    }

    const updateMessage = (id: string, updatefn: (prevText: string) => string) => {
        setMessages((prev) => prev.map((msg) => {
            if (msg.id === id) {
                return {
                    ...msg, text: updatefn(msg.text)
                }
            }

            return msg
        }))
    }


    return <MessagesContext.Provider value={{
        messages, addMessage, removeMessage, updateMessage, isMessageUpdating, setIsMessageUpdating
    }}>
        {children}
    </MessagesContext.Provider>
}