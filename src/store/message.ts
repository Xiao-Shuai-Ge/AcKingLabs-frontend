// stores/message.ts
import { ref } from 'vue'

export interface Message {
    id: number
    content: string
    type?: 'info' | 'success' | 'warning' | 'error'
}

const messages = ref<Message[]>([])
let idCounter = 0

export const useMessage = () => {
    const addMessage = (content: string, type?: Message['type']) => {
        const id = idCounter++
        messages.value.push({ id, content, type })

        setTimeout(() => {
            const index = messages.value.findIndex(msg => msg.id === id)
            if (index !== -1) messages.value.splice(index, 1)
        }, 3000)
    }

    return {
        messages,
        addMessage
    }
}