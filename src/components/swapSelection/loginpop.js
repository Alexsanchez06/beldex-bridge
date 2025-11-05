import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useTranslation } from 'react-i18next';
import { styles } from './styles';
import closeIcon from './close.svg';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function LoginPopup({ loginClose }) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={loginClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      sx={styles.LoginPopup}
    >
      <DialogTitle id="alert-dialog-slide-title">
        Use Google's location service?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t('googleLocationInfo')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={loginClose} color="primary" sx={styles.closeBtn}>
          <img alt="Close" src={closeIcon} />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LoginPopup;
