import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import Apropos from "../../components/Home/apropos";
import Statistics from "../../components/Home/statistics";
import Scrollingimages from "../../components/Home/scrollingimage";


const Home = () => {
    const isDarkMode = false;



    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box sx={{height:'200vh'}}> 
                <Apropos/>
                <Statistics/>
                <Scrollingimages/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Home;
