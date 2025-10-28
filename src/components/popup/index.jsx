import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import metamask from './metamask.png';
import trustWallet from './trustWallet.png';
import  styles  from './styles';

function Popup({ onClose, selectedValue, open }) {
  const { t } = useTranslation();

  const [wallets] = useState([
    { text: 'Trust Wallet', img: trustWallet },
    { text: 'Metamask', img: metamask },
  ]);

  const handleClose = () => {
   
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="wallet-dialog-title"
      open={open}
      PaperProps={{
        sx: styles.root,
      }}
    >
      <DialogTitle
        id="wallet-dialog-title"
        sx={{
          ...styles.title,
          '@media (max-width: 600px)': {
            width: '279px',
            '& .MuiTypography-root': {
              fontSize: '1rem !important',
            },
          },
        }}
      >
        {t('chooseWallet')}
        <Button onClick={handleClose} sx={styles.closeBtn}>
          <CloseIcon />
        </Button>
      </DialogTitle>
      <List>
        {wallets.map((wallet) => (
          <ListItem
            button
            onClick={() => handleListItemClick(wallet.text)}
            key={wallet.text}
          >
            <div style={styles.wallet}>
              <ListItemAvatar>
                <Avatar src={wallet.img} alt={wallet.text} />
              </ListItemAvatar>
              <ListItemText disableTypography primary={wallet.text} />
            </div>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default Popup;
