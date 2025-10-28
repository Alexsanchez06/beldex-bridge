import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Snackbar, Swap, ImageLoader } from "@components";
import theme from "@theme";
import { useDispatch, useSelector } from "react-redux";
import {getBalance} from './store/swapReducer';
import {selectBalance}from './store/swapSelector'


export default function App() {
  const dispatch=useDispatch();

  const [snackbar, setSnackbar] = useState({
    message: null,
    variant: "success",
    open: false,
  });
  // const [balance, setBalance] = useState("");

  const balance=useSelector(selectBalance);

  useEffect(() => {
    // Fetch balance on mount
    dispatch(getBalance());
  }, []);

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

  // Background Image with Lazy Loading
  const BackgroundImage = () => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <div id="background" ref={ref}>
        {inView && (
          <ImageLoader
            className="backgroundImage"
            loadedClassName="backgroundImageLoaded"
            src="/images/background.png"
            alt="Background"
          />
        )}
      </div>
    );
  };

  // Title Image with Lazy Loading
  const TitleImage = () => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <Box
        display="flex"
        className="title"
        justifyContent="flex-start"
        alignSelf="baseline"
        ref={ref}
      >
        {inView && (
          <div className="titleContainer">
            <ImageLoader
              className="titleImage"
              loadedClassName="titleImageLoaded"
              src="/images/logo.png"
              alt="Logo"
            />
          </div>
        )}
      </Box>
    );
  };

  // Calculate balance display values
  let bal = 0;
  let total = 0;

  if (balance && balance.length > 0) {
    bal = Number(parseFloat(balance[0].movedBalance).toFixed(2)).toLocaleString(
      "en",
      { minimumFractionDigits: 2 }
    );
    total = Number(parseFloat(balance[0].totalSupply).toFixed(2)).toLocaleString(
      "en",
      { minimumFractionDigits: 2 }
    );
  }

  return (
    <ThemeProvider theme={createTheme(theme)}>
      <CssBaseline />
      <BackgroundImage />
      <div id="content">
        <TitleImage />
        <div className="d-flex-center">
          <Swap
            showMessage={showMessage}
            movedBalance={bal}
            totalSupply={total}
          />
          <Snackbar
            message={snackbar.message}
            open={snackbar.open}
            onClose={closeMessage}
            variant={snackbar.variant}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}
