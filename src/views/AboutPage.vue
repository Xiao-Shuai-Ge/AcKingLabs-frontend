<!-- The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work. -->
<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    <!-- 头部区域 -->
    <div
        class="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 py-16 mt-14"
    >
      <div class="container mx-auto px-6 relative z-10">
        <img src="/assets/AcKing_white.png" alt="实验室标志" class="mx-auto w-32 h-auto" />
        <h1 class="text-4xl md:text-5xl font-bold text-white text-center mt-4">
          AcKing 算法竞赛实验室
        </h1>
      </div>
      <div class="absolute inset-0 opacity-20">
        <img
            src="https://readdy.ai/api/search-image?query=Abstract%20modern%20gradient%20background%20with%20blue%20and%20purple%20colors%2C%20smooth%20flowing%20shapes%20and%20subtle%20geometric%20patterns%20creating%20a%20professional%20and%20tech-oriented%20atmosphere%2C%20perfect%20for%20a%20corporate%20about%20us%20page%20background&width=1440&height=400&seq=1&orientation=landscape"
            alt="背景图"
            class="w-full h-full object-cover object-top"
        />
      </div>
    </div>
    <!-- 团队成员区域 -->
    <div class="container mx-auto px-6 py-16">
      <!-- 团队成员展示 -->
      <div class="space-y-6">
        <div
            v-for="(member, index) in teamMembers"
            :key="member.id"
            class="team-member-card bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="p-6 flex items-center gap-8">
            <div
                class="w-32 h-32 flex-shrink-0 rounded-full overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img
                  :src="member.avatar"
                  :alt="member.nickname"
                  class="w-full h-full object-cover object-top"
              />
            </div>
            <div class="flex-grow">
              <h3 class="text-2xl font-bold text-gray-800 mb-2">
                {{ member.nickname }}
                <span class="text-xl text-gray-500">{{ member.role }}</span>
              </h3>
              <h4 class="text-md text-gray-600 mb-3">
                <i class="fa-solid fa-user mr-1"></i>
                {{ member.realName }}
              </h4>
              <p class="text-sm text-gray-500 line-clamp-3">
                {{ member.bio }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 我们的使命 -->
    <div class="bg-white py-16">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12 text-gray-800">
          关于我们
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="mission-card p-6 bg-blue-50 rounded-lg text-center">
            <div
                class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-lightbulb text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-800">算法为何</h3>
            <p class="text-gray-600">
              解决一个问题，往往有多种方法，但好的算法可以让问题的解决更加高效、准确。算法竞赛便是通过对题目的分析思考，选出最优的算法，在规定时间内解决问题。
            </p>
          </div>
          <div class="mission-card p-6 bg-yellow-50 rounded-lg text-center">
            <div
                class="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-key text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-800">备赛意义</h3>
            <p class="text-gray-600">
              算法竞赛是一项公平且有趣的竞赛，想取得成绩需要靠自身的天赋与努力。取得优异的奖项也会对就业、考研等方面有着巨大的帮助。
            </p>
          </div>
          <div class="mission-card p-6 bg-red-50 rounded-lg text-center">
            <div
                class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="fas fa-users text-white text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-800">团队目标</h3>
            <p class="text-gray-600">
              AcKing 算法竞赛实验室，致力于为校内算法竞赛爱好者提供一个学习、交流、竞赛的平台。为学校 ACM 竞赛圈的发展贡献自己的力量。
            </p>
          </div>
        </div>
      </div>
    </div>
    <!-- 加入我们 -->
    <div class="bg-gray-50 py-16">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">加入我们</h2>
        <p class="text-gray-600 max-w-2xl mx-auto mb-8">
          你可以通过大一的统一考核加入我们，也可以凭借过硬的实力破格加入我们，详情请联系我们。
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { ref, onMounted } from "vue";
interface TeamMember {
  id: number;
  role: string;
  nickname: string;
  realName: string;
  bio: string;
  avatar: string;
}

const teamMembers = ref<TeamMember[]>([
  {
    id: 1,
    role: "「网站开发者」",
    nickname: "小帅哥",
    realName: "23软件工程 林恬烁",
    bio: "大一开学前就开始参与暑假集训，大一期间夺得过ICPC邀请赛银、天梯赛个人国一、蓝桥杯国二。大二开始双开算法与开发，进入 achobeta 实验室，主攻go后端。于2025年上半年立项 AcKing 学习分享平台，由个人全栈开发。",
    avatar: "/assets/avatar/XSG.png",
  },
  {
    id: 2,
    role: "「实验室创始人」",
    nickname: "YJDDB",
    realName: "22计科 代金宇",
    bio: "AcKing实验室、AchoBeta实验室双话事人，前竞赛中心负责人，go后端开发大佬，大三字节实习。曾负责安排管理校内各算法比赛，为校内算法竞赛氛围做出很大贡献。",
    avatar: "/assets/avatar/yjddb.jpg",
  },
  {
    id: 3,
    role: "「指导老师」",
    nickname: "陈老",
    realName: "陈传祥 老师",
    bio: "ACE实验室、AcKing实验室指导老师。指导管理校内的ACM竞赛等算法竞赛事项，并给予了我们很大支持和帮助。",
    avatar: "/assets/avatar/ccx.jpg",
  },
  {
    id: 4,
    role: "「主力选手」",
    nickname: "SeaYellow",
    realName: "22大数据 黄海",
    bio: "cf紫名选手，主攻算法竞赛。夺得过多枚邀请赛银、区域赛铜，CCF-CSP认证435分全国前0.34%。目前为校内公认最强算法选手。",
    avatar: "/assets/avatar/hh.jpg",
  },
  {
    id: 5,
    role: "「主力选手」",
    nickname: "fang_baby",
    realName: "23大数据 林志龙",
    bio: "cf紫名选手，主攻算法竞赛。大一期间夺得邀请赛银，连续两届校赛冠军，0基础起步天赋型选手。目前主要负责校内ACM队伍组织和报销流程。",
    avatar: "/assets/avatar/fang_baby.png",
  }
]);

</script>

<style scoped>
.loader {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
  animation: rotate 1s linear infinite;
}
.loader::before {
  content: "";
  box-sizing: border-box;
  position: absolute;
  inset: 0px;
  border-radius: 50%;
  border: 5px solid #3b82f6;
  animation: prixClipFix 2s linear infinite;
}
.loader-inner {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  background-color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(0.6);
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0);
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0);
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%);
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%);
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0);
  }
}
.team-member-card {
  animation: fadeInUp 0.6s ease-out both;
}
.mission-card {
  transition: all 0.3s ease;
}
.mission-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
