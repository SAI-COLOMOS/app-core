import { Flex, HStack, VStack } from "@react-native-material/core"
import { useFocusEffect } from "@react-navigation/native"
import jwtDecode from "jwt-decode"
import { useCallback, useContext, useEffect, useState } from "react"
import { ScrollView } from "react-native"
import { Text, IconButton, Button, useTheme, TextInput } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"

export default SetNewPassword = ({ navigation, route }) => {
  const theme = useTheme()
  const { token, host } = useContext(ApplicationContext)

  const [validToken, setValidToken] = useState(undefined)
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

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [reponseCode, setReponseCode] = useState("")

  async function changePassword() {
    setModalLoading(true)

    const request = await fetch(`${host}/auth/recovery?token=${token}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        password: newPassword.trim()
      })
    })
      .then((response) => response.status)
      .catch((error) => null)

    setModalLoading(false)

    if (request == 200) {
      setModalSuccess(true)
    } else if (request != null) {
      setReponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  useFocusEffect(
    useCallback(() => {
      try {
        console.log(token)
        const payload = jwtDecode(token)

        if (payload.exp > Math.floor(Date.now() / 1000)) {
          setValidToken(true)
        } else {
          setValidToken(false)
        }
      } catch (erro) {
        setValidToken(null)
        console.log(erro)
      }

      return () => {}
    }, [token])
  )

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

  const Information = () => {
    return (
      <VStack spacing={5}>
        <Text variant="bodyMedium">Para poder cambiar tu contraseña es necesario que cumplas con los siguientes requisitos:</Text>
        <VStack spacing={0}>
          <HStack
            items="center"
            spacing={5}
          >
            <Icon
              size={20}
              color={passLength ? theme.colors.onBackground : theme.colors.error}
              name={passLength ? "check-circle-outline" : "alert-circle-outline"}
            />
            <Text
              variant="bodyMedium"
              style={{ color: passLength ? theme.colors.onBackground : theme.colors.error }}
            >
              Tiene al menos ocho caracteres
            </Text>
          </HStack>

          <HStack
            items="center"
            spacing={5}
          >
            <Icon
              size={20}
              color={hasUppercase ? theme.colors.onBackground : theme.colors.error}
              name={hasUppercase ? "check-circle-outline" : "alert-circle-outline"}
            />
            <Text
              variant="bodyMedium"
              style={{ color: hasUppercase ? theme.colors.onBackground : theme.colors.error }}
            >
              Tiene al menos una letra mayúscula
            </Text>
          </HStack>

          <HStack
            items="center"
            spacing={5}
          >
            <Icon
              size={20}
              color={hasLowercase ? theme.colors.onBackground : theme.colors.error}
              name={hasLowercase ? "check-circle-outline" : "alert-circle-outline"}
            />
            <Text
              variant="bodyMedium"
              style={{ color: hasLowercase ? theme.colors.onBackground : theme.colors.error }}
            >
              Tiene al menos una letra minúscula
            </Text>
          </HStack>

          <HStack
            items="center"
            spacing={5}
          >
            <Icon
              size={20}
              color={hasNumber ? theme.colors.onBackground : theme.colors.error}
              name={hasNumber ? "check-circle-outline" : "alert-circle-outline"}
            />
            <Text
              variant="bodyMedium"
              style={{ color: hasNumber ? theme.colors.onBackground : theme.colors.error }}
            >
              Tiene al menos un número
            </Text>
          </HStack>

          <HStack
            items="center"
            spacing={5}
          >
            <Icon
              size={20}
              color={hasSpecial ? theme.colors.onBackground : theme.colors.error}
              name={hasSpecial ? "check-circle-outline" : "alert-circle-outline"}
            />
            <Text
              variant="bodyMedium"
              style={{ color: hasSpecial ? theme.colors.onBackground : theme.colors.error }}
            >
              Tiene al menos un carácter especial
            </Text>
          </HStack>

          <HStack
            items="center"
            spacing={5}
          >
            <Icon
              size={20}
              color={areSamePassword ? theme.colors.onBackground : theme.colors.error}
              name={areSamePassword ? "check-circle-outline" : "alert-circle-outline"}
            />
            <Text
              variant="bodyMedium"
              style={{ color: areSamePassword ? theme.colors.onBackground : theme.colors.error }}
            >
              Tienes que confirmar tu nueva contraseña
            </Text>
          </HStack>
        </VStack>
      </VStack>
    )
  }

  const OutOfTime = () => {
    return (
      <VStack
        center
        spacing={20}
        p={30}
      >
        <IconButton
          icon="clock-alert-outline"
          size={50}
        />
        <VStack center>
          <Text
            variant="bodyMedium"
            style={{ textAlign: "center" }}
          >
            El token para realizar el cambio de contraseña ya venció, vuelve a realizar el proceso de restablecimiento para obtener uno nuevo
          </Text>
        </VStack>
      </VStack>
    )
  }

  const NotValid = () => {
    return (
      <VStack
        center
        spacing={20}
        p={30}
      >
        <IconButton
          icon="key-alert-outline"
          size={50}
        />
        <VStack center>
          <Text
            variant="bodyMedium"
            style={{ textAlign: "center" }}
          >
            El token para realizar el cambio de contraseña no es válido
          </Text>
        </VStack>
      </VStack>
    )
  }

  const Form = () => {
    return (
      <VStack spacing={5}>
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
    )
  }

  const Save = (_) => {
    return (
      <Button
        loading={modalLoading}
        mode="contained"
        disabled={!passLength || !hasNumber || !hasUppercase || !hasLowercase || !hasSpecial || !areSamePassword || modalLoading}
        onPress={() => {
          changePassword()
        }}
      >
        Cambiar contraseña
      </Button>
    )
  }

  const Cancel = (_) => {
    return (
      <Button
        disabled={modalLoading}
        mode="outlined"
        onPress={(_) => {
          navigation.pop()
        }}
      >
        Cancelar
      </Button>
    )
  }

  const Accept = (_) => {
    return (
      <Button
        mode="contained"
        onPress={(_) => {
          token = null
          navigation.pop()
        }}
      >
        Aceptar
      </Button>
    )
  }

  return (
    <Flex fill>
      {validToken !== null ? (
        validToken === true ? (
          <CreateForm
            title="Cambiar tu contraseña"
            loading={modalLoading}
            navigation={navigation}
            children={[Information(), Form()]}
            actions={[Cancel(), Save()]}
          />
        ) : (
          <CreateForm
            title="Token vencido"
            navigation={navigation}
            children={[OutOfTime()]}
            actions={[Accept()]}
          />
        )
      ) : (
        <CreateForm
          title="Token inválido"
          navigation={navigation}
          children={[NotValid()]}
          actions={[Accept()]}
        />
      )}

      <ModalMessage
        title="¡Listo!"
        description="La contraseña ha sido actualizada, inicia sesión para acceder a la aplicación"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[["Aceptar", () => navigation.pop()]]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar tu contraseña, intentalo más tarde. (${reponseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Sin conexión a internet"
        description={`Parece que no tienes conexión a internet, conectate e intenta de nuevo`}
        handler={[modalFatal, () => setModalFatal(!modalFatal)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="wifi-alert"
      />
    </Flex>
  )
}
