import { useEffect } from "react";
import Slider from "./components/slider";
import RevenueChart from "./components/revenue-chart";
import TimeSeriesChart from "./components/time-series-chart";
import AverageAnalystScore from "./components/average-analyst-score";
import IncomeCashFlow from "./components/income-cash-flow";
import FreeCashFlowYield from "./components/free-cash-flow-yield";
import NewsFeed from "./components/news-feed";
import AnalystPriceTarget from "./components/analyst-price-target";
import GeneralInformation from "./components/general-information";
import PNGImageContainer from "./components/png-image-container";

function App() {
  console.log("Finance Widget App render", new Date());

  useEffect(() => {
    document.title = "Finance Widgets";
  }, []);

  return (
    <div className="mt-[14px] flex flex-wrap gap-4">
      
      {/* Analyst Price Target */}
      <Slider />
      <AverageAnalystScore />
      <RevenueChart />
      <FreeCashFlowYield />
      <IncomeCashFlow />
      <TimeSeriesChart />
      <NewsFeed />
      <AnalystPriceTarget />
      <GeneralInformation />
      <GeneralInformation
        title="SPY"
        desc="SPDR S&P 500 ETF Trust"
        type="spy"
      />
      <PNGImageContainer />
    </div>
  );
}

export default App;
