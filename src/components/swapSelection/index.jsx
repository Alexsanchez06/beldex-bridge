import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import StyledButton from "../button";
import Input from "../input";
import { SWAP_TYPE, TYPE } from "@constants";
import config from "@config";
import styles from "./styles";
import Swaptabs from "./swapTabs";
import binance from "../popup/binance.png";
import metamask from "../popup/metamask.png";
import trustwallet from "../popup/trustWallet.png"
import walletConnect from "../popup/walletConnect.png"
import { useDispatch, useSelector } from "react-redux";

import { getBalance } from "../../store/swapReducer";
import { selectBalance } from "../../store/swapSelector";
import CircularProgress from "@mui/material/CircularProgress";

const walletCreationUrl = {
  [TYPE.BDX]: config.beldex.walletCreationUrl,
  [TYPE.BNB]: config.binance.walletCreationUrl,
};

function SwapSelection({
  loading,
  onNext,
  onSwapTypeChanged,
  connectedWalletAddress,
  connectWalletPopup,
  selectedWallet,
  disconnet,
  connectedWalletBalance,
  connectToMetaMask,
  totalSupply: initialTotalSupply,
  movedBalance: initialMovedBalance,
  info,
  setAmount,
  amount,
  
}) {
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  // const [amount, setAmount] = useState(0);
  const [addressError, setAddressError] = useState(false);
  const [swapType, setSwapType] = useState("bdx_to_bbdx");
  const [loginOpen, setLoginOpen] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [totalSupply, setTotalSupply] = useState(initialTotalSupply);
  const [movedBalance, setMovedBalance] = useState(initialMovedBalance);

  const balance = useSelector(selectBalance) || [];
  const dispatch = useDispatch();
  useEffect(() => {
    if (balance && balance.length > 0) {
      const bal = Number(
        parseFloat(balance[0].movedBalance).toFixed(2)
      ).toLocaleString("en", { minimumFractionDigits: 2 });
      const total = Number(
        parseFloat(balance[0].totalSupply).toFixed(2)
      ).toLocaleString("en", { minimumFractionDigits: 2 });

      if (swapType === "bdx_to_bbdx") {
        if (total === bal) {
          setLoginOpen(true);
        }
      } else {
        setLoginOpen(false);
      }

      setTotalSupply(total);
      setMovedBalance(bal);
    }
  }, [balance, swapType]);
  const handleNext = async () => {
    const isValidAddress = address && address.length > 0;
    setAddressError(!isValidAddress);

    if (isValidAddress || connectedWalletAddress) {
      if (swapType === SWAP_TYPE.BBDX_TO_BDX) {
        onNext(address, amount);
      } else if (swapType === SWAP_TYPE.BDX_TO_BBDX) {
        onNext(connectedWalletAddress, "");
      }
    }
  };
  const handleAddressChanged = (event) => {
    const newValue = event.target.value.replace(/[^A-Za-z0-9]/g, "");
    setAddress(newValue);
  };

  const handleAmountChanged = (event) => {
    const feeAmount = info?.fees?.bdx / 1e9 || 0;
    const value = event.target.value;

    if (feeAmount >= parseFloat(value)) {
      setAmountError("Entered amount should be greater than the swap fee.");
    } else {
      setAmountError("");
    }

    // Use a regular expression to allow numbers, including integers and floats
    const newValue = value.replace(/[^0-9.]/g, "");

    // Ensure that there's only one decimal point
    const decimalCount = newValue.split(".").length - 1;
    if (decimalCount > 1) {
      return;
    }

    setAmount(newValue);
  };

  const handleSwapTypeChanged = (value) => {
    if (swapType !== value) {
      setAddress("");
      setAmount(0);
    }
    onSwapTypeChanged(value);
    setSwapType(value);
    dispatch(getBalance);
  };

  const getAddressType = () => {
    return swapType === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;
  };

  const addressTruncateFn = (str) => {
    if (str && str.length > 30) {
      return str.substr(0, 7) + "..." + str.substr(str.length - 5, str.length);
    }
    return str;
  };

  const addressType = getAddressType();
  const inputLabel =
    addressType === TYPE.BDX ? t("bdxAddress") : t("bnbAddress");
  const inputPlaceholder = addressType === TYPE.BDX ? "BDX..." : "Please connect your wallet";
  const url = walletCreationUrl["bnb"];
  return (
    <Grid2 item xs={12} sx={styles.root}>
      {!connectedWalletAddress ? (
        <button className="connectButton" onClick={connectWalletPopup}>
          Connect Wallet
        </button>
      ) : (
        <Box
          sx={{
            borderRadius: "10px",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Box
            sx={{
              padding: "20px",
              background: "rgb(41,41,57)",
              alignItems: "center",
              borderRadius: "10px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Avatar
                  sx={{ width: 24, height: 24 }}
                  src={selectedWallet === "Binance"  ? binance :selectedWallet==='Trust Wallet'?trustwallet: selectedWallet ==='WalletConnect'? walletConnect : metamask}
                />
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    color: "#fff",
                  }}
                  textAlign="center"
                >
                  {addressTruncateFn(connectedWalletAddress)}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  color: "rgb(152, 152, 177)",
                  border: "solid 1px rgb(58,58,80)",
                  background: "rgb(41,41,57)",
                  borderRadius: "10px",
                  "&:hover": {
                    border: "solid 1px #fff",
                    background: "rgb(41,41,57)",
                    color: "#fff",
                  },
                }}
                onClick={disconnet}
              >
                Disconnect
              </Button>
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "15px",
                  color: "primary.main",
                }}
              >
                Balance
              </Typography>
              <Typography
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: "28px",
                  lineHeight: "1",
                  paddingTop: "5px",
                  color: "text.secondary",
                }}
              >
                {connectedWalletBalance}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Grid2 item xs={12} sx={styles.swapTabs}>
        <Swaptabs
          handleChange={(val) => handleSwapTypeChanged(val)}
          connectToMetaMask={connectToMetaMask}
        />
      </Grid2>

      <Grid2 item xs={12}>
        <Input
          
          fullWidth
          label={inputLabel}
          placeholder={inputPlaceholder}
          value={addressType === "bnb" && connectedWalletAddress ? connectedWalletAddress : address}
          error={addressError}
          type="text"
          onChange={handleAddressChanged}
          disabled={loading}
        />
        {addressType === "bdx" && (
          <>
            <Input
              fullWidth
              label={t("amount")}
              placeholder={t("amount")}
              value={amount}
              type="text"
              onChange={handleAmountChanged}
              disabled={loading}
              error={amountError}
            />
            <Typography sx={styles.amountError}>{amountError}</Typography>
          </>
        )}
        <Typography sx={styles.swapFee}>
          {t("swapFee", {
            amount: info?.fees?.bdx / 1e9 || 0,
          })}
        </Typography>
      </Grid2>

      <Grid2 item xs={12} align="right" sx={styles.button}>
        <StyledButton
          fullWidth
          label="Next"
          loading={loading}
          disabled={
            addressType === "bdx"
              ? !address ||
                (info?.fees?.bdx / 1e9 || 0) >= amount ||
                amount === "."
              : !connectedWalletAddress
          }
          onClick={handleNext}
        />
      </Grid2>

      {addressType === "bdx" && (
        <>
          <Typography
            className="contract-address"
            sx={{ ...styles.wbdxAddressTitle, marginTop: "10px" }}
          >
            {t("con_address")} :
          </Typography>
          <Typography sx={styles.wbdxAddress}>
            {process.env.VITE_CONTRACT_ADDR}
          </Typography>
        </>
      )}

      <Typography sx={{ ...styles.createAccount, marginTop: "20px" }}>
        <Link sx={styles.viewLink} href={url} target="_blank" rel="noreferrer">
          {t("viewBscscan")}
        </Link>
      </Typography>

      {loginOpen && (
        <div className="warningText">
          <p>
            {t("maximumLimitReached")}
            <br />
            {t("buyBBDX")}
            <a
              href="https://testnet.binance.org/en/trade/mini/175-0B3M_BNB"
              style={{ color: "#67d040", textAlign: "center" }}
            >
              {t("binanceDex")}
            </a>
          </p>
        </div>
      )}
    </Grid2>
  );
}

SwapSelection.propTypes = {
  swapType: PropTypes.string,
  onSwapTypeChanged: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  connectedWalletAddress: PropTypes.string,
  connectWalletPopup: PropTypes.func,
  selectedWallet: PropTypes.string,
  disconnet: PropTypes.func,
  connectedWalletBalance: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  connectToMetaMask: PropTypes.func,
  totalSupply: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  movedBalance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  info: PropTypes.object,
};

export default SwapSelection;
