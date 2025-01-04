import { Box } from "@mui/material";


import PropTypes from 'prop-types';
import NavbarItem from "./NavbarItem";
import PopoverProfile from "./PopoverProfil";

const Navbar = ({ navigation }) => {
    const isDarkMode = true;
    const filteredNavigation = navigation.filter(item => item?.hidden !== true);

    return (
        <>
            <Box
                sx={{
                    width: '94vw', paddingX: '3%', height: '4rem', zIndex: 15, display: 'flex',
                    backgroundColor: 'background.default'
                }}

            >
                <Box sx={{ display: "flex", flexGrow: 1, justifyContent: 'space-between', flexDirection: 'row' }}>
                    <Box sx={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}>
                    <Box>
                        <a href="/">
                        <img
                            src="/images/logo_sixte.png"
                            alt="Logo Toss"
                            width={50}
                            height={50}
                            style={{ display: 'block' }}
                        />
                        </a>
                    </Box>
                        <Box sx={{ display: "flex", flexDirection: 'row', marginLeft: '1rem' }}>
                            {filteredNavigation.map((item, index) => {
                                return <NavbarItem item={item} key={index} />
                            })}

                        </Box>
                    </Box>
                    <Box >
                        <PopoverProfile />
                    </Box>
                </Box>
            </Box>
            {/* <Divider variant="navbar" sx={{ flexGrow: 1, mr: 2, color: 'blue' }} /> */}
        </>
    )
};

Navbar.propTypes = {
    navigation: PropTypes.array.isRequired,
};

export default Navbar