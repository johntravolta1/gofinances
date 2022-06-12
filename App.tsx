import 'react-native-gesture-handler';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR'
import React from 'react';
import { Dashboard } from './src/screens/Dashoboard';
import {ThemeProvider } from 'styled-components'
import theme from './src/global/styles/theme'
import {useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold} from '@expo-google-fonts/poppins'
import AppLoading from 'expo-app-loading';
import { Register } from './src/screens/Register';
import { CategorySelect } from './src/screens/CategorySelect';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/routes/app.routes';
import { LoadContainer } from './src/screens/Dashoboard/styles';
import { ActivityIndicator, StatusBar } from 'react-native';
import { SignIn } from './src/screens/SignIn';
export default function App() {



  const [fontsLoaded] = useFonts({
    Poppins_400Regular, Poppins_500Medium, Poppins_700Bold
  })

  if(!fontsLoaded) {
    return (
      <LoadContainer>
        <ActivityIndicator color={theme.colors.primary} size='large'/>
      </LoadContainer> 
      )
  }


  return (
    <ThemeProvider theme={theme}>

      <NavigationContainer>
        <StatusBar barStyle='light-content'></StatusBar>
        {/* <AppRoutes/> */}
        <SignIn></SignIn>
      </NavigationContainer>

    </ThemeProvider>

  );
}