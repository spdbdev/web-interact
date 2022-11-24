import moment from "moment";
import {Country} from 'country-state-city';

export function getDateFromTimestamp({ timestamp, format = "MMM Do, YYYY" }) {
  return moment.unix(timestamp).format(format) ?? "";
}

export function formatMomentDate({ date, format = "MMM Do, YYYY" }) {
  return moment(date).format(format);
}

export function formatMoney(value) {
  return parseFloat(value).toFixed(2);
}

export function formatDate(value){
  let options = {
    month: "short",
    day: "2-digit",
    hour12 : true,
    hour:  "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }
  let date = new Date(`${value}`).toLocaleDateString("en-US",options);
  return date;
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

export function getUserCountryName(){
    const isoCode = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[1];
    const location = Country.getAllCountries().find((country)=>{
      if(country.isoCode == isoCode){
        return country;
      }
    })
    return location?.name;
}

export const commentPostedTime = (timeInMileSec) => {
  const sec = (timeInMileSec / 1000).toFixed(0);
  const min = (timeInMileSec / (1000 * 60)).toFixed(0);
  const hrs = (timeInMileSec / (1000 * 60 * 60)).toFixed(0);
  const days = (timeInMileSec / (1000 * 60 * 60 * 24)).toFixed(0);
  const weeks = (timeInMileSec / (1000 * 60 * 60 * 24 * 7)).toFixed(0);
  const months = (timeInMileSec / (1000 * 60 * 60 * 24 * 31)).toFixed(0);
  const years = (timeInMileSec / (1000 * 60 * 60 * 24 * 12)).toFixed(0);
  if (sec < 60) {
    return "Just now";
  } else if (min < 60) {
    return min + (min < 2 ? " min " : " mins ") + "ago";
  } else if (hrs < 24) {
    return hrs + (hrs < 2 ? " hr " : " hrs " ) + "ago";
  } else if (days < 7) {
    return days + (days < 2 ? " day " : " days ") + "ago";
  } else if (weeks < 4) {
    return weeks + (weeks < 2 ? " week " : " weeks ") + "ago";
  } else if (months < 12) {
    return months + (months < 2 ? " month " : " months ") + "ago";
  } else {
    return years + (years < 2 ? " year " : " years ") + "ago";
  }
};