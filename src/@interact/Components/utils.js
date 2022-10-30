import moment from "moment";

export function getDateFromTimestamp({
  timestamp,
  format = "MMM Do, YYYY",
}) {
  return moment.unix(timestamp).format(format) ?? "";
}

export function formatMomentDate({ date, format = "MMM Do, YYYY" }) {
  return moment(date).format(format);
}

export function addTrailingZerosToDollarValue(num = 0) {
  return Number.parseFloat(num).toFixed(2);
}
