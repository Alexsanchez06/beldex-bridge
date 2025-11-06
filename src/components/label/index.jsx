import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import  styles  from './styles';

function Label({ label, style = {} }) {
  return (
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        ...styles.inline,
        fontSize: { xs: '0.7rem', sm: '1rem' },
        ...style,
      }}
    >
      {label}
    </Typography>
  );
}

Label.propTypes = {
  label: PropTypes.string.isRequired,
  style: PropTypes.object,
};

export default Label;
