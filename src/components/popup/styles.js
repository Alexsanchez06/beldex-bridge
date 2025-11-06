const styles = {
  root: {
    maxWidth: '700px',
    background: '#1F1F2E',
  },
  title: {
    backgroundColor: '#1F1F2E',
    color: 'white',
    width: '380px',
    textAlign: 'center',
    padding: '25px 24px 4px',
    '& .MuiTypography-root': {
      fontSize: '1.3rem !important',
      marginBottom: '0 !important',
    },
  },
  closeBtn: {
    padding: 0,
    minWidth: 0,
    position: 'relative',
    top: '-20px',
    right: '-42px',
  },
  wallet: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '10px',
    border: '1px solid #393954',
    width: '100%',
    padding: '10px 20px',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#282837',
    },
  },
};

export default styles;
