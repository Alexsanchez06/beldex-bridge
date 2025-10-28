export const styles = {
  success: {
    backgroundColor: '#13131B',
    border: '1px solid #3CBC43',
    borderRadius: '15px',
  },
  error: {
    backgroundColor: '#13131B',
    border: '1px solid #DC4040',
    borderRadius: '15px',
    height: '60px',
  },
  info: {
    backgroundColor: 'primary.main',
    borderRadius: '15px',
  },
  warning: {
    backgroundColor: '#13131B',
    border: '1px solid #FFBC00',
    borderRadius: '15px',
  },
  icon: {
    width: '17px',
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: '8px',
    marginTop: '0px',
  },
  contentWrapper: {
    '& .MuiSnackbarContent-message': {
      width: '90%',
    },
  },
  closeIcon: {
    position: 'absolute',
    top: '-46px',
    right: '-22px',
    backgroundColor: '#13131B',
    borderRadius: '20px',
    width: '26px',
    height: '26px',
    display: 'flex',
    '&:hover': {
      backgroundColor: '#494969',
    },
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  primaryText: {
    color: 'text.primary',
  },
  blackText: {
    color: '#000', // Replace with actual value from colors.belBlack
  },
};

export default styles;
