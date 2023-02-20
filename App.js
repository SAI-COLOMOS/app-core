import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useCallback } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { Provider, configureFonts } from 'react-native-paper';
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import Navigation from "./views/Navigation";

import { darkTheme, lightTheme } from "./assets/themes/themes";

SplashScreen.preventAutoHideAsync();

export default function App() {
  let dth = darkTheme
  let lth = lightTheme

  const [fontsLoaded] = useFonts({
    'Lexend-Deca': require('./assets/fonts/LexendDeca.ttf')
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      dth = {
        ...dth,
        fonts: configureFonts({config: {
          displaySmall: {
              fontFamily: "Lexend-Deca"
          },
          displayMedium: {
              fontFamily: "Lexend-Deca"
          },
          displayLarge: {
              fontFamily: "Lexend-Deca"
          },
          headlineLarge: {
              fontFamily: "Lexend-Deca"
          },
          headlineMedium: {
              fontFamily: "Lexend-Deca"
          },
          headlineSmall: {
              fontFamily: "Lexend-Deca"
          },
          titleLarge: {
              fontFamily: "Lexend-Deca"
          },
          titleMedium: {
              fontFamily: "Lexend-Deca"
          },
          titleSmall: {
              fontFamily: "Lexend-Deca"
          },
          labelLarge: {
              fontFamily: "Lexend-Deca"
          },
          labelMedium: {
              fontFamily: "Lexend-Deca"
          },
          labelSmall: {
              fontFamily: "Lexend-Deca"
          },
          bodyLarge: {
              fontFamily: "Lexend-Deca"
          },
          bodyMedium: {
              fontFamily: "Lexend-Deca"
          },
          bodySmall: {
              fontFamily: "Lexend-Deca"
          }
        }})
      }

      lth = {
        ...lth,
        fonts: configureFonts({config: {
          displaySmall: {
              fontFamily: "Lexend-Deca"
          },
          displayMedium: {
              fontFamily: "Lexend-Deca"
          },
          displayLarge: {
              fontFamily: "Lexend-Deca"
          },
          headlineLarge: {
              fontFamily: "Lexend-Deca"
          },
          headlineMedium: {
              fontFamily: "Lexend-Deca"
          },
          headlineSmall: {
              fontFamily: "Lexend-Deca"
          },
          titleLarge: {
              fontFamily: "Lexend-Deca"
          },
          titleMedium: {
              fontFamily: "Lexend-Deca"
          },
          titleSmall: {
              fontFamily: "Lexend-Deca"
          },
          labelLarge: {
              fontFamily: "Lexend-Deca"
          },
          labelMedium: {
              fontFamily: "Lexend-Deca"
          },
          labelSmall: {
              fontFamily: "Lexend-Deca"
          },
          bodyLarge: {
              fontFamily: "Lexend-Deca"
          },
          bodyMedium: {
              fontFamily: "Lexend-Deca"
          },
          bodySmall: {
              fontFamily: "Lexend-Deca"
          }
        }})
      }
      
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  onLayoutRootView()
  const schema = useColorScheme()

  return (
    <Provider theme={schema === 'dark' ? dth : lth}>
      <StatusBar style="auto" translucent={true} />
      <NavigationContainer theme={schema === 'dark' ? dth : lth}>
        <Navigation/>
      </NavigationContainer>
    </Provider>
  );
}