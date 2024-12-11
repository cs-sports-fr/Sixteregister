import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import Apropos from "../../components/Home/apropos";
import Deroulementjournee from "../../components/Home/deroulementjournee";
const Home = () => {
    const isDarkMode = false;



    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box>
                <Apropos/>
                <Deroulementjournee/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Home;
