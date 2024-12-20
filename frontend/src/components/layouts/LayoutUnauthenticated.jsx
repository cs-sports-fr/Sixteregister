import { Box } from "@mui/material";

import PropTypes from 'prop-types';
import NavbarVitrine from "../navbar/NavbarVitrine";
function LayoutUnauthenticated({ isDarkMode, children }) {

    return (
        <Box>
            <NavbarVitrine/>
            {children}
        </Box>

    );
}

LayoutUnauthenticated.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default LayoutUnauthenticated;