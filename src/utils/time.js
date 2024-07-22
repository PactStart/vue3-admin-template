//格式化日期  
function formatTimestamp(timestamp, formatStr) {
    const date = new Date(timestamp); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    let result = "";
    if (formatStr == "yyyy-MM-dd") {
      result = `${year}-${month}-${day}`;
    } else if (formatStr == "yyyy-MM-dd HH:mm:ss") {
      result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else if (formatStr == "yyyyMMdd") {
      result = `${year}${month}${day}`;
    } else if (formatStr == "yyyyMMddHHmmss") {
      result = `${year}${month}${day}${hours}${minutes}${seconds}`;
    } else if (formatStr == "MM月dd日") {
      result = `${month}月${day}日`;
    } else if (formatStr == "MM-dd HH:mm") {
      result = `${month}-${day} ${hours}:${minutes}`;
    } else if (formatStr == "MM-dd") {
      result = `${month}-${day}`;
    } else if (formatStr == "HH:mm") {
      result = `${hours}:${minutes}`;
    } else {
      result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return result;
}

function getCurrentMonthFirst() {
  var date = new Date();
  date.setDate(1);
  var month = parseInt(date.getMonth() + 1);
  var day = date.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return date.getFullYear() + "-" + month + "-" + day;
}
function getCurrentMonthLastDay() {
  var date = new Date();
  var currentMonth = date.getMonth();
  var nextMonth = ++currentMonth;
  var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
  var oneDay = 1000 * 60 * 60 * 24;
  var lastTime = new Date(nextMonthFirstDay - oneDay);
  var month = parseInt(lastTime.getMonth() + 1);
  var day = lastTime.getDate();
  if (month < 10) {
    month = "0" + month;
  }
  if (day < 10) {
    day = "0" + day;
  }
  return date.getFullYear() + "-" + month + "-" + day;
}
function getTimeStamp_S() {
  var timestamp = new Date().getTime().toString();
  var timestamp_s = timestamp.substring(1, 10);
  return timestamp_s;
}
function getTimeStamp_MS() {
  var timestamp = new Date().getTime();
  return timestamp;
}
function getdate(date) {
  var now = new Date(date),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return (
    y +
    "-" +
    (m < 10 ? "0" + m : m) +
    "-" +
    (d < 10 ? "0" + d : d) +
    " " +
    now.toTimeString().substr(0, 8)
  );
}

export {
  formatTimestamp,
  getCurrentMonthFirst,
  getCurrentMonthLastDay,
  getTimeStamp_S,
  getTimeStamp_MS,
  getdate,
};
