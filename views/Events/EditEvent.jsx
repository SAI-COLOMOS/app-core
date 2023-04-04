import { even, Flex, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"
import { DateAndTimerPicker } from "../Shared/TimeAndDatePicker"
import Dropdown from "../Shared/Dropdown"

export default EditEvent = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { token } = useContext(ApplicationContext)
  const theme = useTheme()
  const { event, event_identifier } = route.params

  const [places, setPlaces] = useState(undefined)
  const [name, setName] = useState(`${event.name}`)
  const [description, setDescription] = useState(`${event.description}`)
  const [offered_hours, setOffered_hours] = useState(`${event.offered_hours}`)
  const [tolerance, setTolerance] = useState(`${event.tolerance}`)
  const [vacancy, setVacancy] = useState(`${event.vacancy}`)
  const [starting_date, setStarting_date] = useState(new Date(event.starting_date)) //`${event.starting_date}`)
  const [ending_date, setEnding_date] = useState(new Date(event.ending_date)) //`${event.ending_date}`)
  const [publishing_date, setPublishing_date] = useState(new Date(event.publishing_date)) //`${event.publishing_date}`)
  const [avatar, setAvatar] = useState(event.avatar ?? null)
  const [place, setPlace] = useState(`${event.place}`)
  const [verified, setVerified] = useState(false)

  const [loading, setLoading] = useState(false)
  const [placesOptions, setPlacesOptions] = useState()
  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function savePlace() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/agenda/${event_identifier}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        offered_hours: Number(offered_hours.trim()),
        tolerance: Number(tolerance.trim()),
        vacancy: Number(vacancy.trim()),
        starting_date: starting_date.toISOString(),
        ending_date: ending_date.toISOString(),
        publishing_date: publishing_date.toISOString(),
        place: place.trim(),
        avatar: avatar
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

  async function deleteEvent() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/agenda/${event_identifier}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => response.status)
      .catch(() => null)

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

  async function getPlaces() {
    setLoading(true)

    const request = await fetch(`${localhost}/places`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.places) {
      let placesData = []
      request.places.forEach((place) => {
        placesData.push({ option: place.place_name })
      })
      setPlacesOptions(placesData)
    }
  }

  useEffect(() => {
    getPlaces()
  }, [])

  useEffect(() => {
    let check = true

    name.length > 0 ? null : (check = false)
    description.length > 0 ? null : (check = false)
    offered_hours.length > 0 ? null : (check = false)
    tolerance.length > 0 ? null : (check = false)
    vacancy.length > 0 ? null : (check = false)
    place.length > 0 ? null : (check = false)

    if (check) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [name, description, offered_hours, tolerance, vacancy, starting_date, ending_date, publishing_date, place])

  const Data = () => {
    return (
      <VStack
        key="Data"
        spacing={5}
      >
        <Text variant="labelLarge">Datos del evento</Text>
        <VStack spacing={10}>
          <TextInput
            mode="outlined"
            value={name}
            onChangeText={setName}
            label="Nombre del evento"
            maxLength={50}
          />
          <TextInput
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            label="Descripción del evento"
            maxLength={250}
            numberOfLines={3}
            multiline={true}
          />
          <TextInput
            mode="outlined"
            value={offered_hours}
            onChangeText={setOffered_hours}
            label="Número de horas ofertadas"
            maxLength={3}
            keyboardType="number-pad"
            autoComplete="off"
          />
          <TextInput
            mode="outlined"
            value={tolerance}
            onChangeText={setTolerance}
            label="Minutos de tolerancia"
            maxLength={3}
            keyboardType="number-pad"
            autoComplete="off"
          />
          <TextInput
            mode="outlined"
            value={vacancy}
            onChangeText={setVacancy}
            label="Número de vacantes"
            maxLength={3}
            keyboardType="number-pad"
            autoComplete="off"
          />

          <Flex>
            <Text variant="labelMedium">Fecha y hora de inicio</Text>
            <DateAndTimerPicker
              actualDate={starting_date}
              selectedDate={setStarting_date}
            />
          </Flex>

          <Flex>
            <Text variant="labelMedium">Fecha y hora de termino</Text>
            <DateAndTimerPicker
              actualDate={ending_date}
              selectedDate={setEnding_date}
            />
          </Flex>

          <Flex>
            <Text variant="labelMedium">Fecha y hora de publicación</Text>
            <DateAndTimerPicker
              actualDate={publishing_date}
              selectedDate={setPublishing_date}
            />
          </Flex>

          <Flex>
            <Dropdown
              title="Bosque urbano"
              value={place}
              selected={setPlace}
              options={placesOptions}
            />
          </Flex>
        </VStack>
      </VStack>
    )
  }

  const ImageData = () => (
    <VStack
      key="Image"
      spacing={5}
    >
      <Text variant="labelLarge">Foto para el evento</Text>
      <VStack spacing={10}>
        <ImageSelector
          value={avatar}
          setter={setAvatar}
          type="rectangular"
        />
      </VStack>
    </VStack>
  )

  const Delete = () => (
    <VStack
      key="Delete"
      spacing={5}
    >
      <Text variant="labelLarge">Eliminar evento</Text>
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
        savePlace()
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
        title="Editar evento"
        children={[Data(), ImageData(), Delete()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />

      <ModalMessage
        title="Eliminar evento"
        description="¿Seguro que deseas eliminar este evento? La acción no se podrá deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm), deleteEvent()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El evento ha sido actualizado"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[["Aceptar", () => navigation.pop()]]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El evento ha sido eliminado"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[["Aceptar", () => navigation.pop(2)]]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar el evento, inténtalo más tarde (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos eliminar el evento, inténtalo más tarde (${responseCode})`}
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
