<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-4">
    <!-- 进度条区域 -->
    <div class="mb-6 bg-gray-800 rounded-lg p-6">
      <div class="flex items-center justify-between relative">
        <div
            v-for="(month, index) in months"
            :key="index"
            class="flex flex-col items-center z-10 cursor-pointer"
            @click="currentMonth = index"
        >
          <div
              :class="[
            'w-4 h-4 rounded-full mb-2',
            index < currentMonth ? 'bg-blue-500' :
            index === currentMonth ? 'bg-green-500' : 'bg-gray-600'
          ]"
          ></div>
          <span
              class="text-sm"
              :class="{'text-green-500': index === currentMonth}"
          >
            {{ month }}月
          </span>
        </div>
        <!-- 连接线 -->
        <div class="absolute top-2 left-0 w-full h-0.5 bg-gray-600"></div>
      </div>
    </div>

    <div class="flex gap-4 h-[calc(100vh-180px)]">
      <!-- 左侧干员列表 -->
      <div class="w-[320px] bg-gray-800 rounded-lg p-4 flex flex-col">
        <div class="relative mb-4 flex bg-gray-700">
          <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索干员..."
              class="w-full bg-gray-700 px-4 py-2 rounded-lg text-sm border-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex-1 overflow-y-auto">
          <div
              v-for="operator in filteredOperators"
              :key="operator.id"
              class="bg-gray-700 rounded-lg p-3 mb-3 cursor-pointer hover:bg-gray-600"
              @click="dialogVisible = true"
          >
            <div class="flex">
              <img
                  :src="operator.avatar"
                  class="w-10 h-10 rounded-xl mr-2"
              />
              <div class="flex flex-col gap-3 w-full">
                <h3 class="font-medium">{{ operator.name }}</h3>
                <ProgressBar
                    color="bg-yellow-400"
                    :main-percent="operator.score * 100 / 3000"
                    :fast-percent="operator.score * 100 / 3000"
                    :height="5"
                    class="w-full h-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧游戏窗口 -->
      <div class="flex-1 bg-gray-800 rounded-lg border border-gray-700">
        <div class="h-full flex items-center justify-center text-gray-500">
          游戏窗口区域
        </div>
      </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="Tips"
        width="500"
        :before-close="handleClose"
    >
      <span>This is a message</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {ref, computed, onMounted, onBeforeUnmount} from "vue";
import { Search } from "@element-plus/icons-vue";
import ProgressBar from "@/components/game/ProgressBar.vue";
import {useGameStore} from "@/store/game";

const dialogVisible = ref(true);

const months = [8,9,10,11,12,1,2,3,4,5,6,7];
const currentMonth = ref(0);
const searchQuery = ref("");

const GameStore = useGameStore();

const operators = ref([
  {
    id: 1,
    name: "小帅哥",
    score: 1600
  }
]);

const filteredOperators = computed(() => {
  return GameStore.operators.filter(
      (operator) =>
          operator.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
import { useDark , useToggle } from '@vueuse/core'

</script>

<style scoped>
.operator-list::-webkit-scrollbar {
  width: 6px;
}

.operator-list::-webkit-scrollbar-track {
  background: #374151;
}

.operator-list::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

.operator-list::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
