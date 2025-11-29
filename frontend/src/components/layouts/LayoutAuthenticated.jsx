import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function LayoutAuthenticated({ isDarkMode, children }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ height: '100vh' }}>
            <Box 
                sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: 16, 
                    zIndex: 20,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
                onClick={() => navigate('/')}
            >
                <img
                    src={isDarkMode ? "/images/logo_sixte25.PNG" : "/images/logo_sixte25.PNG"}
                    alt="Logo Sixte 2025"
                    width={90}
                    height={110}
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