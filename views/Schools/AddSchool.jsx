import { Flex, VStack } from '@react-native-material/core'
import { useEffect, useState } from 'react'
import { Button, Text, TextInput } from 'react-native-paper'
import Constants from 'expo-constants'
import CreateForm from '../Shared/CreateForm'
import ModalMessage from '../Shared/ModalMessage'

export default AddSchool = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { token } = route.params

  const [school_name, setSchool_name] = useState('')
  const [municipality, setMunicipality] = useState('')
  const [street, setStreet] = useState('')
  const [postal_code, setPostal_code] = useState('')
  const [exterior_number, setExterior_number] = useState('')
  const [colony, setColony] = useState('')
  const [phone, setPhone] = useState('')
  const [reference, setReference] = useState('')
  const [verified, setVerified] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState('')

  async function saveSchool() {
    setModalLoading(true)

    const request = await fetch(`${localhost}/schools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
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

    school_name.length > 0 ? null : (check = false)
    municipality.length > 0 ? null : (check = false)
    street.length > 0 ? null : (check = false)
    exterior_number.length > 0 ? null : (check = false)
    colony.length > 0 ? null : (check = false)
    postal_code.length == 5 ? null : (check = false)
    phone.length == 10 ? null : (check = false)

    if (check) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [school_name, municipality, street, postal_code, exterior_number, colony, phone])

  const Data = () => {
    return (
      <VStack spacing={5}>
        <Text variant="labelLarge">Datos de la escuela</Text>
        <VStack spacing={10}>
          <TextInput mode="outlined" value={school_name} onChangeText={setSchool_name} label="Nombre de la escuela" maxLength={150} autoComplete="off" autoCapitalize="words" />
          <TextInput mode="outlined" value={phone} onChangeText={setPhone} label="Teléfono de la escuela" maxLength={10} autoComplete="off" keyboardType="phone-pad" />
        </VStack>
      </VStack>
    )
  }

  const Address = () => {
    return (
      <VStack spacing={5}>
        <Text variant="labelLarge">Dirección de la escuela</Text>
        <VStack spacing={10}>
          <TextInput mode="outlined" value={street} onChangeText={setStreet} label="Calle de la escuela" maxLength={150} autoComplete="off" />
          <TextInput mode="outlined" value={exterior_number} onChangeText={setExterior_number} label="Número de la escuela" keyboardType="number-pad" maxLength={10} autoComplete="off" />
          <TextInput mode="outlined" value={colony} onChangeText={setColony} label="Colonia de la escuela" maxLength={150} autoComplete="off" autoCapitalize="words" />
          <TextInput mode="outlined" value={municipality} onChangeText={setMunicipality} label="Municipio de la escuela" maxLength={150} autoComplete="off" autoCapitalize="words" />
          <TextInput mode="outlined" value={postal_code} onChangeText={setPostal_code} label="Código postal de la escuela" maxLength={5} autoComplete="off" keyboardType="number-pad" />
          <TextInput mode="outlined" value={reference} onChangeText={setReference} label="Referencias de la escuela" maxLength={250} autoComplete="off" numberOfLines={3} multiline={true} />
        </VStack>
      </VStack>
    )
  }

  const Save = (_) => {
    return (
      <Button
        icon="content-save-outline"
        disabled={modalLoading || !verified}
        loading={modalLoading}
        mode="contained"
        onPress={() => {
          saveSchool()
        }}
      >
        Guardar
      </Button>
    )
  }

  const Cancel = (_) => {
    return (
      <Button
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
  }

  return (
    <Flex fill>
      <CreateForm title="Añadir escuela" children={[Data(), Address()]} actions={[Save(), Cancel()]} navigation={navigation} loading={modalLoading} />
      <ModalMessage title="¡Listo!" description="La escuela ha sido añadida" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.pop()]]} dismissable={false} icon="check-circle-outline" />
      <ModalMessage title="Ocurrió un problema" description={`No pudimos añadir la escuela, inténtalo más tarde. (${responseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline" />
      <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert" />
    </Flex>
  )
}
