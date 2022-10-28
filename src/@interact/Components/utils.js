import moment from "moment";

export function getDateFromTimestamp({ timestamp, format = "MMM Do, YYYY" }) {
  return moment.unix(timestamp).format(format);
}

export function formatMomentDate({ date, format = "MMM Do, YYYY" }) {
  return moment(date).format(format);
}
