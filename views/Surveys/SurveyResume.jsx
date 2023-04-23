import { Flex, VStack } from "@react-native-material/core"
import CreateForm from "../Shared/CreateForm"
import { Button, Card, Text, useTheme } from "react-native-paper"

export default SurveyResume = ({ navigation, route }) => {
  const theme = useTheme()
  const { questions, answers } = route.params

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
      onPress={() => navigation.pop()}
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
      />
    </Flex>
  )
}
