import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

import StarRoundedIcon from '@mui/icons-material/StarRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';

const Statistics = ({  }) => {

    return (
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height:"30vh",
        backgroundColor: '#222429',
        gap: '2rem',
        px: '6rem',
      }}
    >
       <Box sx={{ display: 'flex' }}>
            <Box sx={{ 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                padding: '1rem', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '2rem',
                height: '2rem',
            }}>
                <StarRoundedIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
            </Box>
            <Box sx={{ marginLeft: '1rem' }}>
                <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 'bold' }}> EDITION </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}> 28 </Typography>
            </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                padding: '1rem', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '2rem',
                height: '2rem',
            }}>
                <GroupsRoundedIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
            </Box>
            <Box sx={{ marginLeft: '1rem' }}>
                <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 'bold' }}> NOTRE EFFECTIF </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}> 42 </Typography>
            </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                padding: '1rem', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '2rem',
                height: '2rem',
            }}>
                <CheckRoundedIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
            </Box>
            <Box sx={{ marginLeft: '1rem' }}>
                <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 'bold' }}> EQUIPES AYANT PARTICIPE </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}> 916 </Typography>
            </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
            <Box sx={{ 
                borderRadius: '50%', 
                backgroundColor: 'primary.main', 
                padding: '1rem', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                width: '2rem',
                height: '2rem',
            }}>
                <EmojiEventsRoundedIcon sx={{ color: 'white', fontSize: '2.5rem' }} />
            </Box>
            <Box sx={{ marginLeft: '1rem' }}>
                <Typography variant="h6" sx={{ color: 'grey.400', fontWeight: 'bold' }}> PARTICIPANTS </Typography>
                <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold' }}> 450 </Typography>
            </Box>
        </Box>





      </Box>
    )
};


export default Statistics
