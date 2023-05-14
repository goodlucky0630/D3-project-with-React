import Box from "../containers/box";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import "../../assets/css/scroll-bar.css";

const posts = [
  {
    date: "Oct-28-22",
    company: "Motley Fool",
    title: "Apple Provides Further Proof of Dominance in the Business World",
  },
  {
    date: "Oct-28-22",
    company: "Financial Times",
    title: "Apple/China: intricate supply chain makes hanging up hard to do",
  },
  {
    date: "Oct-28-22",
    company: "Reuters",
    title: "US STOCKS-Wall St drops as focus shifts to Fed rate decision",
  },
  {
    date: "Oct-28-22",
    company: "The Wall Street Journal",
    title:
      "Foxconn to Shift Some iPhone Production From Covid-Hit Plant to Other Sites",
  },
  {
    date: "Oct-28-22",
    company: "Motley Fool_silver",
    title: "Apple Provides Further Proof of Dominance in the Business World",
  },
  {
    date: "Oct-28-22",
    company: "Financial Times_silver",
    title: "Apple/China: intricate supply chain makes hanging up hard to do",
  },
  {
    date: "Oct-28-22",
    company: "Reuters_silver",
    title: "US STOCKS-Wall St drops as focus shifts to Fed rate decision",
  },
  {
    date: "Oct-28-22",
    company: "The Wall Street Journal _ silver",
    title:
      "Foxconn to Shift Some iPhone Production From Covid-Hit Plant to Other Sites",
  },
  {
    date: "Oct-28-22",
    company: "Financial Times_silver",
    title: "Apple/China: intricate supply chain makes hanging up hard to do",
  },
  {
    date: "Oct-28-22",
    company: "Reuters_silver",
    title: "US STOCKS-Wall St drops as focus shifts to Fed rate decision",
  },
  {
    date: "Oct-28-22",
    company: "The Wall Street Journal _ silver",
    title:
      "Foxconn to Shift Some iPhone Production From Covid-Hit Plant to Other Sites",
  },
];

const NewsFeed = () => {
  return (
    <Box scrollable>
      <div className="h-full w-full">
        <PerfectScrollbar
          options={{
            suppressScrollX: true,
            wheelPropagation: false,
            swipeEasing: true,
          }}
        >
          <div className="flex-col space-y-[5px] pl-2 pb-[8px] pr-[8px] pt-2">
            <div>
              {posts.map((post, idx) => (
                <div className="mb-[11px] text-[17px]" key={`news-${idx}`}>
                  <p className="text-[#595959] leading-[19px]">
                    {post.date + " "}
                    <span style={{ color: "#DC6A00" }}>{post.company}</span>
                  </p>
                  <p className="text-white leading-[19px]">{post.title}</p>
                </div>
              ))}
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </Box>
  );
};

export default NewsFeed;
