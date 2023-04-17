import { Flex, HStack, VStack } from "@react-native-material/core"
import { Button, TextInput, useTheme, Text, Switch } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from "expo-constants"
import ModalMessage from "../Shared/ModalMessage"
import { useCallback, useContext, useEffect, useState } from "react"
import { LongDate } from "../Shared/LocaleDate"
// import { DateAndTimerPicker } from "../Shared/TimeAndDatePicker"
import ApplicationContext from "../ApplicationContext"

export default EditCard = ({ navigation, route }) => {
  const { register, activity, getCard } = route.params
  const { host, token } = useContext(ApplicationContext)
  const theme = useTheme()

  const [activity_name, setActivity_name] = useState(`${activity?.activity_name ?? ""}`)
  const [hours, setHours] = useState(`${activity?.hours ?? ""}`)
  const [responsible_register, setResponsible_register] = useState(`${activity?.responsible_register ?? ""}`)
  const [assignation_date, setAssignation_date] = useState(new Date(`${activity?.assignation_date}`))
  const [penalized, setPenalized] = useState(activity?.toSubstract ?? false)
  const [_id, set_id] = useState(`${activity?._id}`)

  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function UpdateCard() {
    setModalLoading(true)
    const request = await fetch(`${host}/cards/${register}/activity`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        activity_name: activity_name.trim(),
        hours: Math.abs(Number(hours)),
        responsible_register: responsible_register.trim(),
        assignation_date: assignation_date,
        toSubstract: penalized,
        _id: _id.trim()
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

  async function DeleteCard() {
    const request = await fetch(`${host}/cards/${register}/activity`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        _id: _id.trim()
      })
    })
      .then((response) => response.status)
      .catch(() => null)

    if (request == 200) {
      setModalSuccessDelete(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalErrorDelete(true)
    } else {
      setModalFatal(true)
    }
  }

  const Activity = (_) => {
    return (
      <VStack
        spacing={5}
        key="Activity"
      >
        <Text variant="labelLarge">Actividad</Text>
        <VStack spacing={10}>
          <TextInput
            mode="outlined"
            value={activity_name}
            onChangeText={setActivity_name}
            label="Nombre de actividad"
            maxLength={50}
            autoComplete="off"
            autoCorrect={false}
          />
          <TextInput
            mode="outlined"
            value={hours}
            onChangeText={setHours}
            label="Horas a asignar"
            keyboardType="numeric"
            maxLength={3}
            autoComplete="off"
            autoCorrect={false}
            left={penalized == true && <TextInput.Affix text="-" />}
            right={<TextInput.Affix text="hrs" />}
          />

          <HStack
            items="center"
            spacing={10}
          >
            <Switch
              value={penalized}
              onValueChange={() => setPenalized(!penalized)}
            />
            <Text variant="bodyMedium">{penalized == true ? "Horas en contra" : "Horas a favor"}</Text>
          </HStack>
        </VStack>
      </VStack>
    )
  }

  const Update = () => {
    return (
      <Button
        loading={modalLoading}
        disabled={modalLoading}
        mode="contained"
        icon="content-save-outline"
        key="Update"
        onPress={() => {
          UpdateCard()
        }}
      >
        Guardar
      </Button>
    )
  }

  const Cancel = () => {
    return (
      <Button
        disabled={modalLoading}
        mode="outlined"
        icon="close"
        key="Cancel"
        onPress={() => {
          navigation.pop()
        }}
      >
        Cancelar
      </Button>
    )
  }

  const Delete = () => {
    return (
      <Button
        disabled={modalLoading}
        mode="contained"
        icon="trash-can-outline"
        key="Delete"
        onPress={() => {
          setModalConfirm(!modalConfirm)
        }}
      >
        Eliminar actividad
      </Button>
    )
  }

  return (
    <Flex fill>
      <CreateForm
        loading={modalLoading}
        navigation={navigation}
        title={"Editar actividad"}
        children={[Activity(), Delete()]}
        actions={[Update(), Cancel()]}
      />
      <ModalMessage
        title="Eliminar actividad"
        description="¿Seguro que deseas eliminar esta actividad? La acción no se podrá deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm), DeleteCard()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />
      <ModalMessage
        title="¡Listo!"
        description="La actividad ha sido actualizada"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getCard()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="La actividad ha sido eliminada"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[
          [
            "Aceptar",
            () => {
              getCard()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar la actividad, intentalo más tarde. (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos eliminar la actividad, intentalo más tarde. (${responseCode})`}
        handler={[modalErrorDelete, () => setModalErrorDelete(!modalErrorDelete)]}
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
