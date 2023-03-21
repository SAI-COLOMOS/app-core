import { Flex, HStack, VStack } from '@react-native-material/core'
import { createContext, useEffect, useState } from 'react'
import { Image, ScrollView } from 'react-native'
import { Button, Card, Text, TextInput, Checkbox, ActivityIndicator, useTheme, Switch } from 'react-native-paper'
import * as SecureStore from 'expo-secure-store'
import jwtDecode from 'jwt-decode'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import * as Linking from 'expo-linking'
import ModalMessage from '../Shared/ModalMessage'

export default Login = ({ navigation }) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const url = Linking.useURL()

  const [credential, setCredential] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberUser, setRememberUser] = useState(false)
  const [activeSession, setActiveSession] = useState(undefined)

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState('')

  async function getSession() {
    setModalLoading(true)

    const session = await fetch(`${localhost}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `no-cache`
      },
      body: JSON.stringify({
        credential: credential.trim(),
        password: password.trim(),
        keepAlive: rememberUser
      })
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch((_) => null)

    if (session && isNaN(session)) {
      const payload = jwtDecode(session.token)

      await SecureStore.setItemAsync('token', session.token)
      await SecureStore.setItemAsync('register', payload.register)

      if (rememberUser) {
        await SecureStore.setItemAsync('keepAlive', `${rememberUser}`)
      }

      if (credential === password) {
        navigation.replace('FirstAccess')
      } else {
        navigation.replace('Dashboard')
      }
    } else if (session != null) {
      setResponseCode(session)
      setModalLoading(false)
      setModalError(true)
      return
    } else {
      setModalLoading(false)
      setModalFatal(true)
      return
    }
  }

  useEffect(() => {
    if (url) {
      const { hostname, path, queryParams } = Linking.parse(url)
      if (path === 'recovery' && queryParams?.token) {
        navigation.navigate('SetNewPassword', { token: queryParams.token })
      }
    }
  }, [url])

  useEffect(() => {
    const getActualSession = async (_) => {
      const token = await SecureStore.getItemAsync('token')
      const keepAlive = await SecureStore.getItemAsync('keepAlive')

      if (keepAlive === 'true') {
        const payload = jwtDecode(token)

        if (payload.exp > Math.floor(Date.now() / 1000)) {
          await SecureStore.setItemAsync('register', payload.register)
          setActiveSession(true)
          navigation.replace('Dashboard')
        }
      }

      setActiveSession(false)
    }

    if (activeSession === undefined) {
      getActualSession()
    }
  }, [activeSession])

  return (
    <Flex fill pt={insets.top}>
      {activeSession === undefined ? (
        <Flex fill center>
          <ActivityIndicator animating={true} color={theme.colors.primary} size={75} />
        </Flex>
      ) : (
        <ScrollView>
          <VStack p={20} pb={50} spacing={50}>
            <Flex center>
              <Image source={require('../../assets/logo.png')} style={{ width: 150, height: 150 }} />
            </Flex>

            <VStack spacing={10}>
              <TextInput mode="outlined" label="Registro, email o teléfono" autoComplete="username" autoCapitalize="none" onChangeText={setCredential} />
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
                    onPress={(_) => {
                      setShowPassword(!showPassword)
                    }}
                  />
                }
              />
              <HStack items="center" spacing={10}>
                <Switch
                  value={rememberUser}
                  onValueChange={(_) => {
                    setRememberUser(!rememberUser)
                  }}
                />
                <Text variant="bodyMedium">Mantaner la sesión abierta</Text>
              </HStack>
            </VStack>

            <VStack spacing={10}>
              <Button
                disabled={modalLoading}
                loading={modalLoading}
                mode="contained"
                onPress={(_) => {
                  getSession()
                }}
              >
                Iniciar sesión
              </Button>

              <Button
                disabled={modalLoading}
                mode="text"
                onPress={(_) => {
                  navigation.navigate('ResetPassword')
                }}
              >
                Recuperar contraseña
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      )}

      {/* <ModalLoaading handler={[modalLoading, () => setModalLoading(!modalLoading)]} dismissable={false}/> */}

      <ModalMessage title="¡Listo!" description="La contraseña ha sido actualizada, ahora puedes acceder a la aplicación" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.replace('Dashboard')]]} dismissable={false} icon="check-circle-outline" />

      <ModalMessage title="Ocurrió un problema" description={`No pudimos iniciar sesión, verifica tu usuario y contraseña e intentalo nuevamente. (${responseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />

      <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conectate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert" />
    </Flex>
  )
}
