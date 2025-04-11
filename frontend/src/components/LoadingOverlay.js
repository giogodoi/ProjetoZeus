import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999,
      }}
    >
      <img
        src="/images/loading.gif"
        alt="Loading..."
        style={{
          width: '100px',
          height: '100px',
        }}
      />
    </Box>
  );
};

export default LoadingOverlay;
