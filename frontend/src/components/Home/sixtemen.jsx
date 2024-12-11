import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import palette from '../../themes/palette';

const Sixtemen = ({  }) => {

    return (
      
        <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '1.25rem',
      }}>
        <Box sx={{
          fontSize: '1.75rem',
          fontWeight: 'bold',
          paddingBottom: '2rem',
          color: '#318ce7',
          display:'flex',
          justifyContent:'center',
          alignItems:'center'
          }}>L'équipe</Box>
          
          <Box sx={{
          display:'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems:'center',
          fontWeight: 'bold',
          color:'black', 
          fontSize: '3rem',
          paddingBottom:'5rem',
          gap:'22rem'
          }}>
        <Box>Le Sixteman</Box>
        <Box>La Sixtewoman</Box>
        </Box>
        
        
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
            backgroundColor: '#1A1A1A',
            color: 'white',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            width: '18rem',
          }}>
            <Box
              component="img"
              src='./public/images/photo_alex.jpg'
              alt='photo alex'
              sx={{ width: '170%', height: '150%'}}
            />
            <Box sx={{ padding: '0.75rem' }}>
              <Box sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Alexandru State</Box>
              <Box sx={{ fontSize: '1rem', fontWeight: 'medium' }}>Le Sixteman</Box>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#1A1A1A',
            color: 'white',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            width: '20rem',
          }}>
            <Box
              component="img"
              src='./public/images/photo_garance.jpg'
              alt='photo garance'
              sx={{ width: '90%', height: '90%'}}
            />
            <Box sx={{ padding: '0.75rem' }}>
              <Box sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Garance Asselin</Box>
              <Box sx={{ fontSize: '1rem', fontWeight: 'medium' }}>La Sixtewoman</Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
};

export default Sixtemen;