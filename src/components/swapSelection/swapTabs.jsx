import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';

export default function SwapTabs({ handleChange }) {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const handleTabChange = async (event, newValue) => {
    setValue(newValue);
    
    if (newValue === 0) {
      handleChange('bdx_to_bbdx');
    }
    
    if (newValue === 1) {
      handleChange('bbdx_to_bdx');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          display: 'flex',
          flexGrow: 1,
          backgroundColor: '#1C1C26',
          borderRadius: '10px',
          maxWidth: 'unset',
          boxShadow: 'none',
        }}
      >
        <Tabs
          value={value}
          onChange={handleTabChange}
          sx={{
            display: 'flex',
            flexGrow: 1,
            borderRadius: '18px',
            border: '1px solid #393954',
            background: '#1F1F2E',
            padding: '5px',
            maxWidth: 'unset',
            marginTop: '15px',

            '& .MuiTab-root': {
              background: '#1F1F2E',
              width: '50%',
              height: '45px',
              fontWeight: 500,
              margin: '0px',
              fontSize: '1rem',
              maxWidth: 'unset',
              textTransform: 'none',
              color: '#AFAFBE',
            },

            '& .MuiTab-root.Mui-selected': {
              borderRadius: '12px',
              background: '#282837',
              opacity: 1,
              color: '#fff',
            },

            '& .MuiTabs-indicator': {
              display: 'none',
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {value === 0 && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#00AD07',
                      borderRadius: '20px',
                      marginRight: '8px',
                    }}
                  />
                )}
                {t('bdxTowBDX')}
              </Box>
            }
          />
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {value === 1 && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#00AD07',
                      borderRadius: '20px',
                      marginRight: '8px',
                    }}
                  />
                )}
                {t('wBDXToBDX')}
              </Box>
            }
          />
        </Tabs>
      </AppBar>
    </Box>
  );
}
