import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {QRCodeCanvas} from 'qrcode.react';

import AnimateHeight from 'react-animate-height';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import CopyIcon from '../../assets/icons/CopyIcon.svg';
import { Button, Snackbar } from '@components';
import { SWAP_TYPE } from '@constants';
import { styles } from './styles';
import important from './warning.png';
import QrCodeIcon from '../../assets/icons/QrCode.svg';
import { useTheme } from '@mui/material/styles';

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
    variant: 'success',
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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(timer);
    };
  }, [onRefresh]);

  const onCopy = (id) => {
    navigator.clipboard.writeText(id);
    showMessage(t('addressCopiedSuccess'), 'success');
  };

  const toggleQR = () => {
    setShowQR(!showQR);
  };

  const showMessage = (message, variant = 'error') => {
    setSnackbar({
      message,
      variant,
      open: true,
    });
  };

  const closeMessage = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const renderQR = () => {
    const { depositAddress } = swapInfo;
    const height = showQR ? 'auto' : 0;

    return (
      <AnimateHeight duration={250} height={height}>
        <Box
          sx={{
            ...styles.qrContainer,
            width: `${qrSize + 57}px`,
            height: `${qrSize + 57}px`,
          }}
        >
          <Box sx={styles.qr}>
            <QRCodeCanvas value={depositAddress}  size={qrSize} />
          </Box>
        </Box>
        <div style={{ width: '20px', height: '2px' }}></div>
      </AnimateHeight>
    );
  };

  const renderMemo = () => {
    const { memo } = swapInfo;
    if (!memo) return null;

    return (
      <Box sx={styles.memoFrame}>
        <Typography sx={{ ...styles.warningText, color: '#000' }}>
          {t('readCarfully')}
        </Typography>
        <Typography className={`blinkAnim`} sx={{ ...styles.warningText, ...styles.red }}>
          {t('amountSentWarning')}
          <img alt="" src={important} className="blinkImg" />
        </Typography>
      </Box>
    );
  };

  const renderDepositInstructions = () => {
    const { depositAddress } = swapInfo;
    const depositCurrency = swapType === SWAP_TYPE.BDX_TO_BBDX ? 'BDX' : 'wBDX';

    return (
      <React.Fragment>
        <Typography sx={styles.instructionBold}>
          {t('transferDepositCurrency', { depositCurrency })}
        </Typography>
        <Box sx={{ borderRadius: '12px', background: '#282837' }}>
          <Box sx={styles.addressWrapper}>
            <Box id="depositAddress" sx={styles.greenBorder}>
              {depositAddress}
            </Box>
            <Box display="flex" justifyContent="center" alignContent="center">
              <Tooltip title="Copy Address" placement="left">
                <IconButton
                  onClick={() => onCopy(depositAddress)}
                  aria-label="Copy Address"
                >
                  <img alt="" src={CopyIcon} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Toggle QR" placement="right">
                <IconButton onClick={toggleQR} aria-label="Toggle QR">
                  <img alt="" src={QrCodeIcon} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          {renderQR()}
        </Box>
        {renderMemo()}
      </React.Fragment>
    );
  };

  const renderInstructions = () => {
    const beldexFee = (info?.fees?.bdx / 1e9) || 0;

    return (
      <Box className={styles.instructionContainer}>
        {swapType === SWAP_TYPE.BDX_TO_BBDX && renderDepositInstructions()}

        {swapType === SWAP_TYPE.BBDX_TO_BDX && (
          <Typography className={styles.feeInfo}>
            {t('processingFee')}
            <span style={{ color: '#3EC745' }}> {beldexFee}</span> {t('bdxCharged')}
          </Typography>
        )}

        <Box sx={styles.instructionWrapper}>
          <Typography sx={styles.noteTitle}>{t('note')}</Typography>
          {swapType === SWAP_TYPE.BDX_TO_BBDX && (
            <Typography sx={styles.instructions}>
              {t('transactionInstructions')}
            </Typography>
          )}
          <Typography sx={styles.instructions}>
            {t('swapRequest')}{' '}
            <Typography component="span">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://t.me/Beldexadmin"
                style={{ color: '#3EC745' }}
              >
                @Beldexadmin
              </a>
            </Typography>{' '}
            on telegram.
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderReceivingAmount = () => {
    if (!swapInfo?.swaps || swapInfo.swaps.length === 0) return null;

    const receivingCurrency = swapType === SWAP_TYPE.BDX_TO_BBDX ? 'wBDX' : 'BDX';
    const pendingSwaps = swapInfo.swaps.filter(
      (s) => s.transferTxHashes && s.transferTxHashes.length === 0
    );
    const total = pendingSwaps.reduce((total, swap) => total + parseFloat(swap.amount), 0);
    const displayTotal = total / 1e9;

    return (
      <Grid item xs={12} sx={styles.stats}>
        <Typography sx={styles.statTitle}>{t('pendingAmount')}:</Typography>
        <Typography sx={styles.statAmount}>
          {displayTotal} {receivingCurrency}
        </Typography>
      </Grid>
    );
  };

  return (
    <Box sx={styles.root}>
      <Grid item xs={12} sx={styles.back}>
        {swapType !== SWAP_TYPE.BDX_TO_BBDX && (
          <Box sx={styles.walletConWrapper}>
            {!walletConnected ? (
              <Typography sx={styles.walletConnErr}>
                {t('connectYourWallet')}
              </Typography>
            ) : (
              <Typography sx={styles.walletConnSucc}>
                {selectedWallet} {t('walletConnected')}
              </Typography>
            )}
          </Box>
        )}
      </Grid>

      {renderInstructions()}

      <Grid item xs={12} sx={styles.button}>
        <Button fullWidth label="Refresh" loading={loading} onClick={onRefresh} />
      </Grid>

      <Typography className="contract-address" sx={styles.wbdxAddressTitle} style={{ marginTop: '20px' }}>
        {t('con_address')}
      </Typography>
      <Typography sx={{ ...styles.wbdxAddressTitle, color: '#EBEBEB' }}>
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