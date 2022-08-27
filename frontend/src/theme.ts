import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Manrope, sans-serif",
    body: "Manrope, sans-serif",
  },
  fontWeights: {
    medium: 700,
    bold: 800,
  },
});

export default theme;
