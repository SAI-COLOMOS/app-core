import { Flex, HStack, VStack } from "@react-native-material/core"
import { createContext, useContext, useEffect, useState } from "react"
import { Image, Pressable, ScrollView } from "react-native"
import { Button, Card, Text, TextInput, Checkbox, ActivityIndicator, useTheme, Switch } from "react-native-paper"
import * as SecureStore from "expo-secure-store"
import jwtDecode from "jwt-decode"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Constants from "expo-constants"
import * as Linking from "expo-linking"
import * as LocalAuthentication from "expo-local-authentication"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"

export default Login = ({ navigation }) => {
  const { host, setToken, setRegister } = useContext(ApplicationContext)
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const url = Linking.useURL()

  const [credential, setCredential] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberUser, setRememberUser] = useState(false)
  const [useBiometric, setUseBiometric] = useState(false)
  const [activeSession, setActiveSession] = useState(undefined)
  const [hasHardware, setHasHardware] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function rememberUserHandler() {
    if (useBiometric == true && rememberUser == true) {
      const result = await LocalAuthentication.authenticateAsync()

      if (result.success == true) {
        setUseBiometric(!useBiometric)
        await SecureStore.setItemAsync("useBiometric", useBiometric == true ? "true" : "false")
      } else {
        return
      }
    }

    setRememberUser(!rememberUser)
    return
  }

  async function useBiometricHandler() {
    const result = await LocalAuthentication.authenticateAsync({ promptMessage: "Desbloquea para continuar" })

    if (result.success == true) {
      await SecureStore.setItemAsync("useBiometric", useBiometric == true ? "true" : "false")
      setUseBiometric(!useBiometric)
    }
  }

  async function getSession() {
    try {
      setModalLoading(true)

      const request = await fetch(`${host}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `no-cache`
        },
        body: JSON.stringify({
          credential: credential.trim(),
          password: password.trim(),
          keepAlive: rememberUser
        })
      })

      setModalLoading(false)

      if (request.ok) {
        const response = await request.json()
        const payload = jwtDecode(response.token)

        setToken(response.token)
        setRegister(payload.register)

        // if (useBiometric == true) {
        //   const result = await LocalAuthentication.authenticateAsync({
        //     promptMessage: "Desbloquea para acceder"
        //   })

        //   if (result.success == true) {
        //     await SecureStore.setItemAsync("useBiometric", "true")
        //   } else {
        //     return
        //   }
        // }

        if (rememberUser == true) {
          await SecureStore.setItemAsync("token", response.token)
        }

        if (credential === password) {
          navigation.replace("FirstAccess")
        } else {
          navigation.replace("Dashboard")
        }
      }

      setResponseCode(request.status)
      setModalError(true)
      return
    } catch (error) {
      console.error("Get session:", error)
      setModalLoading(false)
      setModalFatal(true)
      return
    }
  }

  useEffect(() => {
    if (url) {
      const { hostname, path, queryParams } = Linking.parse(url)
      if (path === "recovery" && queryParams?.token) {
        navigation.navigate("SetNewPassword", { token: queryParams.token })
      }
    }
  }, [url])

  useEffect(() => {
    const checkHasHardware = async () => {
      const result = await LocalAuthentication.hasHardwareAsync()
      setHasHardware(result)
    }

    checkHasHardware()
  }, [])

  useEffect(() => {
    const getActualSession = async () => {
      const token = await SecureStore.getItemAsync("token")
      const useBiometric = await SecureStore.getItemAsync("useBiometric")

      if (token != null) {
        const payload = jwtDecode(token)
        setRememberUser(true)

        if (payload.exp > Math.floor(Date.now() / 1000)) {
          setRegister(payload.register)
          setToken(token)

          if (useBiometric != null) {
            setUseBiometric(true)

            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: "Desbloquea para acceder"
            })

            if (result.success == false) {
              setActiveSession(false)
              return
            }
          }

          setActiveSession(true)

          navigation.replace("Dashboard")
        }
      }

      setActiveSession(false)
    }

    if (activeSession === undefined) {
      getActualSession()
    }
  }, [activeSession])

  return (
    <Flex
      fill
      pt={insets.top}
      pb={insets.bottom}
    >
      {activeSession === undefined ? (
        <Flex
          fill
          center
        >
          <ActivityIndicator
            animating={true}
            color={theme.colors.primary}
            size={75}
          />
        </Flex>
      ) : (
        <ScrollView>
          <VStack
            p={20}
            spacing={50}
          >
            <Flex center>
              <Image
                source={require("../../assets/logo.png")}
                style={{ width: 150, height: 150 }}
              />
            </Flex>

            <VStack spacing={10}>
              <TextInput
                mode="outlined"
                label="Registro, email o teléfono"
                autoComplete="username"
                autoCapitalize="none"
                onChangeText={setCredential}
              />
              <TextInput
                mode="outlined"
                label="Contraseña"
                autoComplete="password"
                autoCapitalize="none"
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                right={
                  <TextInput.Icon
                    icon="eye"
                    onPress={() => {
                      setShowPassword(!showPassword)
                    }}
                  />
                }
              />
              <Pressable onPress={() => rememberUserHandler()}>
                <HStack
                  items="center"
                  spacing={10}
                >
                  <Switch
                    value={rememberUser}
                    onValueChange={() => rememberUserHandler()}
                  />
                  <Text variant="bodyMedium">Mantener la sesión abierta</Text>
                </HStack>
              </Pressable>

              {hasHardware == true && rememberUser == true && (
                <Pressable onPress={() => useBiometricHandler()}>
                  <HStack
                    items="center"
                    spacing={10}
                  >
                    <Switch
                      value={useBiometric}
                      onValueChange={() => useBiometricHandler()}
                    />
                    <Text variant="bodyMedium">Iniciar sesión con sensor biométrico</Text>
                  </HStack>
                </Pressable>
              )}
            </VStack>

            <VStack spacing={20}>
              <Button
                disabled={modalLoading}
                loading={modalLoading}
                icon="login-variant"
                mode="contained"
                onPress={() => {
                  getSession()
                }}
              >
                Iniciar sesión
              </Button>

              <Button
                disabled={modalLoading}
                icon="lock-reset"
                mode="outlined"
                onPress={() => {
                  navigation.navigate("ResetPassword")
                }}
              >
                Recuperar contraseña
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      )}

      <ModalMessage
        title="¡Listo!"
        description="La contraseña ha sido actualizada, ahora puedes acceder a la aplicación"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[["Aceptar", () => navigation.replace("Dashboard")]]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos iniciar sesión, verifica tu usuario y contraseña e inténtalo nuevamente. (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Sin conexión a internet"
        description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`}
        handler={[modalFatal, () => setModalFatal(!modalFatal)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="wifi-alert"
      />
    </Flex>
  )
}
