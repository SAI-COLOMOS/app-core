import { Flex, VStack } from "@react-native-material/core"
import { useHeaderHeight } from "@react-navigation/elements"
import { useCallback, useContext, useEffect, useState } from "react"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import { Button, TextInput, useTheme, Text } from "react-native-paper"
import ModalMessage from "../Shared/ModalMessage"
import { ScrollView } from "react-native"
import { LongDate } from "../Shared/LocaleDate"
import { DateAndTimerPicker } from "../Shared/TimeAndDatePicker"
import ApplicationContext from "../ApplicationContext"

export default AddCard = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()
  const { token } = useContext(ApplicationContext)
  const { register } = route.params
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const theme = useTheme()

  const [activity_name, setActivity_name] = useState("")
  const [hours, setHours] = useState("")

  const [loading, setLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function SaveCard() {
    setLoading(true)

    const request = await fetch(`${localhost}/cards/${register}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        activity_name: activity_name.trim(),
        hours: Number(hours)
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

  const Activity = () => {
    return (
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
            maxLength={50}
            autoCapitalize="words"
            autoComplete="off"
            autoCorrect={false}
          />
          <TextInput
            mode="outlined"
            value={hours}
            onChangeText={setHours}
            label="Horas a asignar"
            keyboardType="numeric"
            maxLength={3}
            autoComplete="off"
            autoCorrect={false}
          />
        </VStack>
      </VStack>
    )
  }

  const Save = () => {
    return (
      <Button
        mode="contained"
        icon="content-save-outline"
        key="Save"
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
        actions={[["Aceptar", () => navigation.pop()]]}
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
