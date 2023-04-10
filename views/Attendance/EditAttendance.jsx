import { Flex, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"
import Dropdown from "../Shared/Dropdown"

export default EditSchool = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()
  const { token } = useContext(ApplicationContext)
  const { attendee, event_identifier, event_status, getEvent } = route.params

  const [status, setStatus] = useState(attendee?.status)

  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  const options = [{ option: "Asistió" }, { option: "Retardo" }, { option: "No asistió" }]

  async function updateAttendance() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/agenda/${event_identifier}/attendance`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        attendee_register: attendee.attendee_register,
        status: status
      })
    })
      .then(async (response) => {
        console.log(await response.json())
        return response.status
      })
      .catch((_) => null)

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

  async function deleteAttendance() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/agenda/${event_identifier}/attendance`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        attendee_register: attendee.attendee_register,
        status: "Desinscrito"
      })
    })
      .then(async (response) => {
        console.log(await response.json())
        return response.status
      })
      .catch((_) => null)

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

  const Data = () => (
    <VStack
      key="Data"
      spacing={5}
    >
      <Text variant="titleMedium">
        {attendee?.first_name} {attendee?.first_last_name} {attendee?.second_last_name ?? null} {event_status}
      </Text>
      <Text variant="labelLarge">Estado de la asistencia</Text>
      <VStack spacing={10}>
        <Dropdown
          title="Estado de la asistencia"
          value={status}
          selected={setStatus}
          options={options}
        />
      </VStack>
    </VStack>
  )

  const Delete = () => (
    <VStack
      key="Delete"
      spacing={5}
    >
      <Text variant="labelLarge">Eliminar participante</Text>
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
      disabled={modalLoading}
      loading={modalLoading}
      mode="contained"
      onPress={() => updateAttendance()}
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
      onPress={(_) => {
        navigation.pop()
      }}
    >
      Cancelar
    </Button>
  )

  return (
    <Flex fill>
      <CreateForm
        title="Editar asistencia"
        children={!(event_status == "En proceso" || event_status == "Concluido" || event_status == "Concluido por sistema" || event_status == "Por comenzar") ? [Data(), Delete()] : [Data()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />

      <ModalMessage
        title="Eliminar participante"
        description="¿Seguro que deseas eliminar a este participante?"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm)
              deleteAttendance()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="La asistencia del participante ha sido actualizada"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getEvent()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />
      <ModalMessage
        title="¡Listo!"
        description="El participante ha sido eliminado"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[
          [
            "Aceptar",
            () => {
              getEvent()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />
      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar la asistencia del participante, inténtalo más tarde (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />
      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos eliminar la escuela, inténtalo más tarde (${responseCode})`}
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
