import { Flex, VStack } from "@react-native-material/core"
import CreateForm from "../Shared/CreateForm"
import { Button, Card, Text, useTheme } from "react-native-paper"
import { useContext, useState } from "react"
import ApplicationContext from "../ApplicationContext"
import ModalMessage from "../Shared/ModalMessage"

export default SurveyResume = ({ navigation, route }) => {
  const theme = useTheme()
  const { host, token } = useContext(ApplicationContext)
  const { questions, answers, survey_identifier } = route.params

  const [loading, setLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function sendResponses() {
    try {
      setLoading(true)

      const request = await fetch(`${host}/surveys/${survey_identifier}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          answers
        })
      })

      setLoading(false)

      if (request?.ok) {
        setModalSuccess(true)
        return
      }

      setResponseCode(request.status)
      setModalError(true)
      return
    } catch (error) {
      console.error(error)
      setLoading(false)
      setModalFatal(true)
    }
  }

  const arrayToString = (array) => {
    let string = ""

    array?.forEach((item, index) => {
      if (index === 0) {
        string += item.toLowerCase().trim()
      } else if (index === array.length - 1) {
        string += ` y ${item.toLowerCase().trim()}`
      } else {
        string += `, ${item.toLowerCase().trim()}`
      }
    })

    return string
  }

  const Answers = () => (
    <Flex>
      <VStack spacing={10}>
        {questions?.length > 0 &&
          questions.map((question) => {
            const response = answers[question.question_identifier]

            return (
              <Card
                key={question.question_identifier}
                mode="outlined"
              >
                <VStack p={20}>
                  <Flex fill>
                    <Text variant="labelMedium">{question.interrogation}</Text>
                  </Flex>

                  <Flex fill>
                    <Text
                      variant="bodyLarge"
                      style={{ color: response == null || response == "" ? theme.colors.error : theme.colors.onBackground }}
                    >
                      {response != null && response != ""
                        ? {
                            Abierta: response,
                            Numérica: response,
                            "Opción múltiple": `Opción seleccionada: ${response}`,
                            "Selección múltiple": typeof response == "object" && `${response?.length > 1 ? "Opciones seleccionadas" : "Opción seleccionada"}: ${arrayToString(response)}`,
                            Escala: `Valor seleccionado: ${response}`
                          }[question.question_type]
                        : "Sin respuesta"}
                    </Text>
                  </Flex>
                </VStack>
              </Card>
            )
          })}
      </VStack>
    </Flex>
  )

  const Back = () => (
    <Button
      key="Back"
      disabled={loading}
      icon="page-previous-outline"
      onPress={() => navigation.pop()}
      mode="outlined"
    >
      Regresar
    </Button>
  )

  const Submit = () => (
    <Button
      key="Submit"
      icon="send-outline"
      disabled={loading}
      loading={loading}
      onPress={() => sendResponses()}
      mode="contained"
    >
      Enviar
    </Button>
  )

  return (
    <Flex fill>
      <CreateForm
        navigation={navigation}
        title="Resumen de la encuesta"
        children={[Answers()]}
        actions={[Submit(), Back()]}
        loading={loading}
      />

      <ModalMessage
        title="¡Listo!"
        description="La encuesta ha sido guardada"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              navigation.pop(2)
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos guardar la encuesta, inténtalo más tarde (${responseCode})`}
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
