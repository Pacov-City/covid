import React, { useEffect, useState } from 'react'
import { Typography } from '@material-ui/core';


function LastNumbers({data}){
    if (!data) return null
    return (
        <Typography  style={{textAlign:'center', marginTop: '1ex',marginBottom: '1ex'}}>
            Poslední údaje z: {data.datum} | Pozitivní: {data.pozitivnich||0} | <span style={{color:'red'}}>Hospitalizovaní: {data.hospitalizovanych||0}</span>
        </Typography>
      );
}

export default LastNumbers