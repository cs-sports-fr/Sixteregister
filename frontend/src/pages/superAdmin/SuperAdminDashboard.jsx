import { Box, Grid } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { routesForSuperAdmin } from "../../routes/routes";
import AdminStatisticsCard from "../../components/dashboard/AdminStatisticsCard";
import DataCard from "../../components/dashboard/DataCard";

function SuperAdminDashboard() {

    return (
        <Box display={'flex'} flexDirection={'column'} height={'100vh'} sx={{ overflowX: 'hidden', bgcolor: 'background.drawer' }}>
            <Navbar navigation={routesForSuperAdmin} />
            <Box sx={{ display: 'flex', bgcolor: 'background.drawer' }}>
                <Grid container spacing={0} sx={{ mx: 8, my: 4 }}>
                    <Grid item xs={12} md={4} sx={{ p: 2, bgcolor: 'background.drawer' }}>
                        <DataCard title='Nombre de participants validés' value={10} maxValue={100} />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ p: 2, bgcolor: 'background.drawer' }}>
                        <AdminStatisticsCard />
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ p: 2, bgcolor: 'background.drawer' }}>
                        <DataCard title='Nombre de participants inscrits' value={10} maxValue={100} />
                    </Grid>
                    <Grid item xs={12} md={12} sx={{ p: 2, bgcolor: 'background.drawer' }}>

                    </Grid>
                </Grid>
            </Box>

        </Box>
    )
}

export default SuperAdminDashboard
