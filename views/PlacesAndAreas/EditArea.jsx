import { Flex, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"

export default EditArea = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const theme = useTheme()
  const { area, place_identifier, getPlace } = route.params

  const [area_name, setArea_name] = useState(`${area.area_name}`)
  const [phone, setPhone] = useState(`${area.phone}`)
  const [verified, setVerified] = useState(false)

  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function saveArea() {
    setModalLoading(true)

    const request = await fetch(`${host}/places/${place_identifier}/areas/${area.area_identifier}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        area_name: area_name.trim(),
        phone: phone.trim()
      })
    })
      .then((response) => response.status)
      .catch(() => null)

    setModalLoading(false)

    if (request == 200) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  async function deleteArea() {
    setModalLoading(true)

    const request = await fetch(`${host}/places/${place_identifier}/areas/${area.area_identifier}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => response.status)
      .catch(() => null)

    setModalLoading(false)

    if (request == 200) {
      setModalSuccessDelete(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalErrorDelete(true)
    } else {
      setModalFatal(true)
    }
  }

  useEffect(() => {
    let check = true

    area_name.length > 0 ? null : (check = false)
    phone.length == 10 ? null : (check = false)

    if (check) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [area_name, phone])

  const Data = () => (
    <VStack
      key="Data"
      spacing={5}
    >
      <Text variant="labelLarge">Datos del área</Text>
      <VStack spacing={10}>
        <TextInput
          mode="outlined"
          value={area_name}
          onChangeText={setArea_name}
          label="Nombre del área"
          maxLength={50}
          autoCapitalize="words"
          autoComplete="off"
        />
        <TextInput
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          label="Número telefónico"
          maxLength={10}
          keyboardType="phone-pad"
          autoComplete="off"
        />
      </VStack>
    </VStack>
  )

  const Delete = () => (
    <VStack
      key="Delete"
      spacing={5}
    >
      <Text variant="labelLarge">Eliminar área</Text>
      <VStack spacing={10}>
        <Button
          textColor={theme.colors.error}
          icon="trash-can-outline"
          mode="outlined"
          onPress={() => {
            setModalConfirm(!modalConfirm)
          }}
        >
          Eliminar
        </Button>
      </VStack>
    </VStack>
  )

  const Save = () => (
    <Button
      key="SaveButton"
      icon="content-save-outline"
      disabled={modalLoading || !verified}
      loading={modalLoading}
      mode="contained"
      onPress={() => {
        saveArea()
      }}
    >
      Guardar
    </Button>
  )

  const Cancel = () => (
    <Button
      key="CancelButton"
      icon="close"
      disabled={modalLoading}
      mode="outlined"
      onPress={() => {
        navigation.pop()
      }}
    >
      Cancelar
    </Button>
  )

  return (
    <Flex fill>
      <CreateForm
        title="Editar área"
        children={[Data(), Delete()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />

      <ModalMessage
        title="Eliminar área"
        description="¿Seguro que deseas eliminar esta área? La acción no se podrá deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm)
              deleteArea()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El área ha sido actualizada"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getPlace()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El área ha sido eliminada"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[
          [
            "Aceptar",
            () => {
              getPlace()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar el área, inténtalo más tarde (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos eliminar el lugar, inténtalo más tarde (${responseCode})`}
        handler={[modalErrorDelete, () => setModalErrorDelete(!modalErrorDelete)]}
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
