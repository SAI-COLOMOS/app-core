import { even, Flex, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import Constants from 'expo-constants'
import CreateForm from '../Shared/CreateForm'
import ModalMessage from '../Shared/ModalMessage'

export default EditEvent = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()
  const { token, event, event_identifier } = route.params

  const [name, setName] = useState(`${event.name}`)
  const [description, setDescription] = useState(`${event.description}`)
  const [offered_hours, setOfered_hours] = useState(`${event.offered_hours}`)
  const [tolerance, setTolerance] = useState(`${event.tolerance}`)
  const [vacancy, setVacancy] = useState(`${event.vacancy}`)
  const [starting_date, setStarting_date] = useState(`${event.starting_date}`)
  const [ending_date, setEnding_date] = useState(`${event.ending_date}`)
  const [author_register, setAuthor_register] = useState(`${event.author_register}`)
  const [modifier_register, setmodifier_register] = useState(`${event.modifier_register}`)
  const [publishing_date, setPublishing_date] = useState(`${event.publishing_date}`)
  const [place, setPlace] = useState(`${event.place}`)
  const [belonging_area, setBelonging_area] = useState(`${event.belonging_area}`)
  const [belonging_place, setBelonging_place] = useState(`${event.belonging_place}`)
  const [verified, setVerified] = useState(false)

  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState('')

  async function savePlace() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/agenda/${event_identifier}`,{
      method: 'PATCH',
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
        publishing_date: publishing_date.trim(),
        place: place.trim(),
        modifier_register: modifier_register.trim()
      })
    })
      .then((response) => response.status)
      .catch(() => null)

      //const json = await request.json()
      //console.log(json)
      
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

    const request = await fetch(`${localhost}/agenda/${event_identifier}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
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
      <VStack key="Data" spacing={5}>
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
          <TextInput mode="outlined" value={publishing_date} onChangeText={setPublishing_date} label="Fecha de publicación" maxLength={10} keyboardType="number-pad" autoComplete="off"/>
          <TextInput mode="outlined" value={place} onChangeText={setPlace} autoCapitalize="words" label="Lugar" maxLength={50} />
          <TextInput mode="outlined" value={belonging_area} onChangeText={setBelonging_area} autoCapitalize="words" label="Área de origen" maxLength={150} />
          <TextInput mode="outlined" value={belonging_place} onChangeText={setBelonging_place} autoCapitalize="words" label="Lugar de origen" maxLength={150} />
          <TextInput mode="outlined" value={modifier_register} onChangeText={setmodifier_register} autoCapitalize="words" label="modificacion del registro" maxLength={150} />
        </VStack>
      </VStack>
    )
  }

  const Delete = () => (
    <VStack key="Delete" spacing={5}>
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
      <CreateForm title="Editar evento" children={[Data(), Delete()]} actions={[Save(), Cancel()]} navigation={navigation} loading={modalLoading} />

      <ModalMessage
        title="Eliminar evento"
        description="¿Seguro que deseas eliminar este evento? La acción no se podrá deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ['Cancelar', () => setModalConfirm(!modalConfirm)],
          [
            'Aceptar',
            () => {
              setModalConfirm(!modalConfirm), deleteEvent()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage title="¡Listo!" description="El evento ha sido actualizado" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline" />

      <ModalMessage title="¡Listo!" description="El evento ha sido eliminado" handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]} actions={[['Aceptar', () => navigation.pop(2)]]} dismissable={false} icon="check-circle-outline" />

      <ModalMessage title="Ocurrió un problema" description={`No pudimos actualizar el evento, inténtalo más tarde (${responseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />

      <ModalMessage title="Ocurrió un problema" description={`No pudimos eliminar el evento, inténtalo más tarde (${responseCode})`} handler={[modalErrorDelete, () => setModalErrorDelete(!modalErrorDelete)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />

      <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert" />
    </Flex>
  )
}
