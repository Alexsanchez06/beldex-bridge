import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

function PageLoader({ show = true, color = 'primary', height = 4 }) {
  const theme = useTheme();

  if (!show) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        zIndex: theme.zIndex.modal + 1,
        width: '100%',
      }}
    >
      <LinearProgress
        color={color}
        sx={{
          height: height,
          '& .MuiLinearProgress-bar': {
            transition: 'transform 0.4s linear',
          },
        }}
      />
    </Box>
  );
}

PageLoader.propTypes = {
  show: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary', 'error', 'info', 'success', 'warning']),
  height: PropTypes.number,
};

export default PageLoader;
