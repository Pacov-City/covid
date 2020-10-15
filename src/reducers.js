import {SET_DATA, SELECT_ORP, SET_ERROR} from './actions.js'
import { DATUM_IDX, HOSPIT_IDX, PREVALENCE_IDX, ORP_ID_IDX, ORP_NAME_IDX } from "./data-format.js"


const initialState = {
    data: null,
    orpList: null,
    orpMap: null,
    filteredData: null,
    selectedOrpId: null,
    selectedOrpName: null,
    lastNumbers: null,
    error: null,
}

export function covidOrp(state=initialState, action){
    switch (action.type){
        case SET_DATA: return {
            data: action.data,
            ...computeOrpListAndMap(action.data),
            filteredData: null,
            selectedOrp: null,
            lastNumbers: null
        };break;
        case SELECT_ORP: return {
            ...state,
            ...processOrpSelection(state,action.orpId)
        };break;
        case SET_ERROR: return {
            ...state,
            error: action.error
        }
        default: return state;
    }
}

function computeOrpListAndMap(data){
    if (!(data && data.data)) return null; //do nothing when no data
    const orpMap = {};
    data.data.forEach((row, i) => {
      if (i == 0) return; //skip header
      const orpName = row[ORP_NAME_IDX]
      const orpId = row[ORP_ID_IDX]
      if (!orpMap[orpId]) {
        orpMap[orpId] = {
            name: orpName,
            data: []
        }
      }
      orpMap[orpId].data.push(i)
    })
    return {
        orpList: Object.keys(orpMap)
                       .map((orpId)=>{ return {id:orpId, name:orpMap[orpId].name} })
                       .filter( el=> el&&el.id&&el.name )
                       .sort((a,b)=>(''+a.name).localeCompare(b.name)),
        orpMap: orpMap
    }
}

function processOrpSelection(state,orpId){
    const filteredData =  state.data.data.filter(
        (el) => el[ORP_ID_IDX] === orpId
    );

    const lastEntry = filteredData[filteredData.length - 1];
    let lastNumbers = null
    if (lastEntry) {
      lastNumbers = {
        datum: lastEntry[DATUM_IDX],
        pozitivnich: lastEntry[PREVALENCE_IDX],
        hospitalizovanych: lastEntry[HOSPIT_IDX],
      }
    }

    return {
        filteredData: filteredData,
        selectedOrpId:orpId,
        selectedOrpName: state.orpMap[orpId].name,
        lastNumbers: lastNumbers,
    }
}

