import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import ErrorIconSvg from './Error.svg';
import CheckCircleIconSvg from './Success.svg';
import WarningIconSvg from './Warning.svg';
import { styles } from './styles';

const variantIcon = {
  success: CheckCircleIconSvg,
  warning: WarningIconSvg,
  error: ErrorIconSvg,
  info: InfoIcon,
};

const textClasses = {
  warning: 'blackText',
};

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function StyledSnackbar({ className, message, onClose, variant, open }) {
  const Icon = variantIcon[variant];
  const text = textClasses[variant] || 'primaryText';
  const isIconComponent = variant === 'info';

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={variant === 'error' ? 10000 : 6000}
      onClose={onClose}
      ContentProps={{
        'aria-describedby': 'message-id',
        sx: {
          ...styles[variant],
          ...styles.contentWrapper,
          ...(className && {}),
        },
      }}
      message={
        <Box
          id="message-id"
          sx={{
            ...styles.message,
            ...styles[text],
          }}
        >
          {isIconComponent ? (
            <Icon sx={{ ...styles.icon, ...styles.iconVariant }} />
          ) : (
            <img
              alt=""
              src={Icon}
              style={{
                ...styles.icon,
                ...styles.iconVariant,
              }}
            />
          )}
          {message && capitalize(message.toString())}
        </Box>
      }
      action={
        <Box sx={{ position: 'relative' }}>
          <IconButton
            sx={{
              ...styles.closeIcon,
              ...styles[text],
            }}
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon sx={{ ...styles.icon }} />
          </IconButton>
        </Box>
      }
    />
  );
}

StyledSnackbar.propTypes = {
  open: PropTypes.bool.isRequired,
  message: PropTypes.any,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
  className: PropTypes.string,
};

export default StyledSnackbar;
