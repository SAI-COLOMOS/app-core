import { Flex, HStack, VStack } from "@react-native-material/core"
import { useHeaderHeight } from "@react-navigation/elements"
import { useCallback, useContext, useEffect, useState } from "react"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import { Button, TextInput, useTheme, Text, Switch } from "react-native-paper"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"
import { Pressable } from "react-native"

export default AddCard = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()
  const { host, token } = useContext(ApplicationContext)
  const { register, getCard } = route.params
  const theme = useTheme()

  const [activity_name, setActivity_name] = useState("")
  const [hours, setHours] = useState("")
  const [penalized, setPenalized] = useState(false)
  const [validated, setValidated] = useState(false)

  const [loading, setLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function SaveCard() {
    setLoading(true)

    const request = await fetch(`${host}/cards/${register}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        activity_name: activity_name.trim(),
        hours: Math.abs(Number(hours)),
        toSubstract: penalized
      })
    })
      .then((response) => response.status)
      .catch((error) => null)
    setLoading(false)

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
    let valid = true

    activity_name?.length == 0 ? (valid = false) : null
    hours?.length == 0 ? (valid = false) : null

    setValidated(valid)
  }, [activity_name, hours])

  const Activity = () => (
    <VStack
      spacing={5}
      key="Activity"
    >
      <Text variant="labelLarge">Actividad realizada</Text>
      <VStack spacing={10}>
        <TextInput
          mode="outlined"
          value={activity_name}
          onChangeText={setActivity_name}
          label="Nombre de actividad"
          maxLength={150}
          numberOfLines={1}
          multiline={true}
        />

        <TextInput
          mode="outlined"
          value={hours}
          onChangeText={setHours}
          label="Horas a asignar"
          keyboardType="numeric"
          maxLength={3}
          numberOfLines={1}
          multiline={true}
          left={penalized == true && <TextInput.Affix text="-" />}
          right={<TextInput.Affix text="hrs" />}
        />

        <Pressable onPress={() => setPenalized(!penalized)}>
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
        </Pressable>
      </VStack>
    </VStack>
  )

  const Save = () => {
    return (
      <Button
        mode="contained"
        icon="content-save-outline"
        key="Save"
        disabled={loading || !validated}
        loading={loading}
        onPress={() => {
          SaveCard()
        }}
      >
        Guardar
      </Button>
    )
  }

  const Cancel = () => {
    return (
      <Button
        disabled={loading}
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

  return (
    <Flex fill>
      <CreateForm
        navigation={navigation}
        title={"Añadir actividad"}
        children={[Activity()]}
        actions={[Save(), Cancel()]}
        loading={loading}
      />

      <ModalMessage
        title="¡Listo!"
        description="La actividad ha sido creada"
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
        title="Ocurrió un problema"
        description={`No pudimos crear la actividad, inténtalo más tarde. ${responseCode}`}
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
