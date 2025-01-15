import { Autocomplete, Box, Button, ListItem, ListItemText, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const SelectSport = ({ callback, sports, callbackType, isCollective }) => {

    const [sportId, setSportId] = useState(null);
    const handleChange = (event, value) => {
        setSportId(value);
    }

    const [isSportCollective, setIsSportCollective] = useState(null);

    useEffect(() => {
        setIsSportCollective(isCollective);
    }, [isCollective]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                height: "100%",
                backgroundColor: 'background.paper',
                flexGrow: 1
            }}
        >
            <Typography variant="h4" color="textPrimary" my={3}>
                Choix du sport
            </Typography>

            {isSportCollective === null &&
                <Box display="flex" flexDirection="row" justifyContent="center" gap={2}>
                    
                    <Button variant="contained" color="primary" sx={{ width: '12rem' }}
                        onClick={() => { setIsSportCollective(true); callbackType(true) }}
                    >
                        Sport collectif
                    </Button>
                </Box>
            }

            {isSportCollective !== null &&
                <Box
                    sx={{
                        width: '20rem'
                    }}
                >
                    <Autocomplete id="school"
                        variant="outlined"
                        fullWidth
                        options={sports.filter(sport => sport.isCollective === isSportCollective)}
                        getOptionLabel={(option) => option.sport}
                        renderInput={(params) =>
                            <TextField {...params}
                                placeholder="Rechercher votre sport..."
                                InputLabelProps={{ shrink: true }}
                                inputProps={{
                                    ...params.inputProps,
                                    style: {
                                        paddingTop: 0,
                                        color: 'white', // Add this line for white text

                                    },
                                }}
                            // error={!!errors.school}
                            // helperText={errors.school}
                            />}
                        renderOption={(props, option) => (
                            <ListItem
                                key={option.id}
                                {...props}
                                variant="school"
                            >
                                <ListItemText primary={option.sport} />
                            </ListItem>
                        )}
                        value={sportId}
                        onChange={handleChange}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                    <Button fullWidth sx={{ my: 2 }}
                        onClick={() => callback(sportId)}
                    >Valider</Button>
                    <Button variant="lighter" fullWidth onClick={() => { callbackType(null); setIsSportCollective(null); setSportId(null) }}>Retour</Button>
                </Box>
            }

        </Box >
    );

};

SelectSport.propTypes = {
    callback: PropTypes.func.isRequired,
    sports: PropTypes.array.isRequired,
    callbackType: PropTypes.func.isRequired,
    isCollective: PropTypes.bool,
};

export default SelectSport;