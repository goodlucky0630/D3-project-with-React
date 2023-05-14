import React, { useState, useEffect } from "react";
import RevenueEarningPlot from "./RevenueEarningPlot";
import Box from "../containers/box";

const quarterlyRevenueEarning = [
  { group: "Q1", Revenue: "11.3", Earnings: "-1.6" },
  { group: "Q2", Revenue: "11.3", Earnings: "3.7" },
  { group: "Q3", Revenue: "11.3", Earnings: "5.9" },
  { group: "Q4", Revenue: "11.3", Earnings: "1.35" },
];

const annualRevenueEarning = [
  { group: "2019", Revenue: "11.3", Earnings: "-1.6" },
  { group: "2020", Revenue: "11.3", Earnings: "3.7" },
  { group: "2021", Revenue: "11.3", Earnings: "5.9" },
  { group: "2022", Revenue: "11.3", Earnings: "1.35" },
];

const RevenueChart = () => {
  const [annual, setAnnual] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [year] = useState("2022");

  useEffect(() => {
    if (annual) setRevenueData(annualRevenueEarning);
    else setRevenueData(quarterlyRevenueEarning);
  }, [annual]);

  return (
    <Box title="AAPL" desc="Apple Computer, Inc">
      <h1>Revenue And Earnings</h1>
      <RevenueEarningPlot
        title="Revenue And Earnings"
        year={year}
        data={revenueData}
        annual={annual}
        onChangeAnnual={setAnnual}
      />
    </Box>
  );
};

export default RevenueChart;
