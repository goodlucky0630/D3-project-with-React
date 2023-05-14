const Box = ({
  title = "AAPL",
  desc = "Apple Computer, Inc",
  children,
  width = 325,
  height = 343,
  borderSize = 3,
  icon,
  scrollable = false,
}) => {
  // const innerWidth = width - 2 * borderSize;
  // const innerHeight = height - 2 * borderSize;
  const chartContainerStyles = `flex-1 flex flex-col items-center h-[536px] bg-black relative overflow-hidden`;
  return (
    <div
      className={`flex flex-col overflow-hidden border-[3px] border-[#4D4D4D] rounded-xl bg-black text-white antialiased`}
      style={{ width, height }}
      // style={{ width: innerWidth, height: innerHeight }}
    >
      <div className="flex flex-col bg-[#404040] leading-[19px] pt-[6.5px] items-left px-2.5 h-[53px] text-[17px] whitespace-pre">
        <span>{title}</span>
        <span>{desc}</span>
        {icon && <svg width="25" height="25" viewBox="0 0 25 25" />}
      </div>
      <div className={chartContainerStyles}>{children}</div>
      <div className="relative">
        {scrollable ? (
          <div className="h-[25px] bg-[#1B1A1A]">
            <svg height="13" width="13">
              <circle cx="13" cy="13" r="6" fill="#595959" />
            </svg>
          </div>
        ) : (
          <div className="absolute h-[25px] bottom-0">
            <svg height="13" width="13">
              <circle cx="13" cy="13" r="6" fill="#595959" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default Box;
