import { logEventToServer } from "./server-log.js";
import { Parser } from "papaparse";


export const fetchData = async () => {
  console.log("fetching data");
  const fetchStartTime = new Date().getTime();
  let resp = null;
  let respError = null;
  if (window.location.hostname === "localhost") {
    resp = await fetch("/orp.csv");
  } else {
    resp = await fetch(
      'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/orp.csv'
      //"https://onemocneni-aktualne.mzcr.cz/api/account/verejne-distribuovana-data/file/dip%252Fweb_orp.csv"
    );
  }

  if (resp == null) {
    logEventToServer("fetch-data-failed");
    throw new Error("Nepodařilo se získat odpověď");
  } else if (resp.status != 200) {
    logEventToServer("fetch-data-failed");
    throw new Error(
      `Chyba při stahování dat ${resp.status} ${resp.statusText}`
    );
  }

  const dataText = await resp.text();
  const data = new Parser({
    delimiter: ";",
    newline: "\r\n",
    header: true,
  }).parse(dataText);
  console.log("data fetched");
  const fetchEndTime = new Date().getTime()
  logEventToServer(`fetch-finished/${fetchEndTime - fetchStartTime}`);
  return data;
};
