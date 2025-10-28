import React, { useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Web3 from "web3";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { Warning } from "@utils/error";
import { SWAP_TYPE, TYPE } from "@constants";
import SwapSelection from "../swapSelection";
import SwapInfo from "../swapInfo";
import SwapList from "../swapList";
import Popup from "../popup";
import matrixAbi from "../../matrixAbi";
import styles from "./styles";
import { makeStyles } from "@mui/styles";

// Redux thunks & selectors (bring these from your swapSlice)
import {
  getInfo,
  getSwaps,
  swapToken,
  finalizeSwapToken,
  sendTransactionHash,
  getUnconfirmedBeldexTxs
} from "../../store/swapReducer";
import {
  selectInfo,
  selectSwaps,
  selectBalance,
  selectUnconfirmedBeldexTxs,
  selectSwapError,
  selectSwapLoading,
  selectswapResult,
} from "../../store/swapSelector";

const currencySymbols = {
  [TYPE.BDX]: "BDX",
  [TYPE.BNB]: "wBDX",
};

function Swap({ showMessage }) {
  const useStyles = makeStyles(styles);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Redux-backed data
  const info = useSelector(selectInfo);
  const swaps = useSelector(selectSwaps);
  const totalbalance = useSelector(selectBalance);
  const unconfirmed = useSelector(selectUnconfirmedBeldexTxs);
  const loading = useSelector(selectSwapLoading);
  const error = useSelector(selectSwapError);
  const swapResult = useSelector(selectswapResult);
  let web3Obj = new Web3(window.ethereum);
  let  contract = new web3Obj.eth.Contract(
    matrixAbi.abi,
    // process.env.REACT_APP_CONTRACT_ADDR
    '0x2BE10C60ce001e7aA4b86332775e0a9d6f75f31f'
  );

  console.log(
   'swapResultswapResult -->',swapResult,'swaps -->',swaps
  );

  // Local UI/wallet state
  const [walletAddress, setWalletAddress] = useState("");
  const [page, setPage] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [swapType, setSwapType] = useState(SWAP_TYPE.BDX_TO_BBDX);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [swapInfo, setSwapInfo] = useState({});
  const [walletConnBin, setWalletConnBin] = useState(false);
  const [walletConnMeta, setWalletConnMeta] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState("");
  const [connectedWalletBalance, setConnectedWalletBalance] = useState("");
  const handleBack = useCallback(() => setPage(0), [setPage]);
  console.log("swapselection 1");
  // INITIAL LOAD: Info and Swaps
  useEffect(() => {
    console.log("swapselection 2");
    dispatch(getInfo());
    console.log("swapselection 3");
    dispatch(getSwaps());
    console.log("swapselection 4");
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      if (error instanceof Warning) {
        showMessage(error.message, "warning");
      } else {
        showMessage(error.toString(), "error");
      }
    }
  }, []);

  // Merge unconfirmed & swaps like your original renderTransactions
  const mergedSwaps = useMemo(() => {
    if (swapType !== SWAP_TYPE.BDX_TO_BBDX) return swaps;
    const unconfirmedSwaps = (unconfirmed || []).map(
      ({ hash, amount, created }) => ({
        uuid: hash,
        type: SWAP_TYPE.BDX_TO_BBDX,
        amount,
        txHash: hash,
        transferTxHashes: [],
        created,
        unconfirmed: true,
      })
    );
    const validSwap = swaps || [];
    console.log(
      "swapsswapsswaps -->",
      swaps,
      [...unconfirmedSwaps, swaps],
      validSwap
    );

    return [...unconfirmedSwaps, validSwap];
  }, [unconfirmed, swaps, swapType]);

  // Wallet connect, transaction logic remains in local functions/useCallback (can add here)
  const mobileCheck = () => {
    if (
      typeof navigator !== "undefined" &&
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      return true;
    }
    return false;
  };
  const connectToMetaMask = async () => {
    console.log("closeConsole7");
    console.log("connectToMetaMask -->");

    let mobileView = await mobileCheck();
    const provider = window.ethereum;
    // const binanceChainId = process.env.REACT_APP_CHAINID;
    const binanceChainId = "0x61";

    console.log("connectToMetaMask 2-->");
    console.log("closeConsole8");
    if (!mobileView && !window.ethereum.isMetaMask) {
      console.log("closeConsole9");

      return props.showMessage(t("MetaMask is not installed."), "error");
    }
    const web3Obj = new Web3(window.ethereum);
    console.log("connectToMetaMask 3-->", web3Obj);
    console.log("closeConsole10");
    // alert(web3Obj)
    try {
      console.log("connectToMetaMask ::1");
      window.ethereum.enable();
      console.log("connectToMetaMask 4-->", web3Obj);

      if (web3Obj) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        console.log("chainId:", chainId, "binanceChainId -->", binanceChainId);
        if (chainId === binanceChainId) {
          console.log("Bravo!, you are on the correct network");
        } else {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: binanceChainId }],
            });
          } catch (switchError) {
            console.log("switchError ::", switchError);
            //  alert(JSON.stringify(switchError.code))
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902 || switchError.code === -32603) {
              if (mobileCheck()) {
                props.showMessage(
                  `Please add the Binance smart chain to your wallet.`,
                  "error"
                );
              }
              try {
                await provider.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainId: binanceChainId,
                      chainName: "BNB Chain Testnet",
                      rpcUrls: [
                        "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
                      ],
                      blockExplorerUrls: ["https://testnet.bscscan.com"],
                      nativeCurrency: {
                        symbol: "tBNB", // 2-6 characters long
                        decimals: 18,
                      },
                    },
                  ],
                });
              } catch (addError) {
                // handle "add" error
                console.log("error:", addError);
              }
            }
          }
        }
        console.log("connectToMetaMask 6-->", web3Obj);

        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = account[0] || null;
        setWalletAddress(address);
        getBalance(address);
        console.log("addressaddressaddressaddress:::", address);

        //   let address = setInterval(() => {
        //     console.log('connectToMetaMask 6.2-->','errerr -->',)
        //     web3Obj.eth.getCoinbase((err, res) => {
        //       console.log('connectToMetaMask 6.1-->',res,'errerr -->',err)
        //       if (res) {
        // console.log('connectToMetaMask 7-->',res)

        //          setWalletConnMeta(true)

        //         contract = new web3Obj.eth.Contract(
        //           matrixAbi.abi,
        //           process.env.REACT_APP_CONTRACT_ADDR
        //         );
        //         clearInterval(address);
        //         console.log('getAddress -->',mobileView ? res[0] : res )
        //          setWalletAddress(mobileView ? res[0] : res );
        //         getBalance(mobileView ? res[0] : res)
        //         window.ethereum.on("accountsChanged", async (accounts) => {
        // console.log('connectToMetaMask 8-->',accounts)

        //           const address = accounts[0] || null;
        //           setWalletAddress( address);
        //         });
        //       }
        //     });
        //   }, 500);
      }
    } catch (error) {
      return false;
    }
  };
  const connectToMetamaskMobile = async () => {
    // if (mobileCheck()) {
    //   console.log("mobileCheck ::");
    if (
      typeof navigator !== "undefined" &&
      /MetaMaskMobile/i.test(navigator.userAgent)
    ) {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (account) connectToMetaMask();
    } else {
      const dappUrl = window.location.href.split("//")[1].split("/")[0];
      const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;
      window.open(metamaskAppDeepLink, "_self");
    }
    // }
  };
  const connectToBinance = async () => {
    let mobileView = await mobileCheck();
    web3Obj = new Web3(window.ethereum);
    try {
      if (!mobileView && !window.ethereum.isMetaMask) {
        return props.showMessage(
          props.t("Trustwallet is not installed."),
          "error"
        );
      }
      await window.ethereum.enable();
      if (web3Obj) {
        setWalletConnBin(true);

        const BSC_TESTNET_PARAMS = {
          chainId: "0x61", // 97 in hex
          chainName: "Binance Smart Chain Testnet",
          nativeCurrency: {
            name: "Binance Coin",
            symbol: "tBNB",
            decimals: 18,
          },
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
          blockExplorerUrls: ["https://testnet.bscscan.com/"],
        };

        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = account[0] || null;

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        if (chainId !== "0x61") {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: BSC_TESTNET_PARAMS.chainId }],
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [BSC_TESTNET_PARAMS],
              });
            } else {
              console.error(switchError);
            }
          }
        }
        getBalance(address);
        contract = new web3Obj.eth.Contract(
          matrixAbi.abi,
          process.env.REACT_APP_CONTRACT_ADDR
        );
        setWalletAddress(mobileView ? address[0] : address);
        window.BinanceChain.on("accountsChanged", async (accounts) => {
          const address = accounts[0] || null;
          setWalletAddress(mobileView ? address[0] : address);
        });
        window.ethereum.on("chainChanged", () => window.location.reload());
      }
    } catch (error) {
      return false;
    }
  };
  async function connectToTrustWallet() {
    // alert("trust")
    // if (mobileCheck()) {
    //   console.log("mobileCheck ::");
    // alert(window.ethereum.isTrust)
    if (window?.ethereum?.isTrust) {
      // if (window.ethereum) {

      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      //  const chainId = await window.ethereum.request({
      //   method: "eth_chainId",
      // });
      // console.log("chainId:",chainId)
      console.log("account:", account);
      if (account) connectToBinance();
    } else {
      const trustWalletLink =
        "https://link.trustwallet.com/open_url?coin_id=60&url=" +
        window.location.href;
      // const TRUST_URL =
      //   "https://links.trustwalletapp.com/a/key_live_lfvIpVeI9TFWxPCqwU8rZnogFqhnzs4D?&event=openURL&url=";
      // const currentURI = window.location.href;
      // const deepLink = `${TRUST_URL}${encodeURIComponent(currentURI)}`;
      window.open(trustWalletLink, "_self");
    }
    // }
  }
  const makeTransaction = () => {
    let amountToWei = amount * 1e9;
    const options = {
      from: walletAddress,
      to: contract._address,
      data: contract.methods.burn(amountToWei.toString()).encodeABI(),
      value: 0x0,
    };
    web3Obj.eth
      .sendTransaction(options)
      .on("confirmation", (confirmationNumber, receipt) => {
        const timestamp = Math.floor(new Date().getTime() / 1000.0);
        if (confirmationNumber === 0) {
          const reqObj = {
            uuid: swapInfo.uuid,
            amount: amount,
            timestamp: timestamp,
            memo: swapInfo.memo,
            hash: receipt.transactionHash,
          };
          dispatch(sendTransactionHash(reqObj));
        }
      })
      .on("error", (error) => {
        dispatch(
          sendTransactionErrorLog({
            reqObj: { ...options, error: error?.code ? error : error.message },
          })
        );
        if (error?.code === 4001) {
          props.showMessage(props.t("transactionSignatureError"), "error");
        } else {
          props.showMessage(error, "error");
        }
      });
  };
  const swapTypeChanged = async (swapType) => {
    setSwapType(swapType);

    async () => {
      if (swapType === SWAP_TYPE.BBDX_TO_BDX) {
        // if (walletAddress === "" && window.innerWidth > 720) {
        if (mobileCheck()) {
          detectAndConnectMobileWallet();
        } else if (walletAddress === "") {
          // if (walletAddress === "")
          setShowPopup(!showPopup);
        }
      }
    };
  };
  const detectAndConnectMobileWallet = async () => {
    const isMetaMaskMobile =
      typeof navigator !== "undefined" &&
      /MetaMaskMobile/i.test(navigator.userAgent);
    const isTrustWallet = window?.ethereum?.isTrust;
    if (isMetaMaskMobile) {
      connectToMetamaskMobile();
    } else if (isTrustWallet) {
      connectToTrustWallet();
    } else if (walletAddress === "") {
      setShowPopup(!showPopup);
    }
  };
  const connectWalletPopup = () => {
    setShowPopup(!showPopup);
  };
  const getBalance = async (address) => {
    // const web3Obj = new Web3(window.ethereum);
    //   const balance = await web3Obj.eth.getBalance(address, (err, wei) => { });
    const web3 = new Web3(window.ethereum);

    // Get balance in Wei
    const balance = await web3.eth.getBalance(address);
    console.log("balance  -->", balance);
    // const result = await contract.methods
    //       .balanceOf(walletAddress)
    //       .call();
    //       console.log("result:",result)
    const currentBal = Math.floor((Number(balance) / 1e18) * 10000) / 10000;
    setConnectedWalletAddress(address);
    setConnectedWalletBalance(currentBal);
    console.log("getBalance ::", currentBal);
  };
  const disconnetWallet = async () => {
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
  };
  const handlePopupClose = (value) => {
    console.log("closeConsole3", value);
    setShowPopup(!showPopup);
    setSelectedWallet(value);
    if (value === "Binance" || value === "Trust Wallet") {
      if (mobileCheck()) {
        console.log("closeConsole7  ", value);
        connectToTrustWallet();
      } else {
        connectToBinance();
      }
      // connectToBinanceWallet();
    } else if (value === "Metamask") {
      // let isMetamaskMobileBrowser =
      //   typeof navigator !== "undefined" &&
      //   /MetaMaskMobile/i.test(navigator.userAgent);
      // if (mobileCheck() && !isMetamaskMobileBrowser) {
      //   const dappUrl = window.location.href.split("//")[1].split("/")[0];
      //   const metamaskAppDeepLink =
      //     "https://metamask.app.link/dapp/" + dappUrl;
      //   window.open(metamaskAppDeepLink, "_self");
      // } else {
      //   const account = await window.ethereum.request({
      //     method: "eth_requestAccounts",
      //   });
      //   if (account) connectToMetaMask();
      // }
      console.log("closeConsole4", value);
      if (mobileCheck()) {
        connectToMetamaskMobile();
      } else {
        console.log("closeConsole5", value);
        connectToMetaMask();
      }
    }
  };

  const transactionsInfo = (transaction) => {
    this.props.showMessage(this.props.t("transactionSuccess"), "success");
  };
  const onUnconfirmedTransactionsFetched = (transactions) => {
    // setUnconfirmed( transactions);
  };
  const onSwapsFetched = (swaps) => {
    // this.setState({ swaps, loading: false });
  };
  const onTokenSwapped = async () => {
    // this.setState({ swapInfo, page: 1 }, async () => {
    // const { walletAddress, swapType, amount, selectedWallet } = this.state;
 console.log('swapType === SWAP_TYPE.BBDX_TO_BDX -->',swapType === SWAP_TYPE.BBDX_TO_BDX,connectedWalletAddress)
    if (swapType === SWAP_TYPE.BBDX_TO_BDX && connectedWalletAddress) {
      const result = await contract.methods
        .balanceOf(connectedWalletAddress)
        .call();
        console.log('resultresult -->',result)
      const balance = Number(result) / 1e9;
      console.log('resultresult -->',balance)
      if (swapType === SWAP_TYPE.BBDX_TO_BDX && connectedWalletAddress) {
        if (parseFloat(amount) > parseFloat(balance)) {
          // this.props.showMessage(
          //   this.props.t("exceedingBalanceWarning"),
          //   "error"
          // );
          console.log(t("exceedingBalanceWarning"))
        } else if (parseFloat(amount) > 0) {
          makeTransaction();
          console.log('makeTransaction')
        } else {
          // this.props.showMessage(this.props.t("greaterThanZeroError"), "error");
          console.log(t("greaterThanZeroError"),parseFloat(amount),amount)
        }
      } else {
        console.log(`Connect to ${selectedWallet === "" ? "Wallet" : selectedWallet}`)
        
        // this.props.showMessage(
        //   `Connect to ${selectedWallet === "" ? "Wallet" : selectedWallet}`,
        //   "error"
        // );
      }
    }
    // });
    setImmediate(() =>  dispatch(getSwaps()));
    setImmediate(() => dispatch(getUnconfirmedBeldexTxs()))
    // setImmediate(() => this.getUnconfirmedTransactions());
    // setImmediate(() => this.getSwaps());
  };
  // NEXT ACTION (after selecting wallet/address/amount)
  const handleNext = async (selAddress, selAmount) => {
    // setAddress(selAddress);
    // setAmount(selAmount);
    // Gas check logic as before...
    dispatch(swapToken({ type: swapType, address: selAddress }));
    onTokenSwapped();
    setPage(1);
  };

  const handleFinalizeSwap = useCallback(() => {
    dispatch(finalizeSwapToken({ uuid: swapInfo.uuid }));
  }, [dispatch, swapInfo]);
  console.log("swapselection 5");
  // For rendering the transaction list

  const renderTransactions = useCallback(
    () => (
      <Grid className={classes.swapList}>
        <Box
          display="flex"
          flexDirection="column"
          className={classes.section}
          sx={{ pt: 0 }} // Replacing inline style with sx prop
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ height: "71px" }}
          >
            <Typography className={classes.transactionTitle}>
              {t("transactions")}
            </Typography>
          </Box>
          <Grid className={classes.sectionSwap} item xs={12}>
            <SwapList swaps={mergedSwaps} />
          </Grid>
        </Box>
      </Grid>
    ),
    [classes, mergedSwaps, t]
  );

  // Selection page

  const renderSelection = useCallback(
    (totalSupply, movedBalance) => {
      console.log("renderSelection called");
      return (
        <Grid container className={classes.registerWrapper}>
          <Grid size={{ xs: 12, md: 5 }}>
            <div className={classes.leftPane}>
              {console.log("renderSelection subsection 1")}
              <p className="appName">
                <span className="beldexName">Beldex</span> Bridge
              </p>
              <p className="app-left-content">{t("beldexBridgeInfo")}</p>
            </div>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <div className={classes.rightPaneWrapper}>
              <SwapSelection
                swapType={swapType}
                info={info}
                totalSupply={totalSupply}
                movedBalance={movedBalance}
                onSwapTypeChanged={setSwapType}
                onNext={handleNext}
                loading={loading}
                connectToMetaMask={() => {
                  connectToMetaMask();
                }}
                connectWalletPopup={() => setShowPopup(true)}
                connectedWalletAddress={connectedWalletAddress}
                connectedWalletBalance={connectedWalletBalance}
                selectedWallet={selectedWallet}
                setAmount={e=>setAmount(e)}
                amount={amount}
                disconnet={() => {
                  setConnectedWalletAddress("");
                  setConnectedWalletBalance("");
                }}
              />
              {console.log("renderSelection subsection 4")}
            </div>
            <Popup
              selectedValue={selectedWallet}
              open={showPopup}
              onClose={(v) => {
                handlePopupClose(v);
                console.log("closeConsole2", v);
              }}
            />
            {console.log("renderSelection subsection 5")}
          </Grid>
        </Grid>
      );
    },
    [
      classes,
      t,
      swapType,
      info,
      setSwapType,
      handleNext,
      loading,
      connectedWalletAddress,
      connectedWalletBalance,
      selectedWallet,
      setShowPopup,
      handlePopupClose,
    ]
  );

  // Info page
  const renderInfo = useCallback(
    (movedBalance, totalSupply) => {
      console.log("renderInfo called");

      return (
        <Box className={classes.dashBoard}>
          <Typography
            sx={{ cursor: "pointer" }}
            className={classes.backBox}
            onClick={() => window.location.reload()}
          >
            {/* SVG left arrow */}
            <svg
              width="20"
              height="20"
              className={classes.backImg}
              viewBox="0 0 24 24"
            >
              <path d="M12 0.333344C5.55641 0.333344 0.333374 5.55638 0.333374 12C0.333374 18.4436 5.55641 23.6667 12 23.6667C18.4437 23.6667 23.6667 18.4436 23.6667 12C23.6667 5.55638 18.4437 0.333344 12 0.333344ZM16.6667 13.1667H10.1498L12 15.0169C12.455 15.4719 12.455 16.2117 12 16.6667C11.5451 17.1216 10.8053 17.1216 10.3503 16.6667L6.5085 12.8249C6.05239 12.3688 6.05239 11.6301 6.5085 11.1751L10.3503 7.33334C10.8053 6.87837 11.5451 6.87837 12 7.33334C12.455 7.78831 12.455 8.52811 12 8.98308L10.1498 10.8333H16.6667C17.3108 10.8333 17.8334 11.3559 17.8334 12C17.8334 12.6441 17.3108 13.1667 16.6667 13.1667Z" />
            </svg>
            <Typography className={classes.backTxt}>Back</Typography>
          </Typography>

          <Grid container spacing={2} className={classes.dFlexSpacebw}>
            <Grid item size={{ xs: 12, md: 6 }} className={classes.item}>
              {console.log("renderInfo subsection 2")}
              <SwapInfo
                swapType={swapType}
                swapInfo={swapResult}
                info={info}
                selectedWallet={selectedWallet}
                onRefresh={() => {}} // memoized callback
                onBack={handleBack} // memoized callback
                connectToMetaMask={connectToMetaMask} // memoized callback
                loading={loading}
                walletConnected={
                  selectedWallet === "Binance" ? walletConnBin : walletConnMeta
                }
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }} sx={{ mt: 2 }}>
              {console.log("renderInfo subsection 3")}
              {renderTransactions()}
            </Grid>
          </Grid>
        </Box>
      );
    },
    [
      classes,
      swapType,
      swapResult,
      info,
      selectedWallet,
      loading,
      walletConnBin,
      walletConnMeta,
      handleBack,
      connectToMetaMask,
      renderTransactions,
    ]
  );

  // Main render
  // totalSupply and movedBalance should be read from info/balance selectors.
  const totalSupply = totalbalance?.totalSupply;
  const movedBalance = totalbalance?.movedBalance;
  console.log("swapselection 6", "page==", page);
  return (
    <Grid container className={classes.root} spacing={2}>
      {page === 0 && renderSelection(totalSupply, movedBalance)}
      {page === 1 && renderInfo(movedBalance, totalSupply)}
      <div className={classes.bottomSpacing}></div>
    </Grid>
  );
}

Swap.propTypes = {
  classes: PropTypes.object.isRequired,
  showMessage: PropTypes.func.isRequired,
};

export default Swap;
