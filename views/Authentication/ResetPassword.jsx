import { Flex, VStack } from "@react-native-material/core"
import { useState, useEffect, useContext } from "react"
import { Text, Button, TextInput, Portal, Dialog } from "react-native-paper"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalLoaading from "../Shared/ModalLoading"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"

export default ResetPassword = ({ navigation }) => {
  const { host } = useContext(ApplicationContext)
  const [credential, setCredential] = useState("")

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [reponseCode, setReponseCode] = useState("")

  const getRecovery = async () => {
    setModalLoading(true)

    const request = await fetch(`${host}/auth/recovery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        credential: credential.trim()
      })
    })
      .then((response) => response.status)
      .catch((_) => null)

    setModalLoading(false)

    if (request == 200) {
      setModalSuccess(true)
    } else if (request != null) {
      setReponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }

    return
  }

  const Form = (_) => {
    return (
      <VStack spacing={5}>
        <TextInput
          mode="outlined"
          label="Registro, email o teléfono"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={setCredential}
        />
      </VStack>
    )
  }

  const Info = (_) => {
    return (
      <VStack spacing={5}>
        <Text variant="bodyMedium">¿Olvidaste tu contraseña? No te preocupes, puedes reestablcerla fácilmente, solo introduce tu registro, correo electrónico o teléfono para solicitar el cambio de contraseña</Text>
      </VStack>
    )
  }

  const Submit = (_) => {
    return (
      <Button
        icon="lock-reset"
        mode="contained"
        loading={modalLoading}
        disabled={modalLoading}
        onPress={() => {
          getRecovery()
        }}
      >
        Solicitar cambio
      </Button>
    )
  }

  const Cancel = (_) => {
    return (
      <Button
        icon="close"
        mode="outlined"
        disabled={modalLoading}
        onPress={(_) => {
          navigation.pop()
        }}
      >
        Cancelar
      </Button>
    )
  }

  return (
    <Flex fill>
      <CreateForm
        navigation={navigation}
        title="Reestablecer tu contraseña"
        loading={modalLoading}
        children={[Info(), Form()]}
        actions={[Submit(), Cancel()]}
      />

      {/* <ModalLoaading handler={[modalLoading, () => setModalLoading(!modalLoading)]} dismissable={false}/> */}

      <ModalMessage
        title="¡Listo!"
        description="Si la información que nos diste corresponde con tu usuario, te mandaremos un correo con los pasos para que puedas cambiar tu contraseña"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[["Aceptar", () => navigation.pop()]]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos solicitar tu cambio de contraseña, intentalo más tarde. (${reponseCode})`}
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
