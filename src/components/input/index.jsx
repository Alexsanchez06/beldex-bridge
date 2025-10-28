import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import StyledLabel from '../label';
import styles  from './styles';

function StyledInput({
  helpertext,
  placeholder,
  id,
  defaultValue,
  label,
  fullWidth,
  value,
  onChange,
  error,
  disabled,
  password,
  type = 'text',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const endAdornment = password ? (
    <InputAdornment position="end">
      <IconButton
        aria-label="Toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
      >
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  ) : null;

  return (
    <FormControl sx={styles.root} variant="outlined" fullWidth={fullWidth} error={error}>
      <StyledLabel label={label} />
      <OutlinedInput
        id={id}
        sx={{border:'1px solid #393954',borderRadius:'10px'}}
        placeholder={placeholder}
        fullWidth={fullWidth}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        disabled={disabled}
        type={password ? (showPassword ? 'text' : 'password') : type}
        endAdornment={endAdornment}
      />
      {helpertext && <FormHelperText>{helpertext}</FormHelperText>}
    </FormControl>
  );
}

StyledInput.propTypes = {
  label: PropTypes.string.isRequired,
  helpertext: PropTypes.string,
  placeholder: PropTypes.string,
  id: PropTypes.string,
  defaultValue: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  password: PropTypes.bool,
  type: PropTypes.string,
  error: PropTypes.bool,
};

StyledInput.defaultProps = {
  type: 'text',
  fullWidth: false,
  disabled: false,
  password: false,
  error: false,
};

export default StyledInput;
