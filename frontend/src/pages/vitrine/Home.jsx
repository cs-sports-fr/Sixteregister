import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Fade,Slide } from "@mui/material";
import LayoutUnauthenticated from "../../components/layouts/LayoutUnauthenticated";

const Home = () => {
    const isDarkMode = false;



    return (
        <LayoutUnauthenticated isDarkMode={isDarkMode}>
            <Box>
                <Box sx={{}}>
                    <Typography variant="h1">18 février 2024</Typography>
                    <Typography variant="h1">Le Sixte se déroule a clairefontaine</Typography>
                </Box>
                <Box>
                    <Button>S'Inscrire</Button>
                    <Button>Se connecter</Button>

                </Box>
            </Box>
        </LayoutUnauthenticated>
    );
};

export default Home;
