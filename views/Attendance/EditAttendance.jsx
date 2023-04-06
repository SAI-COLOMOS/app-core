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
  const { attendance, event_identifier } = route.params

  const [status, setStatus] = useState(attendance?.status)
  const [verified, setVerified] = useState(true)

  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  const options = [{ option: "Asistió" }, { option: "Retardo" }, { option: "Desinscrito" }, { option: "No asistió" }]

  async function updateAttendance() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/agenda/${event_identifier}/attendance`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        attendee_register: attendance.attendee_register,
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

  async function saveSchool() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/schools/${school.school_identifier}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        school_name: school_name.trim(),
        municipality: municipality.trim(),
        street: street.trim(),
        exterior_number: exterior_number.trim(),
        colony: colony.trim(),
        postal_code: postal_code.trim(),
        phone: phone.trim(),
        reference: reference.trim()
      })
    })
      .then((response) => response.status)
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

  async function deleteSchool() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/schools/${school.school_identifier}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => response.status)
      .catch((_) => null)

    console.log(request)

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

  // useEffect(() => {
  //   let check = true

  //   school_name.length > 0 ? null : (check = false)
  //   municipality.length > 0 ? null : (check = false)
  //   street.length > 0 ? null : (check = false)
  //   exterior_number.length > 0 ? null : (check = false)
  //   colony.length > 0 ? null : (check = false)
  //   postal_code.length == 5 ? null : (check = false)
  //   phone.length == 10 ? null : (check = false)

  //   if (check) {
  //     setVerified(true)
  //   } else {
  //     setVerified(false)
  //   }
  // }, [school_name, municipality, street, postal_code, exterior_number, colony, phone])

  const Data = () => (
    <VStack
      key="Data"
      spacing={5}
    >
      <Text variant="labelLarge">Estado de la asistencia{JSON.stringify(attendance)}</Text>
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
      <Text variant="labelLarge">Eliminar la escuela</Text>
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
        children={[Data(), Delete()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />

      <ModalMessage
        title="Eliminar escuela"
        description="¿Seguro que deseas eliminar esta escuela? La acción no se podrá deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm), deleteSchool()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="La escuela ha sido actualizada"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[["Aceptar", () => navigation.pop()]]}
        dismissable={false}
        icon="check-circle-outline"
      />
      <ModalMessage
        title="¡Listo!"
        description="La escuela ha sido eliminada"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[["Aceptar", () => navigation.pop(2)]]}
        dismissable={false}
        icon="check-circle-outline"
      />
      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar la escuela, inténtalo más tarde (${responseCode})`}
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
