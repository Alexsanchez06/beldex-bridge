import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export const Root = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    paddingBottom: theme.spacing(5),
  },
}));

export const Item = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(2.5),
  overflow: 'auto',
  height: 448,
  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(1.25),
    overflow: 'unset',
    height: 'auto',
  },
}));

export const ItemColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const SpaceBetweenRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const TxHeader = styled(Box)({
  backgroundColor: '#2E2E44',
  borderRadius: 10,
  padding: 7,
});

export const StatTitle = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  fontSize: '0.84rem',
  color: '#AFAFBE',
  fontWeight: 600,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
  },
}));

export const StatAmount = styled(Typography)(({ theme }) => ({
  color: '#EBEBEB',
  fontWeight: 600,
  fontSize: '0.94rem',
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.84rem',
  },
}));

export const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  qrContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: theme.spacing(2.5),
    margin: 'auto',
  },
  qr: {
    padding: theme.spacing(1.25),
    backgroundColor: 'white',
    borderRadius: theme.shape.borderRadius,
  },
  memoFrame: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: '#FFF3CD',
    borderRadius: theme.shape.borderRadius,
  },
  warningText: {
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  red: { color: '#dc3545' },
  instructionContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  instructionBold: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  addressWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  greenBorder: {
    flex: 1,
    padding: theme.spacing(1),
    border: '1px solid #3EC745',
    borderRadius: theme.shape.borderRadius,
    wordBreak: 'break-all',
  },
  feeInfo: {
    marginBottom: theme.spacing(2),
  },
  instructionWrapper: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    backgroundColor: '#282837',
    borderRadius: theme.shape.borderRadius * 2,
  },
  noteTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  instructions: {
    marginBottom: theme.spacing(1),
    fontSize: '0.9rem',
  },
  walletConWrapper: {
    marginBottom: theme.spacing(2),
  },
  walletConnErr: {
    color: '#dc3545',
    fontWeight: 500,
  },
  walletConnSucc: {
    color: '#3EC745',
    fontWeight: 500,
  },
  button: {
    marginTop: theme.spacing(2),
  },
  wbdxAddressTitle: {
    fontSize: '0.9rem',
    marginTop: theme.spacing(1),
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing(1),
  },
  back: {
    marginBottom: theme.spacing(2),
  },
  statTitle: {
    color: '#AFAFBE',
    fontWeight: 600,
    fontSize: '0.84rem',
  },
  statAmount: {
    color: '#EBEBEB',
    fontWeight: 600,
    fontSize: '0.94rem',
  },
});
