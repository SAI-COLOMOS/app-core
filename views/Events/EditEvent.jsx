import { even, Flex, HStack, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { Button, Text, TextInput, useTheme, IconButton, ActivityIndicator } from "react-native-paper"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"
import DateAndTimePicker from "../Shared/DateAndTimePicker"
import Dropdown from "../Shared/Dropdown"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { ShortDate, Time24 } from "../Shared/LocaleDate"

export default EditEvent = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const theme = useTheme()
  const { event, event_identifier, image, getEvent, getEvents } = route.params
  const actualDate = new Date()
  actualDate.getSeconds(0)
  actualDate.setMilliseconds(0)

  const [name, setName] = useState(`${event.name}`)
  const [description, setDescription] = useState(`${event.description}`)
  const [offered_hours, setOffered_hours] = useState(`${event.offered_hours}`)
  const [tolerance, setTolerance] = useState(`${event.tolerance}`)
  const [vacancy, setVacancy] = useState(`${event.vacancy}`)
  const [starting_date, setStarting_date] = useState(new Date(event.starting_date))
  const [ending_date, setEnding_date] = useState(new Date(event.ending_date))
  const [publishing_date, setPublishing_date] = useState(new Date(event.publishing_date))
  const [avatar, setAvatar] = useState(image ?? null)
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

    const request = await fetch(`${host}/agenda/${event_identifier}`, {
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

    const request = await fetch(`${host}/agenda/${event_identifier}`, {
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

    const request = await fetch(`${host}/places`, {
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

    starting_date.getTime() < publishing_date.getTime() + 3 * 60 * 60 * 1000 ? (check = false) : null
    starting_date.getTime() >= ending_date.getTime() + 3 * 60 * 60 * 1000 ? (check = false) : null

    ending_date.getTime() <= starting_date.getTime() ? (check = false) : null
    ending_date.getTime() <= publishing_date.getTime() ? (check = false) : null

    publishing_date.getTime() > starting_date.getTime() - 3 * 60 * 60 * 1000 ? (check = false) : null
    publishing_date.getTime() > ending_date.getTime() ? (check = false) : null

    if (check) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [name, description, offered_hours, tolerance, vacancy, starting_date, ending_date, publishing_date, place])

  const Data = () => (
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
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          label="Descripción del evento"
          maxLength={500}
          multiline={true}
          numberOfLines={5}
        />
        <TextInput
          mode="outlined"
          value={offered_hours}
          onChangeText={setOffered_hours}
          label="Número de horas ofertadas"
          maxLength={3}
          keyboardType="numeric"
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={tolerance}
          onChangeText={setTolerance}
          label="Minutos de tolerancia"
          maxLength={3}
          keyboardType="numeric"
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={vacancy}
          onChangeText={setVacancy}
          label="Número de vacantes"
          maxLength={3}
          keyboardType="numeric"
          multiline={true}
          numberOfLines={1}
        />

        <Flex>
          <DateAndTimePicker
            title="Fecha y hora de inicio"
            date={starting_date}
            setDate={setStarting_date}
          />
          {starting_date.getTime() < publishing_date.getTime() + 3 * 60 * 60 * 1000 && (
            <HStack
              pv={5}
              ph={10}
              spacing={10}
              items="center"
            >
              <Icon
                name="alert"
                size={20}
                color={theme.colors.error}
              />
              <Flex fill>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.error }}
                >
                  La fecha de inicio no puede ser menor a la fecha de publicación más tres horas ({ShortDate(new Date(publishing_date.getTime() + 3 * 60 * 60 * 1000))} a las {Time24(new Date(publishing_date.getTime() + 3 * 60 * 60 * 1000))})
                </Text>
              </Flex>
            </HStack>
          )}
          {starting_date.getTime() >= ending_date.getTime() + 3 * 60 * 60 * 1000 && (
            <HStack
              pv={5}
              ph={10}
              spacing={10}
              items="center"
            >
              <Icon
                name="alert"
                size={20}
                color={theme.colors.error}
              />
              <Flex fill>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.error }}
                >
                  La fecha de inicio no puede ser mayor o igual a la fecha de termino ({ShortDate(ending_date)} a las {Time24(ending_date)})
                </Text>
              </Flex>
            </HStack>
          )}
        </Flex>

        <Flex>
          <DateAndTimePicker
            title="Fecha y hora de termino"
            date={ending_date}
            setDate={setEnding_date}
          />
          {ending_date.getTime() <= starting_date.getTime() && (
            <HStack
              pv={5}
              ph={10}
              spacing={10}
              items="center"
            >
              <Icon
                name="alert"
                size={20}
                color={theme.colors.error}
              />
              <Flex fill>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.error }}
                >
                  La fecha de termino no puede ser menor o igual a la fecha de inicio ({ShortDate(starting_date)} a las {Time24(starting_date)})
                </Text>
              </Flex>
            </HStack>
          )}
          {ending_date.getTime() <= publishing_date.getTime() && (
            <HStack
              pv={5}
              ph={10}
              spacing={10}
              items="center"
            >
              <Icon
                name="alert"
                size={20}
                color={theme.colors.error}
              />
              <Flex fill>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.error }}
                >
                  La fecha de termino no puede ser menor o igual a la fecha de publicación (({ShortDate(publishing_date)} a las {Time24(publishing_date)}))
                </Text>
              </Flex>
            </HStack>
          )}
        </Flex>

        <Flex>
          <DateAndTimePicker
            title="Fecha y hora de publicación"
            date={publishing_date}
            setDate={setPublishing_date}
          />
          {publishing_date.getTime() > starting_date.getTime() - 3 * 60 * 60 * 1000 && (
            <HStack
              pv={5}
              ph={10}
              spacing={10}
              items="center"
            >
              <Icon
                name="alert"
                size={20}
                color={theme.colors.error}
              />
              <Flex fill>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.error }}
                >
                  La fecha de publicación no puede ser mayor a la fecha de inicio menos tres horas ({ShortDate(new Date(starting_date.getTime() - 3 * 60 * 60 * 1000))} a las {Time24(new Date(starting_date.getTime() - 3 * 60 * 60 * 1000))})
                </Text>
              </Flex>
            </HStack>
          )}
          {publishing_date.getTime() > ending_date.getTime() && (
            <HStack
              pv={5}
              ph={10}
              spacing={10}
              items="center"
            >
              <Icon
                name="alert"
                size={20}
                color={theme.colors.error}
              />
              <Flex fill>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.error }}
                >
                  La fecha de publicación no puede ser mayor a la fecha de termino ({ShortDate(ending_date)} a las {Time24(ending_date)})
                </Text>
              </Flex>
            </HStack>
          )}
        </Flex>

        <Flex>
          {placesOptions != null ? (
            <Dropdown
              title="Bosque urbano"
              value={place}
              selected={setPlace}
              options={placesOptions}
            />
          ) : loading == true ? (
            <HStack
              fill
              items="center"
              pv={10}
              spacing={20}
            >
              <Flex fill>
                <Text variant="bodyMedium">Obteniendo la lista de bosques urbanos</Text>
              </Flex>
              <ActivityIndicator />
            </HStack>
          ) : (
            <HStack
              fill
              items="center"
              pv={10}
              spacing={20}
            >
              <Flex fill>
                <Text variant="bodyMedium">Ocurrió un problema obteniendo la lista de bosques urbanos</Text>
              </Flex>
              <IconButton
                icon="reload"
                mode="outlined"
                onPress={() => getPlaces()}
              />
            </HStack>
          )}
        </Flex>
      </VStack>
    </VStack>
  )

  const ImageData = () => (
    <VStack
      key="Image"
      spacing={5}
    >
      <Text variant="labelLarge">Imagen alusiva al evento</Text>
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
          disabled={modalLoading}
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
        actions={[
          [
            "Aceptar",
            () => {
              getEvent()
              getEvents()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El evento ha sido eliminado"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[
          [
            "Aceptar",
            () => {
              getEvents()
              navigation.pop(2)
            }
          ]
        ]}
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
