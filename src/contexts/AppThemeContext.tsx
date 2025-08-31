'use client'
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';


const AppThemeProvider = (props: any) => {

    const theme = createTheme({
        colorSchemes: { light: true, dark: true },
        cssVariables: {
            colorSchemeSelector: 'class'
        }
    });

    
    return (<ThemeProvider theme={theme} disableTransitionOnChange>
        <CssBaseline />
        {props.children}
    </ThemeProvider>);
}


export default AppThemeProvider