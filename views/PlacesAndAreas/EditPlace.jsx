import { Flex, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"

export default EditPlace = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const theme = useTheme()
  const { place, image, getPlace, getPlaces } = route.params

  const [place_name, setPlace_name] = useState(`${place.place_name}`)
  const [street, setStreet] = useState(`${place.street}`)
  const [exterior_number, setExterior_number] = useState(`${place.exterior_number}`)
  const [colony, setColony] = useState(`${place.colony}`)
  const [municipality, setMunicipality] = useState(`${place.municipality}`)
  const [postal_code, setPostal_code] = useState(`${place.postal_code}`)
  const [phone, setPhone] = useState(`${place.phone}`)
  const [reference, setReference] = useState(`${place.reference}`)
  const [avatar, setAvatar] = useState(image ?? null)
  const [verified, setVerified] = useState(false)

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

    const request = await fetch(`${host}/places/${place.place_identifier}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        place_name: place_name.trim(),
        municipality: municipality.trim(),
        street: street.trim(),
        exterior_number: exterior_number.trim(),
        colony: colony.trim(),
        postal_code: postal_code.trim(),
        phone: phone.trim(),
        reference: reference.trim(),
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

  async function deletePlace() {
    setModalLoading(true)

    const request = await fetch(`${host}/places/${place.place_identifier}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => response.status)
      .catch(() => null)

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
    <VStack
      key="Data"
      spacing={5}
    >
      <Text variant="labelLarge">Datos del bosque urbano</Text>
      <VStack spacing={10}>
        <TextInput
          mode="outlined"
          value={place_name}
          onChangeText={setPlace_name}
          label="Nombre del bosque urbano"
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={street}
          onChangeText={setStreet}
          label="Calle"
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={exterior_number}
          onChangeText={setExterior_number}
          label="Número del domicilio"
          maxLength={150}
          multiline={true}
          numberOfLines={1}
          keyboardType="numeric"
        />
        <TextInput
          mode="outlined"
          value={colony}
          onChangeText={setColony}
          label="Colonia"
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={municipality}
          onChangeText={setMunicipality}
          label="Municipio"
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={postal_code}
          onChangeText={setPostal_code}
          label="Código postal"
          maxLength={5}
          multiline={true}
          numberOfLines={1}
          keyboardType="numeric"
          autoComplete="off"
        />
        <TextInput
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          label="Número telefónico"
          maxLength={10}
          multiline={true}
          numberOfLines={1}
          keyboardType="phone-pad"
          autoComplete="off"
        />
        <TextInput
          mode="outlined"
          value={reference}
          onChangeText={setReference}
          label="Referencia del lugar"
          maxLength={500}
          multiline={true}
          numberOfLines={3}
        />
      </VStack>
    </VStack>
  )

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

  const Delete = () => (
    <VStack
      key="Delete"
      spacing={5}
    >
      <Text variant="labelLarge">Eliminar bosque urbano</Text>
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
        title="Editar bosque urbano"
        children={[Data(), ImageData(), Delete()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />

      <ModalMessage
        title="Eliminar bosque urbano"
        description="¿Seguro que deseas eliminar este lugar? La acción no se podrá deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm)
              deletePlace()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El lugar ha sido actualizado"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getPlace()
              getPlaces()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El lugar ha sido eliminado"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[
          [
            "Aceptar",
            () => {
              getPlaces()
              navigation.pop(2)
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar el lugar, inténtalo más tarde (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos eliminar el lugar, inténtalo más tarde (${responseCode})`}
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
