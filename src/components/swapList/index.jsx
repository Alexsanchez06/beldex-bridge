import React from 'react';
import PropTypes from 'prop-types';
import TimeAgo from 'timeago-react';
import dateformat from 'dateformat';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { useTranslation } from 'react-i18next';
import config from '@config';
import { SWAP_TYPE, TYPE } from '@constants';
import { styles } from './styles';
import Pending from './pending.svg';
import Completed from './completed.svg';
import EmptyTransaction from './no_transaction.svg';

const hashUrls = {
  [TYPE.BDX]: config.beldex.txExplorerUrl,
  [TYPE.BNB]: config.binance.txExplorerUrl,
};

function SwapList({ swaps }) {
  const { t } = useTranslation();

  const renderTime = (created) => {
    const now = Date.now();
    const timestamp = Date.parse(created);
    const diff = Math.abs(now - timestamp);
    const dayMs = 24 * 60 * 60 * 1000;
    const showFullDate = diff > dayMs;

    if (showFullDate) {
      const formatted = dateformat(timestamp, 'dd/mm/yyyy');
      return <Typography sx={styles.time}>{formatted}</Typography>;
    }

    return <TimeAgo style={styles.time} datetime={timestamp} />;
  };

  const renderHash = (type, txHash, transferTxHashes, created) => {
    console.log('type, txHash, transferTxHashes, created -->',type, txHash, transferTxHashes, created)
    const hasTransferHashes =transferTxHashes && transferTxHashes?.length > 0;
    const depositHashType = type === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BDX : TYPE.BNB;
    const transferHashType = type === SWAP_TYPE.BDX_TO_BBDX ? TYPE.BNB : TYPE.BDX;
    const hashType = hasTransferHashes ? transferHashType : depositHashType;
    const baseUrl = hashUrls[hashType];
    const hashes = hasTransferHashes ? transferTxHashes : [txHash];

    const hashItems = hashes.map((hash) => {
      const url = `${baseUrl}${hash}`;
      return (
        <Typography key={hash} sx={styles.hash}>
          <Link href={url} target="_blank" rel="noreferrer">
            {hash}
          </Link>
        </Typography>
      );
    });

    if (transferTxHashes?.length === 0) {
      return (
        <Box sx={styles.hashBox}>
          <Typography sx={styles.hashTitle}>
            {t('depositTransactionHash')}
          </Typography>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            sx={styles.TxDetails}
          >
            <Typography sx={styles.hashes}>{hashItems[0]}</Typography>
            <Typography sx={{ textAlign: 'right' }}>
              {renderTime(created)}
            </Typography>
          </Box>
        </Box>
      );
    }

    const swapTitle =
      transferTxHashes?.length === 1
        ? t('swapTransactionHash')
        : t('swapTransactionHashes');

    return (
      <Box sx={styles.hashBox}>
        <Typography sx={styles.hashTitle}>{swapTitle}</Typography>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={styles.TxDetails}
        >
          <Typography sx={styles.hashes}>{hashItems}</Typography>
          <Typography sx={{ textAlign: 'right' }}>
            {renderTime(created)}
          </Typography>
        </Box>
      </Box>
    );
  };

  const renderSwapItem = ({
    uuid,
    type,
    amount,
    txHash,
    transferTxHashes,
    created,
    unconfirmed,
  }) => {
    const isPending = transferTxHashes && transferTxHashes?.length === 0;
    const depositCurrency = type === SWAP_TYPE.BDX_TO_BBDX ? 'BDX' : 'BDX-BSC';
    const displayAmount = amount / 1e9;

    let status = 'Completed';
    if (isPending) {
      status = unconfirmed ? t('waitingForConfirmations') : t('pending');
    }

    return (
      <Grid item xs={12} key={uuid}>
        <Box sx={styles.item}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            sx={styles.txnStatusHeader}
          >
            <Typography sx={styles.amount}>
              {displayAmount} {depositCurrency}
            </Typography>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
            >
              <Typography
                sx={{
                  ...(isPending ? styles.pending : styles.completed),
                  padding: '0px 3px 0px',
                }}
              >
                {status}
              </Typography>
              <img
                alt=""
                src={isPending ? Pending : Completed}
                style={styles.statusImg}
              />
            </Box>
          </Box>
          {renderHash(type, txHash, transferTxHashes, created)}
        </Box>
      </Grid>
    );
  };

  const renderSwaps = () => {
    if (!swaps || swaps.length === 0) {
      return (
        <Box>
          <Box sx={styles.emptyTxnWrapper}>
            <img alt="" src={EmptyTransaction} />
            <Typography sx={styles.emptyTitle}>
              {t('noTransactions')}
            </Typography>
          </Box>
        </Box>
      );
    }

    return swaps.map(renderSwapItem);
  };

  return (
    <Grid item xs={12} sx={styles.root}>
      <Grid container direction="column" spacing={1}>
        {renderSwaps()}
      </Grid>
    </Grid>
  );
}

SwapList.propTypes = {
  swaps: PropTypes.array,
};

export default SwapList;
