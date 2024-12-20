import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

const Sixtemen = ({  }) => {

    return (

      <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: '100%',
          maxWidth: '77rem',
          gap: '2.5rem'
        }}>


          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: 'white',
            overflow: 'hidden',
            width: '35rem',
            height:'25rem',
          }}>
            <Typography variant='h4' sx={{fontWeight: 'bold', color: palette.primary.main,backgroundColor:'transparent',position:'absolute'}}>Alexandru State<br/>Sixtemen</Typography>
            <Box
              component="img"
              src='./public/images/photo_alex.jpg'
              alt='photo alex'
              sx={{objectFit:'crop',objectPosition:'center',width: '100%'}}
            />
          </Box>


        </Box>
    );
};

export default Sixtemen;