import { Box } from "@mui/material";

import PropTypes from 'prop-types';

function LayoutAuthenticated({ isDarkMode, children }) {

    return (
        <Box sx={{ height: '100vh' }}>
            <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 20 }}>
                <img
                    src={isDarkMode ? "/images/logo_sixte.png" : "/images/logo_sixte.png"}
                    alt="Logo Toss"
                    width={50}
                    height={50}
                />
            </Box>
            {children}
        </Box>

    );
}

LayoutAuthenticated.propTypes = {
    isDarkMode: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
};

export default LayoutAuthenticated;