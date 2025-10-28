import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { QRCodeCanvas } from "qrcode.react";

import AnimateHeight from "react-animate-height";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import CopyIcon from "../../assets/icons/CopyIcon.svg";
import { Button, Snackbar } from "@components";
import { SWAP_TYPE } from "@constants";
import { styles } from "./styles";
import important from "./warning.png";
import QrCodeIcon from "../../assets/icons/QrCode.svg";
import { useTheme } from "@mui/material/styles";

function SwapInfo({
  swapType,
  swapInfo,
  info,
  onRefresh,
  onBack,
  loading = false,
  walletConnected,
  selectedWallet,
}) {
  const theme = useTheme();
  // const sx = styles(theme);

  const { t } = useTranslation();
  const [showQR, setShowQR] = useState(false);
  const [qrSize, setQrSize] = useState(120);
  const [snackbar, setSnackbar] = useState({
    message: null,
    variant: "success",
    open: false,
  });

  useEffect(() => {
    // Run a timer every 30 seconds to refresh
    const timer = setInterval(onRefresh, 30 * 1000);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const newQrSize = width <= 600 ? 128 : 150;
      setQrSize(newQrSize);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(timer);
    };
  }, [onRefresh]);

  const onCopy = (id) => {
    navigator.clipboard.writeText(id);
    showMessage(t("addressCopiedSuccess"), "success");
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  const showMessage = (message, variant = "error") => {
    setSnackbar({
      message,
      variant,
      open: true,
    });
  };

  const closeMessage = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderQR = () => {
    const { depositAddress } = swapInfo;
    const height = showQR ? "auto" : 0;

    return (
      <AnimateHeight duration={250} height={height}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "#1C1C26",
            borderRadius: "16px",
            padding: "20px",
            margin: "auto",
            marginBottom: theme.spacing(1),
            marginTop: theme.spacing(1),

            width: `${qrSize + 57}px`,
            height: `${qrSize + 57}px`,
          }}
        >
          <Box sx={{ padding: theme.spacing(1),
    backgroundColor: "white",
    borderRadius: "16px",}}>
            <QRCodeCanvas value={depositAddress} size={qrSize} />
          </Box>
        </Box>
        <div style={{ width: "20px", height: "2px" }}></div>
      </AnimateHeight>
    );
  };

  const renderMemo = () => {
    const { memo } = swapInfo;
    if (!memo) return null;

    return (
      <Box sx={{ marginBottom: theme.spacing(3),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",}}>
        <Typography sx={{ 
    margin: theme.spacing(1, 0),
    textAlign: "center",color: "#000" }}>
          {t("readCarfully")}
        </Typography>
        <Typography
          className={`blinkAnim`}
          sx={{ 
            margin: theme.spacing(1, 0),
            textAlign: "center",color:'red' }}
        >
          {t("amountSentWarning")}
          <img alt="" src={important} className="blinkImg" />
        </Typography>
      </Box>
    );
  };

  const renderDepositInstructions = () => {
    const { depositAddress } = swapInfo;

    const depositCurrency = swapType === SWAP_TYPE.BDX_TO_BBDX ? "BDX" : "wBDX";

    return (
      <React.Fragment>
        <Typography sx={{fontFamily: "Poppins",
    color: "#AFAFBE",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
    overflowWrap: "break-word",
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.7rem",
    },}}>
          {t("transferDepositCurrency", { depositCurrency })}
        </Typography>
        <Box
          sx={{
            borderRadius: "12px",
            background: "#282837",
            padding: "12px 16px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* LEFT: Address Text */}
            <Box
              id="depositAddress"
              sx={{
                flexGrow: 1,
                // color: "#00AD07",
                fontSize: "14px",
                fontWeight: 500,
                fontFamily: "Poppins, sans-serif",
                borderRadius: "8px",
                padding: "10px 12px",
                // border: "1px solid #00AD07",
                wordBreak: "break-all",
              }}
            >
              {depositAddress}
            </Box>

            {/* RIGHT: Icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 0.5,
                marginLeft: "12px",
              }}
            >
              <Tooltip title="Copy Address" placement="top">
                <IconButton
                  onClick={() => onCopy(depositAddress)}
                  aria-label="Copy Address"
                  size="small"
                  sx={{ color: "#AFAFBE" }}
                >
                  <img alt="Copy" src={CopyIcon} width={18} height={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Show QR" placement="top">
                <IconButton
                  onClick={toggleQR}
                  aria-label="Toggle QR"
                  size="small"
                  sx={{ color: "#AFAFBE" }}
                >
                  <img alt="QR" src={QrCodeIcon} width={18} height={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* QR Code below (optional) */}
          <Box sx={{ marginTop: 2 }}>{renderQR()}</Box>
        </Box>

        {renderMemo()}
      </React.Fragment>
    );
  };

  const renderInstructions = () => {
    const beldexFee = info?.fees?.bdx / 1e9 || 0;

    return (
      <Box
        sx={{
          flexDirection: "column",
          wordBreak: "break-word",
        }}
      >
        {swapType === SWAP_TYPE.BDX_TO_BBDX && renderDepositInstructions()}

        {swapType === SWAP_TYPE.BBDX_TO_BDX && (
          <Typography
            sx={{
              marginTop: theme.spacing(1),
              color: "#AFAFBE",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.6rem",
              },
            }}
          >
            {t("processingFee")}
            <span style={{ color: "#3EC745" }}> {beldexFee}</span>{" "}
            {t("bdxCharged")}
          </Typography>
        )}

        <Box
          sx={{
            flexDirection: "column",
            wordBreak: "break-word",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.8rem",
              },
            }}
          >
            {t("note")}
          </Typography>
          {swapType === SWAP_TYPE.BDX_TO_BBDX && (
            <Typography
              sx={{
                color: "#EBEBEB",
                fontFamily: "Poppins",
                fontSize: "0.80rem",
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: "22px",
                wordBreak: "break-word",
                marginTop: theme.spacing(1),
                [theme.breakpoints.down("sm")]: {
                  fontSize: "0.7rem",
                },
              }}
            >
              {t("transactionInstructions")}
            </Typography>
          )}
          <Typography
            sx={{
              color: "#EBEBEB",
              fontFamily: "Poppins",
              fontSize: "0.80rem",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "22px",
              wordBreak: "break-word",
              marginTop: theme.spacing(1),
              [theme.breakpoints.down("sm")]: {
                fontSize: "0.7rem",
              },
            }}
          >
            {t("swapRequest")}{" "}
            <Typography component="span">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://t.me/Beldexadmin"
                style={{ color: "#3EC745" }}
              >
                @Beldexadmin
              </a>
            </Typography>{" "}
            on telegram.
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderReceivingAmount = () => {
    if (!swapInfo?.swaps || swapInfo.swaps.length === 0) return null;

    const receivingCurrency =
      swapType === SWAP_TYPE.BDX_TO_BBDX ? "wBDX" : "BDX";
    const pendingSwaps = swapInfo.swaps.filter(
      (s) => s.transferTxHashes && s.transferTxHashes.length === 0
    );
    const total = pendingSwaps.reduce(
      (total, swap) => total + parseFloat(swap.amount),
      0
    );
    const displayTotal = total / 1e9;

    return (
      <Grid2 item xs={12} sx={styles.stats}>
        <Typography sx={styles.statTitle}>{t("pendingAmount")}:</Typography>
        <Typography sx={styles.statAmount}>
          {displayTotal} {receivingCurrency}
        </Typography>
      </Grid2>
    );
  };

  return (
    <Box sx={styles.root}>
      <Grid2 item xs={12} sx={styles.back}>
        {swapType !== SWAP_TYPE.BDX_TO_BBDX && (
          <Box
            sx={{
              borderRadius: "12px",
              background: "#282837",
              width: "100%",
              height: "70px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "15px",
              [theme.breakpoints.down("sm")]: {
                height: "45px",
              },
            }}
          >
            {!selectedWallet ? (
              <Typography
                sx={{
                  color: "red !important",
                  textAlign: "center",
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
                {t("connectYourWallet")}
              </Typography>
            ) : (
              <Typography
                sx={{
                  color: "#3EC745 !important",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "20px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.9rem",
                  },
                }}
              >
                {selectedWallet} {t("walletConnected")}
              </Typography>
            )}
          </Box>
        )}
      </Grid2>

      {renderInstructions()}

      <Grid2 item xs={12} sx={styles.button}>
        <Button
          fullWidth
          label="Refresh"
          loading={loading}
          onClick={onRefresh}
        />
      </Grid2>

      <Typography
        className="contract-address"
        sx={{
          color: "#AFAFBE",
          textAlign: "center",
          fontFamily: "Poppins",
          fontSize: "0.80rem",
          fontStyle: "normal",
          fontWeight: 300,
          wordBreak: "break-all",
           marginTop: "20px"
        }}
        
      >
        {t("con_address")}
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          fontFamily: "Poppins",
          fontSize: "0.80rem",
          fontStyle: "normal",
          fontWeight: 300,
          wordBreak: "break-all",
          color: "#EBEBEB",
        }}
      >
        0x90bbdDbF3223363898065b9C736e2B86C655762b
      </Typography>

      <Snackbar
        message={snackbar.message}
        open={snackbar.open}
        onClose={closeMessage}
        variant={snackbar.variant}
      />
    </Box>
  );
}

SwapInfo.propTypes = {
  swapType: PropTypes.string.isRequired,
  swapInfo: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  walletConnected: PropTypes.bool,
  selectedWallet: PropTypes.string,
};

export default SwapInfo;
