import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useChatMessages = defineStore('chatMessages', () => {
    const messages = ref([{
        idAssociacio,
        user,
        content, 
        time
    }])

    return { messages }
})