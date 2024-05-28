import { Box, Button, Drawer, InputLabel, Switch, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ApiTossConnected } from '../../service/axios';
import { useSnackbar } from '../../provider/snackbarProvider';


const ModifySchool = ({ open, onClose, schoolInput }) => {

    const { showSnackbar } = useSnackbar();

    const [school, setSchool] = useState(schoolInput);
    useEffect(() => {
        setSchool(schoolInput);
    }, [schoolInput]);

    const handleChange = (e) => {
        const { id, value, checked, type } = e.target;
        setSchool(prevState => ({
            ...prevState,
            [id]: type === "checkbox" ? checked : value,
        }));
    }

    const handleValidate = () => {
        ApiTossConnected.put('/schools/' + school.id + '?name=' + school.name + '&is_in_idf=' + school.isIdf).then(() => {
            showSnackbar('Ecole modifiée', 3000, 'success');
            onClose();
        }).catch(error => {
            console.log(error);
            showSnackbar('Erreur lors de la modification', 3000, 'error');
        });
    }

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Box sx={{ width: '45vw' }}>
                <Box sx={{ m: 5, height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant={'h5'} sx={{ mb: 1, justifyContent: 'center' }}>Modification d&apos;une école</Typography>
                    </Box>

                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="name" sx={{ marginBottom: 1 }}>Nom</InputLabel>
                        <TextField id="name"
                            placeholder="Nom de l'école"
                            variant="outlined"
                            value={school?.name || ''}
                            onChange={handleChange}
                            fullWidth
                            autoComplete="firstname"
                            name="firstname"
                        />
                    </Box>
                    <Box sx={{ justifyContent: 'left', textAlign: 'left', mb: 2 }}>
                        <InputLabel htmlFor="isIdf" sx={{ marginBottom: 1 }}>IDF</InputLabel>
                        <Switch id="isIdf"
                            onChange={handleChange}
                            checked={school?.isIdf || false}
                        />
                    </Box>
                    <Button onClick={handleValidate}>Valider</Button>
                </Box>
            </Box>
        </Drawer>
    );
}

ModifySchool.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    schoolInput: PropTypes.object,
};

export default ModifySchool;