import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import "./App.css";
import {
  Grid,
  Typography,
  IconButton,
  Paper,
} from "@material-ui/core";
import { Refresh } from "@material-ui/icons";
import sizeMe from "react-sizeme";
import SelectORP from "./SelectORP";
import LastNumbers from "./LastNumbers";
import FetchError from "./FetchError"
import { logEventToServer } from "./server-log"
import { setData, selectOrp, setError } from "./actions.js"
import { Plot } from "./Plot.js"
import { fetchData } from "./fetch-data.js"

const SizedPlot = sizeMe()(Plot);

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const theEffect = async ()=>{
      console.log("mounting component");
      if (window.clientIdNew){
        logEventToServer(`new-client`)
      }
      logEventToServer(`mounted/${encodeURI(window.location.hash.substring(1))}`)
      try {
        const data = await fetchData();
        dispatch(setData(data))  
      }
      catch (error){
        dispatch(setError(error))
      }  
    }
    theEffect()
  }, []);

  const orpList = useSelector(state=>state.orpList)
  const orpName = useSelector(state=>state.selectedOrpName)
  const error = useSelector(state=>state.error)
  const lastNumbers = useSelector(state=>state.lastNumbers)
  const filteredData = useSelector(state=>state.filteredData)
  const stat = useSelector(state=>state)

  const doSelectOrp = (orpId) => {
    dispatch(selectOrp(orpId)) 
  }


  console.log(`drawing with state:` ,stat);
  return (
      <Grid container direction="column" justify="space-around" style={{padding: '2ex'}}>
        <Grid container direction="column" item alignContent="center"  justify="space-evenly" style={{marginBottom: '1ex', textAlign:'center'}}>  
          <FetchError errorMessage={error}/>
          <Typography variant="h5" >Vývoj Covid-19 na na územích obcí s rozšířenou působností</Typography>
          <Typography variant="subtitle1" >Obec s rozšířenou působností je ta, kde vydávají občanské průkazy a pasy</Typography>
          
        </Grid>
        <Grid item >{/* navigation */ }
          <Paper variant="outlined" >
            <Grid container alignItems="center" justify="space-evenly" alignItems="center">
              <Grid item>
                <Typography variant="h3">{orpName}</Typography>
              </Grid>
              <Grid item>
                <SelectORP
                  orpList={orpList}
                  onChange={(newOrpId) => doSelectOrp(newOrpId) }
                />
              </Grid>
              <Grid item>
                <IconButton onClick={()=>null} title="obnovit data">
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
         <SizedPlot filteredData={filteredData}/>
        </Grid>
        <Grid item style={{textAlign: 'right'}}>
         <Typography variant="caption">Zdroj dat: <a href="https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19">Ministerstvo zdravotnictví ČR</a></Typography>
         <a href="https://github.com/Pacov-City/covid"><img src="/github.png" alt="github link"/></a>
        </Grid>
      </Grid>
  );
}

export default App;
