import { getCurrentDate } from "./getCurrentDate";

function formatDates(date) {
  const actual_date = date.split("T");
  const formated_date =
    actual_date[0][8] +
    actual_date[0][9] +
    "-" +
    actual_date[0][5] +
    actual_date[0][6] +
    "-" +
    actual_date[0][0] +
    actual_date[0][1] +
    actual_date[0][2] +
    actual_date[0][3] +
    " " +
    actual_date[1];

  return formated_date;
}

function getYearFromDate(date) {
  const temp = date.split("-");
  const year = temp[2][0] + temp[2][1] + temp[2][2] + temp[2][3];
  return year;
}

function getMonthFromDate(date) {
  const temp = date.split("-");
  const month = temp[1];

  return month;
}

function getDayFromDate(date) {
  const temp = date.split("-");
  const day = temp[0];

  return day;
}

function getHoursFromDate(date) {
  const temp = date.split(" ");
  const hours = temp[1][0] + temp[1][1];

  return hours;
}

function getMinsFromDate(date) {
  const temp = date.split(" ");
  const mins = temp[1][3] + temp[1][4];

  return mins;
}

function getSecsFromDate(date) {
  const temp = date.split(" ");
  const secs = temp[1][6] + temp[1][7];

  return secs;
}

function dateToSecs(date) {
  const year = getYearFromDate(date);
  const month = getMonthFromDate(date);
  const day = getDayFromDate(date);
  const hours = getHoursFromDate(date);
  const mins = getMinsFromDate(date);
  const secs = getSecsFromDate(date);

  const total =
    31556926 * year +
    2629743.83 * month +
    86400 * day +
    3600 * hours +
    60 * mins +
    secs;

  return total;
}

function secsLeft(date) {
  // an exei ksekinisei the prepei i diafora date - today na einai arnitiki
  const temp = getCurrentDate();
  const today = formatDates(temp);

  const todayInSecs = dateToSecs(today);
  const dateInSec = dateToSecs(date);

  const diff = dateInSec - todayInSecs;

  return diff;
}

export { formatDates,secsLeft };
