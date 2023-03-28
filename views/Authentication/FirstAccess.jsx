import { Flex, HStack, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Button, IconButton, Text, TextInput, useTheme } from "react-native-paper"
import * as SecureStore from "expo-secure-store"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Constants from "expo-constants"
import { KeyboardAvoidingView, ScrollView } from "react-native"
import ModalMessage from "../Shared/ModalMessage"
import ModalLoading from "../Shared/ModalLoading"
import UserContext from "../UserContext"

export default FirstAccess = ({ navigation }) => {
  const userContext = useContext(UserContext)
  const insets = useSafeAreaInsets()
  const theme = useTheme()
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [newPassword, setNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [confirmationNewPassword, setConfirmationNewPassword] = useState("")
  const [showConfirmationNewPassword, setShowConfirmationNewPassword] = useState(false)
  const [passLength, setPassLength] = useState(false)
  const [hasUppercase, setHasUppercase] = useState(false)
  const [hasLowercase, setHasLowercase] = useState(false)
  const [hasNumber, setHasNumber] = useState(false)
  const [hasSpecial, setHasSpecial] = useState(false)
  const [areSamePassword, setAreSamePassword] = useState(false)

  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function changePassword() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/users/${userContext.register}/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userContext.token}`,
        "Cache-Control": `no-cache`
      },
      body: JSON.stringify({
        password: newPassword.trim()
      })
    })

    setModalLoading(false)

    if (request.ok) {
      setModalSuccess(true)
      return
    } else if (typeof request.status == "number") {
      console.error(await request.json())
      setResponseCode(request.status)
      setModalError(true)
      return
    }

    setModalFatal(true)
    return
  }

  useEffect(() => {
    ;/^.*(?=.{8,}).*$/.test(newPassword) ? setPassLength(true) : setPassLength(false)
    ;/^.*(?=.*[A-Z]).*$/.test(newPassword) ? setHasUppercase(true) : setHasUppercase(false)
    ;/^.*(?=.*[a-z]).*$/.test(newPassword) ? setHasLowercase(true) : setHasLowercase(false)
    ;/^.*(?=.*\d).*$/.test(newPassword) ? setHasNumber(true) : setHasNumber(false)
    ;/^.*(?=.*\W).*$/.test(newPassword) ? setHasSpecial(true) : setHasSpecial(false)
  }, [newPassword])

  useEffect(() => {
    confirmationNewPassword == newPassword && confirmationNewPassword != "" ? setAreSamePassword(true) : setAreSamePassword(false)
  }, [confirmationNewPassword])

  return (
    <Flex fill pt={insets.top} style={{ backgroundColor: theme.colors.backdrop }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ width: "100%", height: "100%" }}>
        <Flex fill>
          <ScrollView>
            <VStack center spacing={20} p={30}>
              <IconButton icon="key-alert-outline" size={50} />
              <VStack spacing={5}>
                <Text variant="headlineSmall" style={{ textAlign: "center" }}>
                  Hola, por primera vez
                </Text>

                <Text variant="bodyMedium">Antes de poder continuar, es necesario que cambies tu contraseña, ya que la que acabas de usar es provisional.</Text>

                <Text variant="bodyMedium">Para poder cambiar tu contraseña es necesario que cumplas con los siguientes requisitos:</Text>
              </VStack>

              <VStack spacing={0}>
                <HStack items="center" spacing={5}>
                  <Icon size={20} color={passLength ? theme.colors.onBackground : theme.colors.error} name={passLength ? "check-circle-outline" : "alert-circle-outline"} />
                  <Text variant="bodyMedium" style={{ color: passLength ? theme.colors.onBackground : theme.colors.error }}>
                    Tiene al menos ocho caracteres
                  </Text>
                </HStack>

                <HStack items="center" spacing={5}>
                  <Icon size={20} color={hasUppercase ? theme.colors.onBackground : theme.colors.error} name={hasUppercase ? "check-circle-outline" : "alert-circle-outline"} />
                  <Text variant="bodyMedium" style={{ color: hasUppercase ? theme.colors.onBackground : theme.colors.error }}>
                    Tiene al menos una letra mayúscula
                  </Text>
                </HStack>

                <HStack items="center" spacing={5}>
                  <Icon size={20} color={hasLowercase ? theme.colors.onBackground : theme.colors.error} name={hasLowercase ? "check-circle-outline" : "alert-circle-outline"} />
                  <Text variant="bodyMedium" style={{ color: hasLowercase ? theme.colors.onBackground : theme.colors.error }}>
                    Tiene al menos una letra minúscula
                  </Text>
                </HStack>

                <HStack items="center" spacing={5}>
                  <Icon size={20} color={hasNumber ? theme.colors.onBackground : theme.colors.error} name={hasNumber ? "check-circle-outline" : "alert-circle-outline"} />
                  <Text variant="bodyMedium" style={{ color: hasNumber ? theme.colors.onBackground : theme.colors.error }}>
                    Tiene al menos un número
                  </Text>
                </HStack>

                <HStack items="center" spacing={5}>
                  <Icon size={20} color={hasSpecial ? theme.colors.onBackground : theme.colors.error} name={hasSpecial ? "check-circle-outline" : "alert-circle-outline"} />
                  <Text variant="bodyMedium" style={{ color: hasSpecial ? theme.colors.onBackground : theme.colors.error }}>
                    Tiene al menos un carácter especial
                  </Text>
                </HStack>

                <HStack items="center" spacing={5}>
                  <Icon size={20} color={areSamePassword ? theme.colors.onBackground : theme.colors.error} name={areSamePassword ? "check-circle-outline" : "alert-circle-outline"} />
                  <Text variant="bodyMedium" style={{ color: areSamePassword ? theme.colors.onBackground : theme.colors.error }}>
                    Tienes que confirmar tu nueva contraseña
                  </Text>
                </HStack>
              </VStack>
            </VStack>

            <VStack ph={25} pb={50} spacing={5}>
              <VStack spacing={10}>
                <TextInput
                  mode="outlined"
                  label="Nueva contraseña"
                  value={newPassword}
                  autoComplete="password-new"
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  right={
                    <TextInput.Icon
                      icon="eye"
                      onPress={(_) => {
                        setShowNewPassword(!showNewPassword)
                      }}
                    />
                  }
                />

                <TextInput
                  mode="outlined"
                  label="Confirma tu nueva contraseña"
                  value={confirmationNewPassword}
                  autoComplete="password-new"
                  onChangeText={setConfirmationNewPassword}
                  secureTextEntry={!showConfirmationNewPassword}
                  right={
                    <TextInput.Icon
                      icon="eye"
                      onPress={(_) => {
                        setShowConfirmationNewPassword(!showConfirmationNewPassword)
                      }}
                    />
                  }
                />
              </VStack>
            </VStack>
          </ScrollView>

          <HStack spacing={20} justify="between" pv={20} ph={20}>
            <Button
              icon="logout"
              disabled={modalLoading}
              mode="outlined"
              onPress={async (_) => {
                await SecureStore.deleteItemAsync("token")
                userContext.setToken(null)
                userContext.setRegister(null)
                navigation.replace("Login")
              }}
            >
              Salir
            </Button>

            <Button
              icon="lock-reset"
              mode="contained"
              loading={modalLoading}
              disabled={!passLength || !hasNumber || !hasUppercase || !hasLowercase || !hasSpecial || !areSamePassword || modalLoading}
              onPress={() => {
                changePassword()
              }}
            >
              Actualizar contraseña
            </Button>
          </HStack>
        </Flex>
      </KeyboardAvoidingView>

      {/* <ModalLoading handler={[modalLoading, () => setModalLoading(!modalLoading)]} dismissable={false}/> */}

      <ModalMessage title="¡Listo!" description="La contraseña ha sido actualizada, ahora puedes acceder a la aplicación" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[["Aceptar", () => navigation.replace("Dashboard")]]} dismissable={false} icon="check-circle-outline" />

      <ModalMessage title="Ocurrió un problema" description={`No pudimos actualizar tu contraseña, inténtalo más tarde. (${responseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[["Aceptar"]]} dismissable={true} icon="close-circle-outline" />

      <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[["Aceptar"]]} dismissable={true} icon="wifi-alert" />
    </Flex>
  )
}
