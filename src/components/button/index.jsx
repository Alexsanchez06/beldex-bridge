import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import  styles  from './styles';

function StyledButton({
  label,
  fullWidth = false,
  onClick,
  disabled = false,
  secondary = false,
  loading = false,
}) {
  return (
    <Box sx={styles.root}>
      <Button
        sx={{
          ...styles.button,
          ...(secondary && styles.secondary),
        }}
        fullWidth={fullWidth}
        variant="outlined"
        color={secondary ? 'secondary' : 'primary'}
        disabled={disabled || loading}
        onClick={onClick}
      >
        {label}
      </Button>
      {loading && <CircularProgress size={24} sx={styles.buttonProgress} />}
    </Box>
  );
}

StyledButton.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  secondary: PropTypes.bool,
};

export default StyledButton;
