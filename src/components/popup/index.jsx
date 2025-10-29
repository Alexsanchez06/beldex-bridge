import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import metamask from "./metamask.png";
import trustWallet from "./trustWallet.png";
import styles from "./styles";

function Popup({ onClose, selectedValue, open }) {
  const { t } = useTranslation();

  const [wallets] = useState([
    { text: "Trust Wallet", img: trustWallet },
    { text: "Metamask", img: metamask },
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
      slotProps={{
        paper: {
          sx: styles.root,
        },
      }}
    >
      <DialogTitle
        id="wallet-dialog-title"
        sx={{
          backgroundColor: "#1F1F2E",
          color: "white",
          width: "380px",
          textAlign: "center",
          padding: "25px 24px 4px",
          // "& .MuiTypography-root": {
            fontSize: "1.3rem !important",
            marginBottom: "0 !important",
          // },
          "@media (max-width: 600px)": {
            width: "279px",
            "& .MuiTypography-root": {
              fontSize: "1rem !important",
            },
          },
        }}
      >
        {t("chooseWallet")}
        <Button
          onClick={handleClose}
          sx={{
            padding: 0,
            minWidth: 0,
            position: "relative",
            top: "-17px",
            right: "-43px",
          }}
        >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
                border: "1px solid #393954",
                width: "100%",
                padding: "10px 20px",
                fontWeight: 600,
                fontSize: "1.1rem",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#282837",
                },
              }}
            >
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
