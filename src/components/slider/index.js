import React from "react";
import GeneralSlider from "./GeneralSlider";
import Box from "../containers/box";
import PerfectScrollbar from "react-perfect-scrollbar";
import "../../assets/css/scroll-bar.css";

const Slider = () => {
  return (
    <Box title="AAPL" desc="Apple Computer, Inc" scrollable>
      <div className="w-full h-full">
        <PerfectScrollbar
          options={{
            suppressScrollX: true,
            wheelPropagation: false,
            swipeEasing: true,
          }}
          className="pt-[10px]"
        >
          <GeneralSlider title="Relitive Strength Index" average={0.77} />
          <GeneralSlider title="Aroon Oscalator" average={0.65} />
          <GeneralSlider title="Stochastic Oselator" average={0.43} />
          <GeneralSlider title="Williams %R" average={0.18} />
          <GeneralSlider title="Average Directional Index" average={0.18} />
        </PerfectScrollbar>
      </div>
    </Box>
  );
};

export default Slider;
