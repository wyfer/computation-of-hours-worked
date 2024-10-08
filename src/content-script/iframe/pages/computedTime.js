// 获取时令信息
function getSeasonInfo(date) {
  const month = new Date(date).getMonth() + 1;

  // 获取冬夏时, 五月到10月之间为夏令时，其他时间为冬令时
  const isWinter = month < 5 || month > 9;

  const seasonHour = 1;
  const seasonMinutes = isWinter ? 0 : 30;

  const seasonText = isWinter ? '冬令时' : '夏令时';

  return {
    seasonText,
    isWinter,
    seasonHour,
    seasonMinutes
  }
}

// 返回休息时间
function setNoonBeakTime(date, start = true) {
  // 获取时令信息
  const { seasonMinutes } = getSeasonInfo(date);

  const time = new Date(date);

  if (start) {
    time.setHours(12);
    time.setMinutes(seasonMinutes);
    time.setSeconds(0);
  } else {
    time.setHours(13);
    time.setMinutes(seasonMinutes);
    time.setSeconds(0);
  }

  return time.getTime();
}

// 设置时间返回时间戳
function getTimestampSetTime(date, hour, minute, second) {
  const time = new Date(date);

  time.setHours(hour);
  time.setMinutes(minute);
  time.setSeconds(second);

  return time.getTime();
}

function betweenTimes(date, start, end) {
  return date > start && date < end;
}

export default function computedWorkTime(workStart, workEnd, crossing = false) {
  const { hour: workStartHour, minutes: workStartMinutes } = workStart;
  const { hour: workEndHour, minutes: workEndMinutes } = workEnd;

  // 时令信息
  let seasonInfo = null;

  // 获取今日
  const today = new Date();

  // 获取昨日
  const date = new Date();
  const yesterday = new Date(date.setDate(date.getDate() - 1));

  // 是否跨天
  let isCrossing = crossing;

  let endDate = new Date(today);
  let startDate = new Date(isCrossing ? yesterday : today);

  // 默认开始时间
  const defaultStartTime = getTimestampSetTime(startDate, 9, 0, 0);

  // 赋予给定时间
  startDate.setHours(workStartHour);
  startDate.setMinutes(workStartMinutes);
  startDate.setSeconds(0);

  endDate.setHours(workEndHour);
  endDate.setMinutes(workEndMinutes);
  endDate.setSeconds(0);

  let computedStartTime = startDate.getTime();
  let computedEndTime = endDate.getTime();

  // 同天午休时间处理
  const noonBeakTime = {
    startTime: setNoonBeakTime(startDate),
    endTime: setNoonBeakTime(startDate, false)
  };

  // 跨天午休时间处理
  const nexDayNoonBeakTime = {
    startTime: setNoonBeakTime(endDate),
    endTime: setNoonBeakTime(endDate, false)
  }


  // 开始时间处理
  // 如果早于 9:00，设为 9:00
  if (computedStartTime < defaultStartTime) {
    computedStartTime = defaultStartTime;
  }

  // 如果位于午休时间内，设为午休结束时间
  if (computedStartTime === noonBeakTime.startTime || computedStartTime === noonBeakTime.endTime || betweenTimes(computedStartTime, noonBeakTime.startTime, noonBeakTime.endTime)) {
    computedStartTime = noonBeakTime.endTime;
  }

  // 结束时间处理
  // 如果跨天,位于午休时间内，设为午休开始时间
  if (isCrossing && (computedEndTime === nexDayNoonBeakTime.startTime || computedEndTime === nexDayNoonBeakTime.endTime || betweenTimes(computedEndTime, nexDayNoonBeakTime.startTime, nexDayNoonBeakTime.endTime))) {
    computedEndTime = nexDayNoonBeakTime.startTime;
  } else {
    // 如果位于午休时间内，设为午休开始时间
    if (computedEndTime === noonBeakTime.startTime || computedEndTime === noonBeakTime.endTime || betweenTimes(computedEndTime, noonBeakTime.startTime, noonBeakTime.endTime)) {
      computedEndTime = noonBeakTime.startTime;
    }
  }

  // 时令信息，以开始时间作为处理时间
  seasonInfo = getSeasonInfo(computedStartTime);
  const { seasonHour, seasonMinutes } = seasonInfo;

  // 计算总时间差（以毫秒为单位）
  const totalDiffInMs = computedEndTime - computedStartTime;

  // 转换为分钟
  const totalDiffInMinutes = Math.floor(totalDiffInMs / (1000 * 60));

  // 计算休息时间
  let breakDurationInMinutes = (Number(seasonHour) * 60 + Number(seasonMinutes));

  // 如果开始时间和结束时间一致，设为 0
  if (computedStartTime === computedEndTime) {
    breakDurationInMinutes = 0;
  }

  // 如果开始时间位于午休时间内，设为 0
  if (computedStartTime === noonBeakTime.startTime || computedStartTime === noonBeakTime.endTime || betweenTimes(computedStartTime, noonBeakTime.startTime, noonBeakTime.endTime)) {
    breakDurationInMinutes = 0;
  }

  // 如果结束时间位于午休时间内，设为 0
  if (computedEndTime === noonBeakTime.startTime || computedEndTime === noonBeakTime.endTime || betweenTimes(computedEndTime, noonBeakTime.startTime, noonBeakTime.endTime)) {
    breakDurationInMinutes = 0;
  }

  // 计算跨天逻辑
  let addToNoonBeakTime = 0;
  if (isCrossing && computedEndTime > computedStartTime) {
    // 如果结束时间位于午休时间内，设为 0
    if (computedEndTime === nexDayNoonBeakTime.startTime || computedEndTime === nexDayNoonBeakTime.endTime || betweenTimes(computedEndTime, nexDayNoonBeakTime.startTime, nexDayNoonBeakTime.endTime)) {
      addToNoonBeakTime = 0;
    }

    // 如果时间大于午休时间，设为午休时间
    if (computedEndTime > nexDayNoonBeakTime.endTime) {
      addToNoonBeakTime = (Number(seasonHour) * 60 + Number(seasonMinutes));
    }
  }

  // 减去休息时间（也转换为分钟）
  const workDiffInMinutes = totalDiffInMinutes - breakDurationInMinutes - addToNoonBeakTime;

  // 将分钟转换回小时和分钟
  const workHours = Math.floor(workDiffInMinutes / 60);
  const workMinutes = workDiffInMinutes % 60;

  return {
    workTime: {
      hours: workHours,
      minutes: workMinutes
    },
    seasonInfo
  }
}

// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 18, minutes: 0 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 13, minutes: 0 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 59 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 17, minutes: 0 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 18, minutes: 30 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 18, minutes: 29 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 21, minutes: 0 });
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 13, minutes: 30 });
// computedWorkTime({ hour: 8, minutes: 59 }, { hour: 18, minutes: 0 });

// computedWorkTime({ hour: 12, minutes: 30 }, { hour: 12, minutes: 0 }, true);
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 }, true);
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 }, true);
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 }, true);
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 }, true);
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 }, true);
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 }, true);
// computedWorkTime({ hour: 9, minutes: 0 }, { hour: 12, minutes: 0 }, true);
