import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import Apropos from "../../components/Home/apropos";
import Sixtemen from "../../components/Home/sixtemen";

const Home = () => {
    const isDarkMode = false;



    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box>
                <Apropos/>
                <Sixtemen/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Home;
