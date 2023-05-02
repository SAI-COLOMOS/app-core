import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { ActivityIndicator, Button, HelperText, IconButton, Text, TextInput, useTheme } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"
import Dropdown from "../Shared/Dropdown"
import DateAndTimePicker from "../Shared/DateAndTimePicker"
import { LongDate, ShortDate, Time24 } from "../Shared/LocaleDate"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default AddEvent = ({ navigation, route }) => {
  const theme = useTheme()
  const { host, token } = useContext(ApplicationContext)
  const { getEvents } = route.params
  const actualDate = new Date()
  actualDate.getSeconds(0)
  actualDate.setMilliseconds(0)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [offered_hours, setOffered_hours] = useState("")
  const [tolerance, setTolerance] = useState("")
  const [vacancy, setVacancy] = useState("")
  const [starting_date, setStarting_date] = useState(new Date(actualDate.getTime() + 3 * 60 * 60 * 1000))
  const [ending_date, setEnding_date] = useState(new Date(actualDate.getTime() + 7 * 60 * 60 * 1000))
  const [publishing_date, setPublishing_date] = useState(new Date(actualDate))
  const [place, setPlace] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [verified, setVerified] = useState(false)

  const [loading, setLoading] = useState(false)
  const [placesOptions, setPlacesOptions] = useState()
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function saveEvent() {
    try {
      setModalLoading(true)

      const request = await fetch(`${host}/agenda`, {
        method: "POST",
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
          place: place.trim(),
          publishing_date: publishing_date.toISOString(),
          starting_date: starting_date.toISOString(),
          ending_date: ending_date.toISOString(),
          avatar: avatar
        })
      })
        .then((response) => response.status)
        .catch(() => null)

      setModalLoading(false)

      if (request == 201) {
        setModalSuccess(true)
      } else if (request != null) {
        setResponseCode(request)
        setModalError(true)
      } else {
        setModalFatal(true)
      }
    } catch (error) {
      setModalLoading(false)
      console.log(error)
    }
  }

  async function getPlaces() {
    setLoading(true)

    const request = await fetch(`${host}/places`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
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

  const Save = () => {
    return (
      <Button
        key="SaveButton"
        icon="content-save-outline"
        disabled={modalLoading || !verified}
        loading={modalLoading}
        mode="contained"
        onPress={() => {
          saveEvent()
        }}
      >
        Guardar
      </Button>
    )
  }

  const Cancel = () => {
    return (
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
  }

  return (
    <Flex fill>
      <CreateForm
        title="Añadir nuevo evento"
        children={[Data(), ImageData()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />

      <ModalMessage
        title="¡Listo!"
        description="El evento ha sido añadido exitosamente"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getEvents()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos añadir el evento, inténtalo más tarde. (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
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
