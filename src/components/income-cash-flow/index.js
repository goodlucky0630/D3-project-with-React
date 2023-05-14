import React, { useState, useEffect } from "react";
import Box from "../containers/box";
import CashFlowPlot from "./CashFlowPlot";

const quarterlyCashflowData = [
  {
    group: "Q1",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": -1.6,
  },
  {
    group: "Q2",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": 1.6,
  },
  {
    group: "Q3",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": 1.6,
  },
  {
    group: "Q4",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": 1.6,
  },
];
const annualCashflowData = [
  {
    group: "2019",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": -1.6,
  },
  {
    group: "2020",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": 1.6,
  },
  {
    group: "2021",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": 1.6,
  },
  {
    group: "2022",
    "Operating Income": 4.1,
    "Operating Expenses": 7,
    "Free Cash Flow": 1.6,
  },
];

const IncomeCashFlow = () => {
  const [annual, setAnnual] = useState(false);
  const [cashData, setCashData] = useState(null);
  const [year, setYear] = useState(2022);

  useEffect(() => {
    if (annual) {
      setCashData(annualCashflowData);
    } else {
      setCashData(quarterlyCashflowData);
      setYear(2022);
    }
  }, [annual]);

  return (
    <Box>
      <h1>Income & Cash Flow</h1>
      <CashFlowPlot
        data={cashData}
        year={year}
        annual={annual}
        onChangeAnnual={setAnnual}
      />
    </Box>
  );
};

export default IncomeCashFlow;
