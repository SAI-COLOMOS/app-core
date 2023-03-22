import { Flex, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import Constants from 'expo-constants'
import CreateForm from '../Shared/CreateForm'
import ModalMessage from '../Shared/ModalMessage'

export default AddPlace = ({ navigation, route }) => {
  const { token } = route.params
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [place_name, setPlace_name] = useState('')
  const [street, setStreet] = useState('')
  const [exterior_number, setExterior_number] = useState('')
  const [colony, setColony] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [postal_code, setPostal_code] = useState('')
  const [phone, setPhone] = useState('')
  const [reference, setReference] = useState('')
  const [verified, setVerified] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState('')

  async function savePlace() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/places`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        place_name: place_name.trim(),
        street: street.trim(),
        exterior_number: exterior_number.trim(),
        colony: colony.trim(),
        municipality: municipality.trim(),
        postal_code: postal_code.trim(),
        phone: phone.trim(),
        reference: reference.trim()
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
  }

  useEffect(() => {
    let check = true

    place_name.length > 0 ? null : (check = false)
    street.length > 0 ? null : (check = false)
    exterior_number.length > 0 ? null : (check = false)
    colony.length > 0 ? null : (check = false)
    municipality.length > 0 ? null : (check = false)
    postal_code.length == 5 ? null : (check = false)
    phone.length == 10 ? null : (check = false)

    if (check) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [place_name, street, exterior_number, colony, municipality, postal_code, phone])

  const Data = () => (
    <VStack spacing={5}>
      <Text variant="labelLarge">Datos del bosque urbano</Text>
      <VStack spacing={10}>
        <TextInput mode="outlined" value={place_name} onChangeText={setPlace_name} autoCapitalize="words" label="Nombre del bosque urbano" maxLength={50} />
        <TextInput mode="outlined" value={street} onChangeText={setStreet} label="Nombre de la calle" maxLength={50} />
        <TextInput mode="outlined" value={exterior_number} onChangeText={setExterior_number} label="Número del domicilio" maxLength={50} keyboardType="number-pad" autoComplete="off" />
        <TextInput mode="outlined" value={colony} onChangeText={setColony} autoCapitalize="words" label="Nombre de la colonia" maxLength={50} />
        <TextInput mode="outlined" value={municipality} onChangeText={setMunicipality} autoCapitalize="words" label="Nombre del municipio" maxLength={50} />
        <TextInput mode="outlined" value={postal_code} onChangeText={setPostal_code} label="Código postal" maxLength={5} keyboardType="number-pad" autoComplete="off" />
        <TextInput mode="outlined" value={phone} onChangeText={setPhone} label="Número telefónico" maxLength={10} keyboardType="phone-pad" autoComplete="off" />
        <TextInput mode="outlined" value={reference} onChangeText={setReference} label="Referencia del lugar" maxLength={250} />
      </VStack>
    </VStack>
  )

  const Save = () => (
    <Button
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
      <CreateForm title="Añadir nuevo bosque urbano" children={[<Data key="Data" />]} actions={[<Save key="Save" />, <Cancel key="Cancel" />]} navigation={navigation} loading={modalLoading} />

      <ModalMessage title="¡Listo!" description="El bosque urbano ha sido añadido exitosamente" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline" />

      <ModalMessage title="Ocurrió un problema" description={`No pudimos añadir el bosque urbano, inténtalo más tarde. (${responseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />

      <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert" />
    </Flex>
  )
}
