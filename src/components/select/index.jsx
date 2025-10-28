import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import StyledLabel from '../label';
import styles  from './styles';

function StyledSelect({
  label,
  id,
  value,
  handleChange,
  fullWidth = false,
  options = [],
  disabled = false,
  allowNull = false,
}) {
  return (
    <FormControl sx={styles.root} fullWidth={fullWidth} variant="outlined">
      <StyledLabel label={label} />
      <Select
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        id={id}
        displayEmpty
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        }}
      >
        {allowNull && (
          <MenuItem value="">
            <em>Select</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.description}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

StyledSelect.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleChange: PropTypes.func,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  allowNull: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      description: PropTypes.string.isRequired,
    })
  ),
};

export default StyledSelect;
