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

export const CodeHandler = (code : number , extra? : [number,string,type?: 'info' | 'success' | 'warning' | 'error'][] ):boolean =>  {
    const messageFunctions = useMessage()
    const map = new Map<number, [string, type?: 'info' | 'success' | 'warning' | 'error']>([
        [-20008, [ '权限不足', 'error']],
        [-20007, [ '请求过于频繁，请稍后再试', 'error']],
        [20000, [ '','success']],
        [0, [ '失败','error']]
    ])
    if (extra) {
        for (const item of extra) {
            map.set(item[0], [item[1], item[2]])
        }
    }
    if (map.has(code)) {
        if (map.get(code)![0] !== '') {
            messageFunctions.addMessage(map.get(code)![0], map.get(code)![1])
        }
    } else {
        messageFunctions.addMessage(map.get(0)![0], map.get(0)![1])
    }
    return code !== 20000;
}