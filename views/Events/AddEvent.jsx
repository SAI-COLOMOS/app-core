import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { ActivityIndicator, Button, IconButton, Text, TextInput } from "react-native-paper"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import { DateAndTimerPicker } from "../Shared/TimeAndDatePicker"
import ApplicationContext from "../ApplicationContext"
import Dropdown from "../Shared/Dropdown"

export default AddEvent = ({ navigation, route }) => {
  const { token } = useContext(ApplicationContext)
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [offered_hours, setOffered_hours] = useState("")
  const [tolerance, setTolerance] = useState("")
  const [vacancy, setVacancy] = useState("")
  const [starting_date, setStarting_date] = useState(new Date())
  const [ending_date, setEnding_date] = useState(new Date())
  const [publishing_date, setPublishing_date] = useState(new Date())
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

      const request = await fetch(`${localhost}/agenda`, {
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

          {/* <TextInput mode="outlined" value={starting_date.toString()} onChangeText={setStarting_date} label="Fecha de inicio" keyboardType="number-pad" autoComplete="off" />
          <TextInput mode="outlined" value={ending_date.toISOString()} onChangeText={setEnding_date} label="Fecha de termino" keyboardType="number-pad" autoComplete="off" /> */}

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

          {/* <TextInput mode="outlined" value={} onChangeText={setAuthor_register} label="Registro" maxLength={20} keyboardType="number-pad" autoComplete="off" /> */}
          {/* <TextInput mode="outlined" value={publishing_date} onChangeText={setPublishing_date} label="Fecha de publicación" maxLength={10} keyboardType="number-pad" autoComplete="off" /> */}
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
          {/* <TextInput mode="outlined" value={} onChangeText={setBelonging_area} autoCapitalize="words" label="Área de origen" maxLength={150} /> */}
          {/* <TextInput mode="outlined" value={} onChangeText={setBelonging_place} autoCapitalize="words" label="Lugar de origen" maxLength={150} /> */}
        </VStack>
      </VStack>
    )
  }

  const ImageData = () => (
    <VStack
      key="Image"
      spacing={5}
    >
      <Text variant="labelLarge">Foto del parque</Text>
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
        actions={[["Aceptar", () => navigation.pop()]]}
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
