import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


function SelectORP({orpList,onChange}){
    const [value,setValue] = useState("")
    const doChange = (val)=>{
        if (val!=null){
          const orpId = val.id
          onChange(orpId)  
        }
        setValue(val) 
    }
    //console.log("orpList",orpList)
    if (orpList==null) return null
    return (
        <Autocomplete
          id="select-orp"
          value={value}
          onChange={(ev,newVal)=>{doChange(newVal);}}
          options={orpList}
          getOptionLabel={(option) => option.name || ""  }
          style={{ width: 300, margin: '2ex' }}
          renderInput={(params) => <TextField {...params} label={orpList?"Vyber obec":"...načítám"} variant="outlined" />}
        />
      );
}

export default SelectORP