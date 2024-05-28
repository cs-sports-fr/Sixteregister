import { Box, Card, CardContent, CardHeader, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import Navbar from "../../components/navbar/Navbar";
import { routesForUser } from "../../routes/routes";
import { useEffect, useState } from "react";
import { ApiTossConnected } from "../../service/axios";
import { calculatePrice } from "../../utils/calculatePrice";
import TeamPaymentList from "../../components/team/TeamsPaymentList";
import { parseTeamDashboard } from "../../utils/parseTeam";
import { useSnackbar } from "../../provider/snackbarProvider";
import axios from "axios";

const UserPayment = () => {
    // eslint-disable-next-line no-unused-vars
    const [user, setUser] = useState({});
    const [teams, setTeams] = useState([]);
    const [principalTeams, setPrincipalTeams] = useState([]);
    const [paymentData, setPaymentData] = useState({});

    const { showSnackbar } = useSnackbar();

    const [config, setConfig] = useState({
        isRegistrationOpen: false,
        isPaymentOpen: false,
    });


    const handleLydiaPayment = (team) => {
        console.log('Lydia payment', team);
        ApiTossConnected.post('/payment/request?team_id=' + team.id)
            .then((response) => {
                console.log(response);
                window.open(response.data, '_blank');
            }).catch((error) => {
                console.log(error);
                showSnackbar('Erreur lors de la création du paiement', 3000, 'error')
            });
    }

    const fetchConfig = () => {
        ApiTossConnected.get('/config')
            .then((response) => {
                setConfig(response?.data);
            }).catch((error) => {
                console.log(error);
            });
    }

    const fetchTeams = () => {
        ApiTossConnected.get('/teams')
            .then((response) => {
                setTeams(parseTeamDashboard(response?.data));
                setPaymentData(calculatePrice(response?.data));
                setPrincipalTeams(parseTeamDashboard(response?.data.filter(team => team.status === 'PrincipalList')));
            }).catch((error) => {
                console.log(error);
            });
    }

    const fetchUserData = () => {
        ApiTossConnected.get('/users/me')
            .then((response) => {
                setUser(response.data); // Assuming the user data is directly in the response data
            })
            .catch((error) => {
                console.log(error);
                // Optionally, show an error message to the user using your existing snackbar functionality
                showSnackbar('Erreur lors de la récupération des données utilisateur', 3000, 'error');
            });
    };

    
        const isDelegation = [
            6, 11, 13, 23, 34, 37, 41, 42, 43, 49,
            51, 54, 63, 65, 69, 70, 74, 76, 80, 86,
            88, 89, 99,103, 107, 110, 111, 117, 126,
            137, 170, 178, 194, 204, 215, 222, 233, 236,
            250, 251, 257, 260, 286, 313
        ];
    
    /*
        const calculateCautionSport = () => {
            let cautionDeleg = 0;
            let cautionSport = 0;
            let cautionHebergement = 0;
            if (user.schoolID && isDelegation.includes(Participant.schoolID)) {
                cautionDeleg = 2500;
                const participantsFromSameSchool = participants.filter(participant => Participant.schoolId === Participant.schoolId);
                participantsFromSameSchool.forEach(participant => {
                    cautionSport += 200;
                    cautionHebergement += (Participant.packId === 5 || Participant.packId === 6 || Participant.packId === 11 || Participant.packId === 12) ? 600 : 0;
                });
            
        };
    
        const calculateCautionDeleg = () => {
            let cautionDeleg = 0;
            if (Participant.schoolID && isDelegation.includes(Participant.schoolID)) {
                cautionDeleg = 2500;
            };
        }
    
        const calculateCautionHebergement = () => {
            let cautionHebergement = 0;
            if (participant.schoolID && isDelegation.includes(participant.schoolID)) {
                const participantsFromSameSchool = participants.filter(participant => participant.schoolId === participant.schoolId);
                participantsFromSameSchool.forEach(participant => {
                    cautionHebergement += (participant.packId === 5 || participant.packId === 6 || participant.packId === 11 || participant.packId === 12) ? 600 : 0;
                });
            }
        };
    */
    useEffect(() => {
        fetchConfig();
        fetchTeams();
        fetchUserData();
        /*calculateCautionDeleg();
        calculateCautionHebergement();
        calculateCautionSport();*/
    }, []);






    return (
        <Box display={'flex'} flexDirection={'column'} height={'100vh'} sx={{ overflowX: 'hidden', backgroundColor: 'background.drawer' }}>
            {/* Navbar */}
            <Navbar navigation={routesForUser} />

            {/* Main Content */}
            {config?.isPaymentOpen ?
                <Box flexGrow={1} display={'flex'} alignContent={'center'} p={8} flexDirection={'column'}>
                    <Card variant='outlined' sx={{ borderRadius: '0.8rem', width: '100%', mb: 3 }}>
                        <CardHeader title={'Récapitulatif liste principale'} />
                        <CardContent>
                            <Box sx={{ width: '50%', ml: 5 }}>
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>Nombre de joueurs inscrits : </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>{paymentData?.PrincipalList?.totalPlayers}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>Nombre d&apos;équipes inscrites : </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>{paymentData?.PrincipalList?.totalTeams}</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>Montant déjà réglé :</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>{paymentData?.PrincipalList?.amountPaid} €</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1.25rem' }}>Reste à payer : </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1.25rem' }}>{paymentData?.PrincipalList?.amountToPay.toFixed(2)} €</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                        </CardContent>
                    </Card>

                    {paymentData?.PrincipalList?.amountToPay >= 1000 || isDelegation.includes(user.schoolId)?

                        <Card variant='outlined' sx={{ borderRadius: '0.8rem', width: '100%', mb: 3 }}>
                            <CardHeader title={'Paiement'} />
                            <CardContent>
                                <Typography sx={{ fontSize: '1.25rem' }}>Pour régler votre solde, veuillez contacter votre bds qui va effectuer un virement sur le compte suivant :</Typography>
                                <Typography sx={{ fontSize: '1.25rem' }}>FR76 3000 4000 8600 0102 3594 368</Typography>
                                <Typography sx={{ fontSize: '1.25rem' }}>Avec comme motif : TOSS - Votre école</Typography>
                                <Typography sx={{ fontSize: '1.25rem' }}>Envoyer ensuite votre preuve de virement à <a href="mailto:contact@cs-sports.fr?subject=[Paiement TOSS]">contact@cs-sports.fr</a></Typography>
                            </CardContent>
                        </Card>
                        :
                        <Card variant='outlined' sx={{ borderRadius: '0.8rem', width: '100%', mb: 3 }}>
                            <CardHeader title={'Paiement'} />
                            <CardContent>
                                <TeamPaymentList columns={columns} teams={principalTeams} modify={true} onModify={(team) => handleLydiaPayment(team)} disabled={(team) => checkPayment(team)} />
                            </CardContent>
                        </Card>
                    }
                    <Card variant='outlined' sx={{ borderRadius: '0.8rem', width: '100%', mb: 3, marginTop: '2%' }}>
                        <CardHeader title={'Cautions'} />
                        <CardContent>
                            <Box sx={{ width: '100%' }}>
                                <TableContainer>
                                    <Table size="small">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>
                                                        <span style={{}}>Montant caution deleg :</span> <span style={{ fontStyle: 'italic' }}>2500€ pour une délégation (à envoyer avant le 27 mars)</span>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>Ordre pour le chèque de caution : CentraleSupelec Sports</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>{ }</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>
                                                        <span style={{}}>Montant caution sport :</span> <span style={{ fontStyle: 'italic' }}>200€ par participant (à envoyer avant le 11 avril)</span>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}> Adresse pour le chèque de caution : 3 rue Joliot-Curie, 91190 Gif sur Yvette</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>{ }</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>
                                                        <span style={{}}>Montant caution hébergement :</span> <span style={{ fontStyle: 'italic' }}>600€ pour un hébergement en résidence (à envoyer avant le 11 avril)</span>
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem' }}>{ }</Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem', fontStyle: 'italic' }}>Pour une délegation, les cautions sont centralisées. Seul le responsable de délegation doit envoyer un chèque pour la déleg, pour le sport, et pour l'hébergement. Attention, il faut bien faire 3 chèques distincts. </Typography>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '1rem', fontStyle: 'italic' }}>Si vous ne faites pas partie d'une délegation, les cautions sont centralisées par équipe. Là encore, il faudra réaliser 2 chèques différents (un pour le sport, et un en cas d'hébergement en résidence). </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </CardContent>
                    </Card>


                </Box>
                :
                <Box flexGrow={1} display={'flex'} >
                    <Box sx={{ bgcolor: 'background.drawer', width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
                        <Typography variant="h4" align="center">Le paiement est fermé</Typography>
                    </Box>
                </Box>
            }
        </Box>
    );
}



const columns = [
    { label: "N°", align: "left", key: "id", type: 'index' },
    { label: "Nom", align: "center", key: "name" },
    { label: "Sport", align: "center", key: "sport" },
    { label: "Nombre de joueurs", align: "center", key: "len" },
    { label: "Status", align: "center", key: "status", type: "status" },
    { label: "Prix total", align: "center", key: "price" },
]

const checkPayment = (team) => {
    if (team?.amountToPayInCents <= team?.amountPaidInCents) {
        return true;
    }
    return false;
}




export default UserPayment;