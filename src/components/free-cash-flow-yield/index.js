import React, { useState } from "react";
import Box from "../containers/box";
import FreeCashFlowChart from "./FreeCashFlowChart";
const freeCashflowData = [
  { group: "Q1", percent: 10, ratio: 14.22 },
  { group: "Q2", percent: 12, ratio: 14.22 },
  { group: "Q3", percent: 17.5, ratio: 14.22 },
  { group: "Q4", percent: 7, ratio: 14.22 },
];

const freeCashflowGroupNames = [
  "Free Cash Flow Yield",
  "Cash Per Share",
  // "Enterprise Value To FCF Ratio",
];

const FreeCashFlowYield = () => {
  const [year] = useState(2022);
  return (
    <Box>
      <h1>Cash Per Share</h1>
      <FreeCashFlowChart
        data={freeCashflowData}
        subGroupNames={freeCashflowGroupNames}
        year={year}
      />
    </Box>
  );
};

export default FreeCashFlowYield;
