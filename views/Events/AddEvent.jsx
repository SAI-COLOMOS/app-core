import { Flex, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import Constants from 'expo-constants'
import CreateForm from '../Shared/CreateForm'
import ModalMessage from '../Shared/ModalMessage'

export default AddEvent = ({ navigation, route }) => {
  const { token } = route.params
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [offered_hours, setOfered_hours] = useState('')
  const [tolerance, setTolerance] = useState('')
  const [vacancy, setVacancy] = useState('')
  const [starting_date, setStarting_date] = useState('')
  const [ending_date, setEnding_date] = useState('')
  const [author_register, setAuthor_register] = useState('')
  const [publishing_date, setPublishing_date] = useState('')
  const [place, setPlace] = useState('')
  const [belonging_area, setBelonging_area] = useState('')
  const [belonging_place, setBelonging_place] = useState('')
  const [verified, setVerified] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState('')

  async function saveEvent() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/agenda`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        offered_hours: Number(offered_hours.trim()),
        tolerance: Number(tolerance.trim()),
        vacancy: Number(vacancy.trim()),
        starting_date: starting_date.trim(),
        ending_date: ending_date.trim(),
        author_register: author_register.trim(),
        publishing_date: publishing_date.trim(),
        place: place.trim(),
        belonging_area: belonging_area.trim(),
        belonging_place: belonging_place.trim()
      })
    })
       .then((response) => response.status)
       .catch(() => null)

      //const json = await request.json()
      //console.log(json)

    setModalLoading(false)

    if (request == 201) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  useEffect(() => {
    let check = true

    name.length > 0 ? null : (check = false)
    description.length > 0 ? null : (check = false)
    offered_hours.length > 0 ? null : (check = false)
    tolerance.length > 0 ? null : (check = false)
    vacancy.length > 0 ? null : (check = false)
    starting_date.length > 0 ? null : (check = false)
    ending_date.length > 0 ? null : (check = false)
    author_register.length > 0 ? null : (check = false)
    publishing_date.length > 0 ? null : (check = false)
    place.length > 0 ? null : (check = false)
    belonging_area.length > 0 ? null : (check = false)
    belonging_place.length > 0 ? null : (check = false)

    if (check) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [name, description, offered_hours, tolerance, vacancy, starting_date, ending_date, author_register, publishing_date, place, belonging_area, belonging_place])
  
  const Data = () => {
    return (
      <VStack spacing={5}>
        <Text variant="labelLarge">Datos del evento</Text>
        <VStack spacing={10}>
          <TextInput mode="outlined" value={name} onChangeText={setName} autoCapitalize="words" label="Nombre del evento" maxLength={50} />
          <TextInput mode="outlined" value={description} onChangeText={setDescription} label="Descripción del evento" maxLength={250} />
          <TextInput mode="outlined" value={offered_hours} onChangeText={setOfered_hours} label="Número de horas ofertadas" maxLength={3} keyboardType="number-pad" autoComplete="off" />
          <TextInput mode="outlined" value={tolerance} onChangeText={setTolerance} label="Minutos de tolerancia" maxLength={3} keyboardType="number-pad" autoComplete="off" />
          <TextInput mode="outlined" value={vacancy} onChangeText={setVacancy} label="Número de vacantes" maxLength={3} keyboardType="number-pad" autoComplete="off" />
          <TextInput mode="outlined" value={starting_date} onChangeText={setStarting_date} label="Fecha de inicio" maxLength={10} keyboardType="number-pad" autoComplete="off"/>
          <TextInput mode="outlined" value={ending_date} onChangeText={setEnding_date} label="Fecha de termino" maxLength={10} keyboardType="number-pad" autoComplete="off"/>
          <TextInput mode="outlined" value={author_register} onChangeText={setAuthor_register} label="Registro" maxLength={20} keyboardType="number-pad" autoComplete="off"/>
          <TextInput mode="outlined" value={publishing_date} onChangeText={setPublishing_date} label="Fecha de publiación" maxLength={10} keyboardType="number-pad" autoComplete="off"/>
          <TextInput mode="outlined" value={place} onChangeText={setPlace} autoCapitalize="words" label="Lugar" maxLength={50} />
          <TextInput mode="outlined" value={belonging_area} onChangeText={setBelonging_area} autoCapitalize="words" label="Área de origen" maxLength={150} />
          <TextInput mode="outlined" value={belonging_place} onChangeText={setBelonging_place} autoCapitalize="words" label="Lugar de origen" maxLength={150} />
        </VStack>
      </VStack>
    )
  }

  const Save = () => {
    return (
      <Button
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
      <CreateForm title="Añadir nuevo evento" children={[Data()]} actions={[Save(), Cancel()]} navigation={navigation} loading={modalLoading} />

      <ModalMessage title="¡Listo!" description="El evento ha sido añadido exitosamente" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline" />

      <ModalMessage title="Ocurrió un problema" description={`No pudimos añadir el evento, inténtalo más tarde. (${responseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />

      <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert" />
    </Flex>
  )
}
