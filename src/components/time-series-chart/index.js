import React, { useState, useEffect } from "react";
import Box from "../containers/box";
import Timeseries from "./Timeseries";
import GrowthChart from "./GrowthChart";
import { mockAPI, Stocks } from "../../data/mock-data";

const MODES = [
  {label: "1D", value: "1 Day"},
  {label: "5D", value: "5 Day"},
  {label: "1M", value: "1 Month"},
  {label: "6M", value: "6 Month"},
  {label: "1Y", value: "1 Year"},
  {label: "5Y", value: "5 Year"},
  {label: "MAX", value: "10 years"},
];

const currency = "$";
const PINS = Stocks.find((s) => s.symbol === "PINS");
const getSign = (num) => (num > 0 ? "+" : num < 0 ? "-" :"");

const TimeSeriesChart = () => {
  const [mode, setMode] = useState(MODES[0]);
  const [data, setData] = useState([]);
  const [stock] = useState(PINS);

  const value0 = data && data[0]?.price;
  const value1 = data && data[data.length - 1]?.price;
  const dv = parseFloat(value1 - value0);
  const pro = parseFloat((dv / value0) * 100);

  useEffect(() => {
    setData(mockAPI(mode.label));
  },[mode]);

  return (
    <Box title={stock.symbol} desc={stock.description}>
      <div className="text-lg text-[#595959] pl-2 pt-[8px] pb-[12px] pr-[8px] w-full">
        <div className="flex justify-between max-w-xs">
          {MODES.map((m, i) => (
            <div
              key={m.label}
              className={`rounded px-1.5 leading-[1.5rem] text-[18px] ${
                m.label === mode.label
                  ? "bg-neutral-700 text-white"
                  : "hover:bg-neutral-700 cursor-pointer"
              }`}
              onClick={() => setMode(m)}
            >
              {m.label}
            </div>
          ))}
        </div>
        <div className="text-lg h-7">
          {data?.length > 0 && (
            <>
              <span className="text-white">{stock.symbol}</span>{" "}
              <span className="text-[#00C25A]">
                {dv && `${getSign(dv)}${currency}${Math.abs(dv).toFixed(2)}`} ({pro?.toFixed(2)}%)
              </span>
              <span className="text-[#00C25A]"> {mode.value}</span>
            </>
          )}
        </div>
        <Timeseries data={data || []} mode={mode.label} />
        <GrowthChart
          current={4567.678}
          average={1122.234}
        />
      </div>
    </Box>
  );
};

export default TimeSeriesChart;
