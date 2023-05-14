import Box from "../containers/box";
import "react-perfect-scrollbar/dist/css/styles.css";
import "../../assets/css/scroll-bar.css";

const postsAAPL = [
  {
    field: "Market Cap",
    value: "222.22B",
  },
  {
    field: "Exchange",
    value: "NYSE",
  },
  {
    field: "Sector",
    value: "Technology",
  },
  {
    field: "Industry",
    value: "Consumer Electornics",
  },
  {
    field: "Number of Employees",
    value: "126,000",
  },
  {
    field: "Next Earnings Date",
    value: "July 10",
  },
  {
    field: "Annual Dividend",
    value: "1.22%",
  },
  {
    field: "Country",
    value: "United States",
  },
  {
    field: "Website",
    value: "Link",
  },
];

const postsSpy = [
  {
    field: "Issuer",
    value: "SPDR",
  },
  {
    field: "Expense Ratio",
    value: ".65",
  },
  {
    field: "Inspection Date",
    value: "Dec 1, 2009",
  },
  {
    field: "AUM",
    value: "1,000,000",
  },
  {
    field: "Sector",
    value: "Technology",
  },
  {
    field: "Country",
    value: "United States",
  },
  {
    field: "Website",
    value: "Link",
  },
];

const getPosts = (type) => {
  switch (type) {
    case "spy":
      return postsSpy;
    case "aapl":
    default:
      return postsAAPL;
  }
};

const ScrollView = (childView) => {
  return <div>{childView}</div>;
};

const GeneralInformation = ({ title, desc, type = "aapl" }) => {
  const posts = getPosts(type);
  const MAX_POSTS_FOR_PAGE = 10;

  const mainComponent = (
    <div className="flex-col space-y-[5px] pl-2 pb-[8px] pr-2">
      <div>
        {posts.map((post, idx) => (
          <div
            className="mb-[4px] text-[17px] leading-[19px] flex justify-between"
            key={`info-${idx}`}
          >
            <span>{post.field}</span>
            <span className="text-[#868BFF]">{post.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const scrollable = posts.length > MAX_POSTS_FOR_PAGE;

  return (
    <Box title={title} desc={desc}>
      <div className="h-[87%] w-full">
        <h1>General Information</h1>
        {scrollable ? ScrollView(mainComponent) : mainComponent}
      </div>
    </Box>
  );
};

export default GeneralInformation;
