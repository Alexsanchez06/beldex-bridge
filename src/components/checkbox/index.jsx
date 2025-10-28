import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
// import FormControlLabel from '@mui/material/FormControlLabel';
import StyledLabel from '../label';
import  styles  from './styles';

function StyledCheckbox({
  // helpertext,
  id,
  label,
  fullWidth = false,
  checked = false,
  onChange,
  error = false,
  disabled = false,
}) {
  return (
    <FormControl
      sx={styles.root}
      variant="outlined"
      fullWidth={fullWidth}
      error={error}
    >
      <Checkbox
        id={id}
        checked={checked}
        onChange={onChange}
        value={id}
        disabled={disabled}
        sx={{
          color: error ? 'error.main' : 'default',
          '&.Mui-checked': {
            color: error ? 'error.main' : 'primary.main',
          },
        }}
      />
      <StyledLabel label={label} style={{ margin: 0 }} />
    </FormControl>
  );
}

StyledCheckbox.propTypes = {
  label: PropTypes.string.isRequired,
  helpertext: PropTypes.string,
  id: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.bool,
};

export default StyledCheckbox;
