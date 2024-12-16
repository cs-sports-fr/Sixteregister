import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import ComponentsOverrides from "./overrides";

const theme = createTheme({
    palette: palette,
    typography: {
        fontFamily: [
            'Rubik', // Use Rubik font
            'sans-serif' // Fallback to sans-serif in case Rubik is not available
        ].join(',')
    }
});

theme.components = ComponentsOverrides(theme);

export default theme;
