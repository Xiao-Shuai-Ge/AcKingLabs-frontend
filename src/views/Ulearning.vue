<template>
  <div class="min-h-screen bg-gray-50 text-black">
    <Header/>

    <div class="max-w-3xl mx-auto px-4 py-8 mt-14" v-if="!isLoading">
      <div class="flex justify-center bg-white rounded-md border-4 border-gray-800 p-4">
        <h1 class="text-3xl font-bold text-center text-gray-800">签到活动</h1>
      </div>
      <!-- 列表  -->
      <div
          v-if="actives.length > 0"
          v-for="(active, index) in actives"
          @click="Signin(active)"
          class="mt-4 cursor-pointer flex flex-col border-2 border-gray-800 p-3 rounded-md shadow-lg hover:scale-105 transition-all duration-300"
          :class="active.colorClass"
      >
        <div class="flex font-bold text-lg">
          {{ active.className }} : {{ active.activeName }}
          <div v-if="active.isFinished"
              class="bg-gray-300 text-white rounded-md p-1 text-sm ml-2"
          >
            已结束
          </div>
          <div v-else
               class="bg-blue-300 text-white rounded-md p-1 text-sm ml-2"
          >
            进行中
          </div>
        </div>
        <div v-if="!active.isSignin" class="flex text-md mt-2">
          <span class="text-gray-500 font-bold mr-2">签到人数:</span>
          <span :class="active.percentage >= 20? 'text-green-500 text-sm' : 'text-red-500 text-sm'">{{ active.absenceNum }}</span>
          <span class="ml-1 text-gray-500 text-sm">/ {{ active.notAbsenceNum + active.absenceNum }}</span>
        </div>
        <div v-if="!active.isSignin" class="mt-2 text-sm">
          <el-progress
              :percentage="active.percentage"
              :stroke-width="15"
              :color="active.percentage >= 20 ?  '#52c41a': '#f5222d'"
              :format="() => `${active.percentage.toFixed(2)}%`"
              striped
              striped-flow
              :duration="10"
          />

        </div>
      </div>
      <div v-else class="text-center py-16 flex flex-col items-center justify-center">
        <i class="fas fa-calendar-times text-6xl text-gray-400 mb-4"></i>
        <span class="text-gray-500 text-lg">近期暂无未签活动</span>
      </div>

      <div class="flex justify-center bg-white rounded-md border-4 border-gray-800 p-4 mt-10">
        <h1 class="text-3xl font-bold text-center text-gray-800">课程列表</h1>
      </div>
      <!-- 列表  -->
      <div
          v-for="(course, index) in courses"
          class="mt-4 cursor-pointer flex flex-col border-2 border-gray-800 p-3 rounded-md shadow-lg hover:scale-105 transition-all duration-300"
          :class="course.isAutoSignin? 'bg-yellow-100' : 'bg-white'"
           @click="OpenCourseDialog(course)"
      >
        <div class="flex font-bold text-lg">
          {{ course.courseName }}
        </div>
      </div>
    </div>
  </div>
  <el-dialog
      v-model="CourseDialogVisible"
      title="自动签到设置"
      width="500"
      align-center
      class="flex flex-col"
  >
    <div>
      <span>开启自动签到</span>
      <el-switch
          v-model="IsAutoSignin"
          class="ml-2"
      />
    </div>
    <div v-if="IsAutoSignin">
      <span class="mr-2">触发比例</span>
      <el-input v-model="AutoSigninPercent" style="width: 100px" placeholder="0~100" />
    </div>



    <template #footer>
      <div class="dialog-footer">
        <el-button @click="CourseDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="SaveCourseSetting()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import Header from "@/components/Header.vue";
import {onMounted, ref} from "vue";
import {signin_list, signin, signin_teacher, get_auto_list, save_auto_setting} from "@/api/test";
import router from "@/router";

// 使用信息框
import { CodeHandler, useMessage} from '@/store/message'
const { addMessage } = useMessage()


interface Active {
  activeName: string;
  className: string;
  userID: number;
  classID: number;
  relationID: number;
  disabled: boolean;
  colorClass: string;
  teacherMode : boolean;
  absenceNum : number;
  notAbsenceNum: number;
  isFinished: boolean;
  percentage: number;
  isSignin: boolean;
}

interface Course {
  courseName: string;
  courseID: number;
  classID: number;
  isAutoSignin: boolean;
  Percent: number;
}

const actives = ref<Active[]>([]);
const courses = ref<Course[]>([]);
const isLoading = ref(true);
const myLevel = ref(0);

onMounted(async () => {
  isLoading.value = true;
  // 获取活动列表
  addMessage("加载中...","info")
  const data = await signin_list();
  if (data.data.code != 20000) {
    addMessage("发生错误!","error")
    setTimeout(() => {
      router.push("/");
    },1000)
    return
  }
  console.log("加载成功", data.data.data);
  addMessage("加载成功!","success")
  myLevel.value = data.data.data.level;
  if (data.data.data.length > 0) {
    for (const active of data.data.data.actives) {
      actives.value.push({
        activeName: active.active_name,
        className: active.class_name,
        userID: active.user_id,
        classID: active.class_id,
        relationID: active.relation_id,
        disabled: false,
        colorClass: "bg-white",
        teacherMode: active.is_finished, // 如果已结束则为true
        absenceNum: active.absence_num,
        notAbsenceNum: active.not_absence_num,
        isFinished: active.is_finished,
        percentage: (active.absence_num / (active.absence_num + active.not_absence_num) * 100),
        isSignin: false,
      });
    }
  }
  for (const course of data.data.data.courses) {
    courses.value.push({
      courseName: course.course_name,
      courseID: course.course_id,
      classID: course.class_id,
      isAutoSignin: false,
      Percent: 0,
    });
  }
  // 获取自动签到列表
  const autoIDList = await get_auto_list()
  if (autoIDList.data.data.course_list) {
    for (const auto_course of autoIDList.data.data.course_list) {
      for (const course of courses.value) {
        if (course.courseID == auto_course.course_id) {
          course.isAutoSignin = true
          course.Percent = auto_course.percent
        }
      }
    }
  }
  //console.log("活动列表", courses.value);
  isLoading.value = false;
})

const Signin = async (active : Active) => {
  if (active.disabled) {
    addMessage("请等待处理中...","warning")
    return
  }
  addMessage("签到中...","info")
  active.disabled = true
  active.colorClass = "bg-yellow-100"
  let data;
  if (active.teacherMode) {
    data = await signin_teacher({
      relation_id: active.relationID,
      user_id: active.userID,
    })
  } else {
    data = await signin({
      relation_id: active.relationID,
      user_id: active.userID,
      class_id: active.classID,
    })
  }
  console.log("签到结果",data)
  if (data.data.code != 20000) {
    addMessage("签到失败!","error")
    active.colorClass = "bg-red-100"
    active.disabled = false
    active.teacherMode = true
    return
  }
  addMessage("签到成功!","success")
  active.teacherMode = false
  active.isSignin = true
  active.colorClass = "bg-green-100"
  active.absenceNum = active.absenceNum + 1
  active.notAbsenceNum = active.notAbsenceNum - 1
  active.percentage = (active.absenceNum / (active.absenceNum + active.notAbsenceNum) * 100)
}

const CourseDialogVisible = ref(false)

const SelectCourseID = ref(0)
const SelectCourseName = ref("")
const SelectClassID = ref(0)
const IsAutoSignin = ref(false)
const AutoSigninPercent = ref(0)

const OpenCourseDialog = (course : Course) => {
  if ( myLevel.value >= 3 ) {
    SelectCourseID.value = course.courseID
    SelectCourseName.value = course.courseName
    SelectClassID.value = course.classID
    IsAutoSignin.value = course.isAutoSignin
    AutoSigninPercent.value = course.Percent
    CourseDialogVisible.value = true
  }
}

const SaveCourseSetting = async () => {
  const data = await save_auto_setting({
    course_id: SelectCourseID.value,
    course_name: SelectCourseName.value,
    class_id: SelectClassID.value,
    is_auto: IsAutoSignin.value,
    percent: Number(AutoSigninPercent.value),
  })
  if (data.data.code != 20000) {
    addMessage("设置失败!","error")
    console.log(data.data)
    return
  }
  addMessage("设置成功!","success")
  for (const course of courses.value) {
    if (course.courseID == SelectCourseID.value) {
      course.isAutoSignin = IsAutoSignin.value
      course.Percent = Number(AutoSigninPercent.value)
    }
  }
  CourseDialogVisible.value = false
  // 设置成功后刷新token

}

</script>