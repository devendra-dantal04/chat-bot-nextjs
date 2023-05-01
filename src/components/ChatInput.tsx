'use client'


import { cn } from '@/lib/utils'
import { FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import TextareaAutoSize from "react-textarea-autosize"
import { useMutation } from "@tanstack/react-query"
import { nanoid } from 'nanoid'
import { Message } from '@/lib/validators/message'
import { MessagesContext } from '@/context/messages'
import { CornerDownLeft, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {

}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {

    const [input, setInput] = useState<string>('')
    const { setIsMessageUpdating, updateMessage, messages, addMessage, removeMessage } = useContext(MessagesContext)
    const textAreaRef = useRef<null | HTMLTextAreaElement>(null)

    const { mutate: sendMessage, isLoading } = useMutation({
        mutationFn: async (message: Message) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: [message] })
            })

            return response.body
        },
        onMutate: (message) => {
            addMessage(message)
        },
        onSuccess: async (stream) => {
            if (!stream) throw new Error("No stream found")

            const id = nanoid()
            const responseMessage: Message = {
                id,
                isUserMessage: false,
                text: ''
            }

            addMessage(responseMessage)

            setIsMessageUpdating(true)


            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false


            while (!done) {
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                const chunkValue = decoder.decode(value)
                updateMessage(id, (prev) => prev + chunkValue)
            }

            //cleanup
            setIsMessageUpdating(false)
            setInput('')

            setTimeout(() => {
                textAreaRef.current?.focus()
            }, 10)
        },
        onError: (_, message) => {
            toast.error('Something went wrong. Pls try again')
            removeMessage(message.id)
            textAreaRef.current?.focus()
        }
    })

    return <div className={cn('border-t border-zinc-300', className)} {...props}>
        <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
            <TextareaAutoSize disabled={isLoading} ref={textAreaRef} maxRows={4} rows={2} autoFocus placeholder='Write a message...' className='peer disabled:opacity-50 pr-14 resize-none block w-full border-0 bg-zinc-100 py-1.5 text-gray-900 focus:ring-0 text-sm sm:leading-6' value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()

                    const message = {
                        id: nanoid(),
                        isUserMessage: true,
                        text: input
                    }

                    sendMessage(message)
                }
            }} />
            <div className='absolute inset-y-0 flex py-1.5 pr-1.5 right-0'>
                <kbd className='inline-flex items-center rounded border bg-white border-gray-200 px-1 font-sans text-xs text-gray-200'>
                    {isLoading ? <Loader2 className='w-3 h-3 animate-spin' /> : <CornerDownLeft className='w-3 h-3 text-gray-800' />}
                </kbd>
            </div>
            <div aria-hidden="true" className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-400' />
        </div>
    </div>
}

export default ChatInput