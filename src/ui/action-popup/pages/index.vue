<script setup lang="ts">
import { ref } from "vue";
import logoImg from "../../../assets/logo.png";
import { computedWorkTime, getSeasonInfo } from "./computedTime";

const { seasonText, seasonHour, seasonMinutes } = getSeasonInfo(new Date());

// 令时
const season = ref(seasonText);

// 开始时间
const startHour = ref(9);
const startMinute = ref(0);

// 结束时间
const endHour = ref(18);
const endMinute = ref(30);

// 午休时间
const seatHour = ref(seasonHour);
const seatMinute = ref(seasonMinutes);

// 是否超过当日
const overDay = ref(false);

// 上班时长
const totalHour = ref(0);
const totalMinute = ref(0);

// 总工时
const manHour = ref(0);

// function changeOverDay(): void {
//   overDay.value = !overDay.value;
// }

function roundDownToDecimal(number: any, decimalPlaces: any): number {
  const factor = 10 ** decimalPlaces;
  return Math.floor(number * factor) / factor;
}

function showWorkTime(hours: number | string, minutes: number | string): void {
  if ((hours as number) < 10) {
    hours = `0${hours}`;
  }
  if ((minutes as number) < 10) {
    minutes = `0${minutes}`;
  }
  totalHour.value = hours as number;
  totalMinute.value = minutes as number;
}

function submit(): void {
  const { workTime } = computedWorkTime(
    { hour: startHour.value, minutes: startMinute.value },
    { hour: endHour.value, minutes: endMinute.value },
    { hour: seatHour.value, minutes: seatMinute.value},
    overDay.value
  );

  const { hours, minutes } = workTime;

  const total = roundDownToDecimal((hours * 60 + minutes) / 60, 1);

  manHour.value = total;
  showWorkTime(hours, minutes);
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
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-7 w-auto"
        :src="logoImg"
      >
      <h2 class="mt-4 text-center text-base font-bold leading-9 tracking-tight text-gray-900">
        TIME COMPUTED
      </h2>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        class="space-y-6"
        @submit.prevent="submit"
      >
        <div>
          <label class="block text-sm font-medium leading-6 text-gray-900">上班时间</label>
          <div class="mt-1 flex gap-10 w-full">
            <div
              class="w-2/4 flex"
            >
              <UInput
                v-model="startHour"  
                :maxlength="2"
              />
              <span class="flex select-none items-center text-gray-500 text-sm ml-2">点</span>
            </div>

            <div
              class="w-2/4 flex"
            >
              <UInput
                v-model="startMinute"
                :maxlength="2"
              />
              <span class="flex select-none items-center text-gray-500 text-sm ml-2">分</span>
            </div>
          </div>
          <p
            v-if="startHour > 24 || startMinute > 59"
            class="mt-1 text-sm"
            style="color: var(--destructive)"
          >
            时间输入的不正确哦
          </p>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium leading-6 text-gray-900">下班时间</label>
          </div>
          <div class="mt-1 flex gap-10 w-full">
            <div
              class="w-2/4 flex"
            >
              <UInput
                v-model="endHour" 
                :maxlength="2"
              />
              <span class="flex select-none items-center text-gray-500 text-sm ml-2">点</span>
            </div>

            <div
              class="w-2/4 flex"
            >
              <UInput
                v-model="endMinute" 
                :maxlength="2"
              />
              <span class="flex select-none items-center text-gray-500 text-sm ml-2">分</span>
            </div>
          </div>
          <p
            v-if="endHour > 24 || endMinute > 59"
            class="mt-1 text-sm"
            style="color: var(--destructive)"
          >
            时间输入的不正确哦
          </p>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm font-medium leading-6 text-gray-900">午休时间（{{ season }}）</label>
          </div>
          <div class="mt-1 flex gap-10 w-full">
            <div
              class="w-2/4 flex"
            >
              <UInput
                v-model="seatHour"
                :maxlength="2"
              />
              <span class="flex select-none items-center text-gray-500 text-sm ml-2 flex-none">小时</span>
            </div>

            <div
              class="w-2/4 flex"
            >
              <UInput
                v-model="seatMinute" 
                :maxlength="2"
              />
              <span class="flex select-none items-center text-gray-500 text-sm ml-2 flex-none">分</span>
            </div>
          </div>
        </div>

        <div>
          <div class="flex h-6 items-center">
            <USwitch v-model="overDay" />
            <label
              id="switch-1-label"
              class="text-sm leading-6 text-gray-600 ml-4"
            >
              是否持续到第二天( 真的勇士！好心脏！好身体！)
            </label>
          </div>
        </div>

        <div>
          <UButton
            type="submit"
            class="flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm corsor-pointer"
          >
            计算工时
          </UButton>
        </div>
      </form>

      <div v-show="manHour">
        <dl class="mt-8 max-w-xl text-base leading-7 text-gray-600 lg:max-w-none flex justify-between items-center">
          <div class="relative pl-0 flex flex-col">
            <dt class="inline font-semibold text-gray-900">
              共计 {{ totalHour }} 小时 {{ totalMinute }} 分
            </dt>
          </div>
          <div class="relative pl-9 flex flex-col">
            <dt class="inline font-semibold text-gray-900">
              <svg
                class="absolute left-1 top-1 h-5 w-5"
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
              合 {{ manHour }} 工时
            </dt>
          </div>
        </dl>
      </div>

      <div
        v-if="!manHour"
        class="mt-4 max-w-xl text-base leading-7 text-gray-600 lg:max-w-none flex justify-between items-center"
      >
        算岔劈了,时间是不是不对？请检查输入的时间
      </div>
    </div>
  </div>
</template>

<style scoped></style>
