<template>
  <transition-group
      name="message"
      tag="div"
      class="fixed bottom-0 right-0 z-50 p-4 space-y-2 w-80"
  >
    <div
        v-for="(msg, index) in messages"
        :key="msg.id"
        class="relative flex items-center justify-between p-4  rounded-lg shadow-lg font-bold"
        :class="{
        'bg-blue-500': msg.type === 'info',
        'bg-green-500': msg.type === 'success',
        'bg-yellow-500': msg.type === 'warning',
        'bg-red-500': msg.type === 'error'
      }"
    >
      <span class="text-white">{{ msg.content }}</span>
      <button
          @click="removeMessage(index)"
          class="text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  </transition-group>
</template>

<script setup lang="ts">
import { useMessage } from '@/store/message'

const { messages } = useMessage()
const removeMessage = (index: number) => {
  messages.value.splice(index, 1)
}
</script>

<style>
.message-enter-active,
.message-leave-active {
  transition: all 0.5s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>