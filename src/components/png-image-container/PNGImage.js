import React from "react";
import Box from "../containers/box";

const PNGImage = ({ src }) => {
  return (
    <Box title="Some text" desc="Some text" height={341} scrollable>
      <img src={src} alt="PNG" />
    </Box>
  );
};

export default PNGImage;
