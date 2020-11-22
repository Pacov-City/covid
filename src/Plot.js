import React, { useEffect } from "react";
import {
  FlexibleWidthXYPlot,
  VerticalGridLines,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineSeries,
} from "react-vis";

import { DATUM_IDX, HOSPIT_IDX, PREVALENCE_IDX } from "./data-format.js";

const formatDataForPlot = (data, dataIndex) => {
  const ret = data.map((el, i) => {
    //console.log("data", el[DATUM_IDX], el[dataIndex])
    return {
      x: String(el[DATUM_IDX]),
      y: Number.parseFloat(el[dataIndex]) || 0,
    };
  });
  return ret;
};

export const Plot = ({ filteredData, size }) => {
  console.log("size ", size);
  const tickValues = [];
  let lastMonth = "";

  if (!filteredData) return null
    
  filteredData.forEach((el,idx) => {
    if ( el && el[DATUM_IDX]){
      const month = el[DATUM_IDX].substring(5, 7);
      if (month !== lastMonth) {
        tickValues.push(el[DATUM_IDX]);
        lastMonth = month;
      }  
    } else {
      console.log("empty el", idx)
    }
  });
  return (
    <FlexibleWidthXYPlot
      height={600}
      xType="ordinal"
    >
      <VerticalGridLines />
      <HorizontalGridLines />
      <YAxis title="počet" />
      <XAxis title="datum" tickValues={tickValues} />
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
