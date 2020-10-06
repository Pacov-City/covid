import React, { useEffect, useState } from "react";
import { Parser } from "papaparse";
import "./App.css";
import {
  Button,
  Container,
  TextField,
  Grid,
  Row,
  Typography,
  IconButton,
  Paper,
} from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import {
  XYPlot,
  FlexibleWidthXYPlot,
  VerticalBarSeries,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  LineSeriesCanvas,
  DiscreteColorLegend,
} from "react-vis";
import sizeMe from "react-sizeme";
import SelectORP from "./SelectORP";
import LastNumbers from "./LastNumbers";
import FetchError from "./FetchError"

const ORP_NAME_IDX = 3;
const DATUM_IDX = 1;
const PREVALENCE_IDX = 7;
const INCIDENCE_IDX = 4;
const HOSPIT_IDX = 10;

const logEventToServer = (event) => {
  console.log(`logging to server`)
  fetch(`/log-event/${window.clientId?window.clientId:"id-not-found"}/${event}`)
  .then((res)=>{
    console.log("logged ...")
  })
  .catch((err) => {
      console.error("failed to log event ${event}")
  })
}


const formatDataForPlot = (data, dataIndex) => {
  const ret = data.map((el, i) => {
    return {
      x: String(el[DATUM_IDX]),
      y: Number.parseFloat(el[dataIndex]) || 0,
    };
  });
  return ret;
};

const Plot = ({ filteredData, onNearestX, size }) => {
  console.log("size ", size);
  const tickValues=[]
  let lastMonth=""
  filteredData.forEach((el)=>{
    const month=el[DATUM_IDX].substring(5,7)
    if (month!==lastMonth){
      tickValues.push(el[DATUM_IDX])
      lastMonth=month
    }
  })
  return (
    <FlexibleWidthXYPlot
      height={600}
      xType="ordinal"
      onNearestX={(value, info) => console.log(value, info)}
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <YAxis title="počet"/>
      <XAxis title="datum" tickValues={tickValues}/>
      <LineSeries
        data={formatDataForPlot(filteredData, HOSPIT_IDX)}
        color="red"
      />
      <LineSeries
        data={formatDataForPlot(filteredData, PREVALENCE_IDX)}
        color="black"
      />
    </FlexibleWidthXYPlot>
  );
};

const SizedPlot = sizeMe()(Plot);

function App({ initialOrpName }) {
  const [data, setData] = useState(null);
  const [orpMap, setOrpMap] = useState({});
  const [orpList, setOrpList] = useState([]);
  const [activeOrp, setActiveOrp] = useState(
    initialOrpName ? initialOrpName : ""
  );
  const [filteredData, setFilteredData] = useState([]);
  const [lastNumbers, setLastNumbers] = useState(null);
  const [fetchError,setFetchError]= useState(null);

  useEffect(() => {
    console.log("mounting ccomponent");
    logEventToServer(`mounted/${encodeURI(window.location.hash.substring(1))}`)
    fetchData();
  }, []);

  const orpListFromData = (data) => {
    if (!(data && data.data)) return; //do nothing when no data
    const orpMap = {};
    data.data.forEach((row, i) => {
      if (i == 0) return; //skip header
      const orpName = row[ORP_NAME_IDX];
      if (!orpMap[orpName]) {
        orpMap[orpName] = [];
      }
      orpMap[orpName].push(i);
    });
    setOrpMap(orpMap);
    setOrpList(Object.keys(orpMap).sort());
  };

  const fetchData = async () => {
    console.log("fetching data");
    setFetchError("")
    let resp=null;
    let respError = null;
    try {
      if (window.location.hostname === "localhost") {
        resp = await fetch("/orp.csv");
      } else {
        resp = await fetch(
          "https://onemocneni-aktualne.mzcr.cz/api/account/verejne-distribuovana-data/file/dip%252Fweb_orp.csv"
        );
      }  
    } catch (error){
      respError=error
    }

    let fetchError = false
    if ( resp==null || respError!=null ) {
      console.error("exception:", respError)
      fetchError=true
    } else if ( resp.status!=200 ){
      console.error(`Chyba při stahování dat ${resp.status} ${resp.statusText}`)
      fetchError=true
    }
    if (fetchError){
      logEventToServer('fetch-data-failed')
      setFetchError(`Chyba při stahování dat`)
      return
    }

    const dataText = await resp.text();
    const data = new Parser({
      delimiter: ";",
      newline: "\r\n",
      header: true,
    }).parse(dataText);
    console.log("data fetched");
    orpListFromData(data);
    console.log("orp list from data");
    setData(data);
    console.log("data set");
    if (activeOrp) {
      doChangeOrp(activeOrp, data);
    }
  };

  const doRefresh = () => {
    setData(null);
    fetchData();
  };

  const doChangeOrp = (newOrpName, data) => {
    console.log(`changing orp ${newOrpName}`);
    logEventToServer(`change-orp/${encodeURI(newOrpName)}`)
    setActiveOrp(newOrpName);
    if (newOrpName) window.location.hash = newOrpName;
    if (data && data.data) {
      console.log("setting filtered data");
      const filtered = data.data.filter(
        (el) => el[ORP_NAME_IDX] === newOrpName
      );
      setFilteredData(filtered);
      const lastEntry = filtered[filtered.length - 1];
      if (lastEntry) {
        setLastNumbers({
          datum: lastEntry[DATUM_IDX],
          pozitivnich: lastEntry[INCIDENCE_IDX],
          hospitalizovanych: lastEntry[HOSPIT_IDX],
        });
      } else {
        setLastNumbers(null);
      }
    }
  };

  const onNearestX = (value, { event, innerX, index }) => {
    console.log(value, innerX, index);
  };

  console.log(`drawing with orp ${activeOrp}`);
  return (
      <Grid container direction="column" justify="space-around" style={{padding: '2ex'}}>
        <Grid container direction="column" item alignContent="center"  justify="space-evenly" style={{marginBottom: '1ex', textAlign:'center'}}>  
          <FetchError errorMessage={fetchError}/>
          <Typography variant="h5" >Vývoj Covid-19 na na územích obcí s rozšířenou působností</Typography>
          <Typography variant="subtitle1" >Obec s rozšířenou působností je ta, kde vydávají občanské průkazy a pasy</Typography>
          
        </Grid>
        <Grid item >{/* navigation */ }
          <Paper variant="outlined" >
            <Grid container alignItems="center" justify="space-evenly" alignItems="center">
              <Grid item>
                <Typography variant="h3">{activeOrp}</Typography>
              </Grid>
              <Grid item>
                <SelectORP
                  orpList={orpList}
                  onChange={(newOrp) => doChangeOrp(newOrp, data)}
                />
              </Grid>
              <Grid item>
                <IconButton onClick={doRefresh} title="obnovit data">
                  <Refresh />
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <LastNumbers data={lastNumbers} />
        </Grid>
        <Grid item >
         <SizedPlot filteredData={filteredData} onNearestX={onNearestX} />
        </Grid>
        <Grid item style={{textAlign: 'right'}}>
         <Typography variant="caption">Zdroj dat: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19">Ministerstvo zdravotnictví ČR</a></Typography>
         <a href="https://github.com/Pacov-City/covid"><img src="/github.png" alt="github link"/></a>
        </Grid>
      </Grid>
  );
}

export default App;
