import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useChatStore = defineStore('chatMessages', {
    state: () => ({
        idAsso: null,
        messages: []
    }),
    actions: {
        addMessage(message) {
            this.messages.push(message);
        },
        setMessages(messages) {
            this.messages = messages;
        }
    }
})