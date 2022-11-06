import moment from "moment";

export function getDateFromTimestamp({ timestamp, format = "MMM Do, YYYY" }) {
  return moment.unix(timestamp).format(format) ?? "";
}

export function formatMomentDate({ date, format = "MMM Do, YYYY" }) {
  return moment(date).format(format);
}

export function formatMoney(value) {
  return parseFloat(value).toFixed(2);
}

export function addTrailingZerosToDollarValue(num = 0) {
  return Number.parseFloat(num).toFixed(2);
}

export const sortBids = (bids) => {
  bids = [...bids]?.sort((a, b) => {
    return parseFloat(b.price) - parseFloat(a.price);
  });
  return bids;
};
export function getYoutubeIDFromURL(url) {
  var ID = "";
  url = url
    .replace(/(>|<)/gi, "")
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (url[2] !== undefined) {
    ID = url[2].split(/[^0-9a-z_\-]/i);
    ID = ID[0];
  } else {
    ID = url;
  }
  return ID;
}

export function isValidHttpUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (err) {
    return false;
  }
}
