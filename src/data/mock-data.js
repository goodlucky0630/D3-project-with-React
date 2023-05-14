import nasdaq_screener from "./nasdaq_screener_1668627001573";
import general_data from "./general_data";

const LEN = {
  "1D": -8,
  "5D": -11,
  "1M": -22,
  "6M": -48,
  "1Y": -172,
  "5Y": -1110,
  'MAX': -1288,
};

export const mockAPI = (mode) => {
  return general_data.slice(LEN[mode]);
};

export const Stocks = [
  {
    symbol: "PINS",
    description: "Pinterest. Inc",
  },
  {
    symbol: "ZIM",
    description: "ZIM Integrated ",
    noticed: true,
  },
  {
    symbol: "ACNG",
    description: "ACNB Corporation",
    noticed: true,
  },
  {
    symbol: "GNK",
    description: "Genco Shipping ",
    noticed: true,
  },
  {
    symbol: "ACI",
    description: "Albertsons Company",
    noticed: true,
  },
  {
    symbol: "GNK",
    description: "Genco Shipping",
  },
  {
    symbol: "ACTDU",
    description: "ArcLight Clean Tech",
  },
  {
    symbol: "AA",
    description: "Alcola Corporation",
  },
  {
    symbol: "AAP",
    description: "Advanced Autop",
  },
  {
    symbol: "AATC",
    description: "Autoscope Tech",
  },
];

export const csvFileToArray = (str) => {
  var array = str.toString().split("\n");
  //  console.log(array); here we are getting the first rows which is our header rows to convert it into keys we are logging it here
  var data = [];
  // console.log(data);
  for (const r of array) {
    // console.log(r);
    let row = r.toString().split(",");
    data.push(row);
  }
  var heading = data[0];
  // console.log(heading); to get the column headers which will act as key
  var ans_array = [];
  // console.log(ans_array);
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < heading.length; j++) {
      if (!row[j]) {
        row[j] = "NA";
      }
      // console.log(row[j].toString())
      obj[heading[j].replaceAll(" ", "_")] = row[j]
        .toString()
        .replaceAll(" ", "_");
    }
    ans_array.push(obj);
  }
  return ans_array;
};

export const getStockSymbols = () => {
  debugger;
  const nasdaqData = csvFileToArray(nasdaq_screener);
  const len = Math.floor(Math.random() * 40 + 12);
  const gap = Math.floor(nasdaqData.length / (len + 1));

  const arr = [];
  for (let i = 0; i < len; i++) {
    const idx = 1 + i * gap;
    if (idx >= nasdaqData.length) {
      break;
    }

    const obj = {
      Symbol: nasdaqData[idx].Symbol,
      Name: nasdaqData[idx].Name,
    };
    arr.push(obj);
  }

  return arr;
};
