import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";
import Apropos from "../../components/Home/apropos";
import Deroulementjournee from "../../components/Home/deroulementjournee";
import Sixtemen from "../../components/Home/sixtemen";
import Statistics from "../../components/Home/statistics";
import Scrollingimages from "../../components/Home/scrollingimage";
import Video from "../../components/Home/video";
import Footer from "../../components/footer/footer";
import IconsInscription from "../../components/Home/iconsinscription";
const Home = () => {
    const isDarkMode = false;



    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box sx={{height:'200vh'}}> 
                <Scrollingimages/>
                <Apropos/>
                <IconsInscription/>
                <Deroulementjournee/>
                <Statistics/>
                <Sixtemen/>
                <Video/>
                <Footer/>

            </Box>
        </LayoutUnauthenticated>
    );
};

export default Home;
