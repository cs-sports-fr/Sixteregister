import { Box, Link } from "@mui/material"

import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


const NavbarItem = ({ item }) => {

    const location = useLocation()

    const [active, setActive] = useState(false)

    useEffect(() => {
        if (location.pathname == item.path) {
            setActive(true)
        } else {
            setActive(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])


    return (
        <Box
            sx={{
                marginX: 1,
                position: 'relative',
                height: '4rem',
                display: 'flex',
                alignItems: 'center',
                borderBottom: active ? '3px solid' : '3px solid',
                borderBottomColor: active ? 'primary.main' : 'transparent',
                '&:hover': {
                    borderBottom: '3px solid',
                    borderBottomColor: 'primary.main',
                }
            }}
        >
            <Link
                href={item.path}
                underline="none"
                color="text.primary"
                sx={{
                    verticalAlign: 'center',
                    '&:hover': {
                        color: 'grey.700'
                    }
                }}
            >
                {item.name}
            </Link>
        </Box >
    )
}


NavbarItem.propTypes = {
    item: PropTypes.object.isRequired,
};

export default NavbarItem