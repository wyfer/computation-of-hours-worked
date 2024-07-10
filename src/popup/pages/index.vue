<script setup lang="ts">
import { ref } from "vue";
import func from "../../../vue-temp/vue-editor-bridge";
import logoImg from "../../assets/logo.png";

// 开始时间
const startHour = ref("9");
const startMinute = ref("0");

// 结束时间
const endHour = ref("18");
const endMinute = ref("30");

// 午休时间
const seatHour = ref("1");
const seatMinute = ref("30");

// 是否超过当日
const overDay = ref(false);

// 上班时长
const totalHour = ref("");
const totalMinute = ref("");

// 总工时
const manHour = ref("");

// 错误提示
const showError = ref(false);
const showErrorMessage = ref("");

function changeOverDay(): void {
  overDay.value = !overDay.value;
}

function setDateAndTime(dateObj, hours, minutes): void {
  dateObj.setHours(hours, minutes, 0, 0);
}

function showWorkTime(hours, minutes): void {
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  totalHour.value = hours;
  totalMinute.value = minutes;
}

function calculateWorkHours(
  startTime,
  endTime,
  breakDurationInMinutes
): {
  hours: number;
  minutes: number;
} {
  // 处理跨天逻辑
  if (overDay.value) {
    startTime.setDate(startTime.getDate() - 1);

    const endNoon = new Date(endTime);
    endNoon.setHours(12, 0, 0, 0);

    // 计算中午12点后60分钟的时间
    const noonEndPlus = new Date(endNoon.getTime());
    noonEndPlus.setMinutes(endNoon.getMinutes() + breakDurationInMinutes);

    // 检查结束时间是否在中午12点到中午12点后60分钟内
    if (endTime > endNoon) {
      throw new Error("离了大谱，都快要猝死了！");
    }
  }

  // 开始时间和结束时间
  if (startTime > endTime || endTime.getTime() === startTime.getTime()) {
    throw new Error("你真是够够的了！");
  }

  // 获取当前日期的中午12点时间
  const noon = new Date(startTime);
  noon.setHours(12, 0, 0, 0); // 设置为当天的中午12点

  // 计算中午12点后60分钟的时间
  const noonPlus = new Date(noon.getTime());
  noonPlus.setMinutes(noon.getMinutes() + breakDurationInMinutes);

  // 检查结束时间是否在中午12点到中午12点后60分钟内
  if ((endTime > noon && endTime <= noonPlus) || endTime.getTime() === noon.getTime()) {
    breakDurationInMinutes = 0;
    endTime = new Date(noon);
  }

  // 计算总时间差（以毫秒为单位）
  const totalDiffInMs = endTime - startTime;

  // 转换为分钟
  const totalDiffInMinutes = Math.floor(totalDiffInMs / (1000 * 60));

  // 减去休息时间（也转换为分钟）
  const workDiffInMinutes = totalDiffInMinutes - breakDurationInMinutes;

  // 将分钟转换回小时和分钟
  const workHours = Math.floor(workDiffInMinutes / 60);
  const workMinutes = workDiffInMinutes % 60;

  return {
    hours: workHours,
    minutes: workMinutes,
  };
}

function roundDownToDecimal(number, decimalPlaces): number {
  const factor = 10 ** decimalPlaces;
  return Math.floor(number * factor) / factor;
}

function submit(): void {
  const startTime = new Date();
  setDateAndTime(startTime, Number(startHour.value), Number(startMinute.value));

  const endTime = new Date();
  setDateAndTime(endTime, Number(endHour.value), Number(endMinute.value));

  // 休息时间设置为1小时（即60分钟）
  const breakDuration = Number(seatHour.value) * 60 + Number(seatMinute.value);

  // 计算并打印工作时长
  try {
    const { hours, minutes } = calculateWorkHours(startTime, endTime, breakDuration);
    const total = roundDownToDecimal((hours * 60 + minutes) / 60, 1);
    if (total < 0) {
      throw new Error("算错了，自己算吧！");
    }
    manHour.value = total;
    showWorkTime(hours, minutes);
  } catch (e) {
    manHour.value = 0;
    showWorkTime(0, 0);

    showError.value = true;
    showErrorMessage.value = e.message;
    setTimeout(() => {
      showError.value = false;
    }, 2000);
  }
}

onMounted(() => {
  const now = new Date();
  endHour.value = now.getHours();
  endMinute.value = now.getMinutes();

  submit();
});
</script>

<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-6 mx-auto relative">
    <div v-if="showError" role="alert" class="alert alert-error absolute top-4 w-11/12 display flex">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ showErrorMessage }}</span>
    </div>

    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-7 w-auto" :src="logoImg">
      <h2 class="mt-4 text-center text-base font-bold leading-9 tracking-tight text-gray-900">
        TIME COMPUTED
      </h2>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="submit">
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">上班时间</label>
          <div class="mt-1 flex gap-2 w-full">
            <div
              class="w-2/4 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md px-3"
            >
              <input
                v-model="startHour"
                required
                placeholder="时"
                type="number"
                class="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              >
              <span class="flex select-none items-center text-gray-500 text-sm">点</span>
            </div>

            <div
              class="w-2/4 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md px-3"
            >
              <input
                v-model="startMinute"
                required
                placeholder="分"
                type="number"
                class="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              >
              <span class="flex select-none items-center text-gray-500 text-sm">分</span>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium leading-6 text-gray-900">下班时间</label>
          </div>
          <div class="mt-1 flex gap-2 w-full">
            <div
              class="w-2/4 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md px-3"
            >
              <input
                v-model="endHour"
                required
                placeholder="时"
                type="number"
                class="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              >
              <span class="flex select-none items-center text-gray-500 text-sm">点</span>
            </div>

            <div
              class="w-2/4 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md px-3"
            >
              <input
                v-model="endMinute"
                required
                placeholder="分"
                type="number"
                class="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              >
              <span class="flex select-none items-center text-gray-500 text-sm">分</span>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium leading-6 text-gray-900">午休时间</label>
          </div>
          <div class="mt-1 flex gap-2 w-full">
            <div
              class="w-2/4 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md px-3"
            >
              <input
                v-model="seatHour"
                required
                placeholder="小时"
                type="number"
                class="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              >
              <span class="flex select-none items-center text-gray-500 text-sm whitespace-nowrap">小时</span>
            </div>

            <div
              class="w-2/4 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md px-3"
            >
              <input
                v-model="seatMinute"
                required
                placeholder="分"
                type="number"
                class="block w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              >
              <span class="flex select-none items-center text-gray-500 text-sm">分</span>
            </div>
          </div>
        </div>

        <div>
          <div class="flex h-6 items-center">
            <button
              type="button"
              class="flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-3"
              :class="{
                'bg-indigo-600': overDay,
              }"
              role="switch"
              aria-checked="false"
              aria-labelledby="switch-1-label"
              @click="changeOverDay"
            >
              <span class="sr-only" />
              <span
                aria-hidden="true"
                class="h-4 w-4 translate-x-0 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                :class="{
                  'translate-x-3.5': overDay,
                }"
              />
            </button>
            <label id="switch-1-label" class="text-sm leading-6 text-gray-600">是否持续到第二天(真的勇士！好心脏！好身体！)</label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            计算
          </button>
        </div>
      </form>

      <div v-show="manHour">
        <dl class="mt-8 max-w-xl text-base leading-7 text-gray-600 lg:max-w-none flex justify-between items-center">
          <div class="relative pl-9 flex flex-col">
            <dt class="inline font-semibold text-gray-900">
              <svg
                class="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5zm3.75-2.75a.75.75 0 001.5 0V9.66l1.95 2.1a.75.75 0 101.1-1.02l-3.25-3.5a.75.75 0 00-1.1 0l-3.25 3.5a.75.75 0 101.1 1.02l1.95-2.1v4.59z"
                  clip-rule="evenodd"
                />
              </svg>
              共计 {{ totalHour }} 小时 {{ totalMinute }} 分
            </dt>
          </div>
          <div class="relative pl-9 flex flex-col">
            <dt class="inline font-semibold text-gray-900">
              <svg
                class="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                  clip-rule="evenodd"
                />
              </svg>
              折合 {{ manHour }} 工时
            </dt>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
