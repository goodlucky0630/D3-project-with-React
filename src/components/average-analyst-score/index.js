import React from "react";
import AnalystScoreScale from "./AnalystScoreScale";
import Recommendations from "./Recommendations";
import Box from "../containers/box";
import "./index.css";

const recommendData = [
  {
    label: "Strong Buy",
    value: 34,
  },
  {
    label: "Moderate Buy",
    value: 23,
  },
  {
    label: "Hold",
    value: 5,
  },
  {
    label: "Moderate Sell",
    value: 7,
  },
  {
    label: "Strong Sell",
    value: 5,
  },
];

const AverageAnalystScore = () => {
  return (
    <Box>
      <h1>Average Analyst Score</h1>
      <AnalystScoreScale value={1.8} />
      <h6 className="text-[15px] text-center h-[22px]">
        Underlying Recommendations
      </h6>
      <Recommendations data={recommendData} />
    </Box>
  );
};

export default AverageAnalystScore;
