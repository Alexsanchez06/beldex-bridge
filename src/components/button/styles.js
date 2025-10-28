const styles = {
  root: {
    width: '60%',
    margin: 'auto',
    position: 'relative',
  },
  button: {
    minWidth: '100px',
    fontWeight: 600,
    border: 'none',
    transition: 'all 0.2s ease-in-out',
    padding: '0.8rem 2.5rem',
    letterSpacing: '0.03em',
    fontSize: '14px',
    backgroundColor: '#20c128',
    color: 'white',
    textTransform: 'capitalize',
    borderRadius: '40px',
    marginTop: '20px',
    '&:hover': {
      backgroundColor: '#198c1e',
      color: '#fff',
      border: 'none',
    },
   '&.Mui-disabled': {
      backgroundColor: '#242433',
      color: 'rgba(255, 255, 255, 0.7)',
      border: '1px solid #00AD07'
    }

  },
  secondary: {
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: 'secondary.main',
    color: 'secondary.main',
    '&:hover': {
      backgroundColor: 'secondary.main',
      color: '#fff',
    },
  },
  buttonProgress: {
    color: 'white',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-12px',
    marginLeft: '-12px',
  },
};

export default styles;
