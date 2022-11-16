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
