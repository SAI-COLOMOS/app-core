import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { useEffect, useCallback, useRef } from "react"
import { StyleSheet, useColorScheme, View } from "react-native"
import { Provider, configureFonts } from "react-native-paper"
import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import * as SplashScreen from "expo-splash-screen"
import Navigation from "./views/Navigation"
import { LogBox } from "react-native"

import { darkTheme, lightTheme } from "./assets/themes/themeGreen"

SplashScreen.preventAutoHideAsync()

export default function App() {
  const url = Linking.useURL()
  const schema = useColorScheme()
  const recovery = useRef()
  let dth = darkTheme
  let lth = lightTheme
  LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"])

  const [fontsLoaded] = useFonts({
    "Lexend-Deca": require("./assets/fonts/LexendDeca.ttf")
  })

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      dth = {
        ...dth,
        fonts: configureFonts({
          config: {
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
          }
        })
      }

      lth = {
        ...lth,
        fonts: configureFonts({
          config: {
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
          }
        })
      }

      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  // useEffect(() => {
  //     console.log(url)
  //     if(url) {
  //         const {hostname, path, queryParams} = Linking.parse(url)
  //         if(path === "recovery" && queryParams?.tkn) {
  //             recovery.current.navigate("SetNewPassword", {token: queryParams.tkn})
  //             console.log(queryParams)
  //         }
  //     }
  // }, [url])

  /* Deep link */

  const linking = {
    prefixes: [Linking.createURL("/"), "https://api.sai-colomos.dev"],
    config: {
      screens: {
        initialRouteName: "Login",
        SetNewPassword: "auth/recovery"
      }
    }
  }

  onLayoutRootView()

  return (
    <Provider theme={schema === "dark" ? dth : lth}>
      <StatusBar
        style="auto"
        translucent={true}
      />
      <NavigationContainer
        ref={recovery}
        theme={schema === "dark" ? dth : lth}
        linking={linking}
      >
        <Navigation />
      </NavigationContainer>
    </Provider>
  )
}
