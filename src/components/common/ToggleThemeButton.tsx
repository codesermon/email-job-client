'use client'
import React from 'react'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useColorScheme } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';


export const ToggleThemeButton = () => {
    const { mode, setMode } = useColorScheme();

    return (
      <ToggleButtonGroup
        color="success"
        value={mode}
        exclusive
        size='small'
        onChange={(ev: any, value: any) =>{
          setMode(value);
        }}
        aria-label="Toggle Theme"
      >
        <ToggleButton value="system" size='small'>
          <SettingsBrightnessOutlinedIcon />
        </ToggleButton>
        <ToggleButton value="light" size='small'>
          <LightModeOutlinedIcon />
        </ToggleButton>
        <ToggleButton value="dark" size='small'>
          <DarkModeOutlinedIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    );
}

export default ToggleThemeButton