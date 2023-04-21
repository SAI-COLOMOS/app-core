import { Flex, VStack } from "@react-native-material/core"
import { Text, useTheme } from "react-native-paper"
import { MultipleOption, MultipleSelection, NumericQuestion, OpenQuestion, ScaleQuestion } from "../Shared/FormsComponents"
import { useContext, useEffect, useState } from "react"
import ApplicationContext from "../ApplicationContext"
import Header from "../Shared/Header"

export default ApplySurvey = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const { form_identifier, getForms } = route.params
  const theme = useTheme()

  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(undefined)
  const [isTemplate, setIsTemplate] = useState(false)

  async function getForm() {
    setLoading(true)

    const request = await fetch(`${host}/forms/${form_identifier}`, {
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

    if (request?.form) {
      setForm(request.form)
      console.log(request)
    } else {
      setForm(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Aplicación de encuesta"
    })
  }, [])

  useEffect(() => {
    if (form?.questions !== undefined) {
      const object = {}
      form?.questions.forEach((element) => {
        object[element?.question_identifier] = null
      })
      setAnswers({ ...object })
    }
  }, [form])

  const Questions = () => (
    <VStack spacing={20}>
      <Text>{JSON.stringify(answers)}</Text>
      {form?.questions.length > 0 &&
        form.questions.map((question, index) => (
          <Flex key={question.interrogation}>
            {
              {
                "Opción múltiple": (
                  <MultipleOption
                    question={question.interrogation}
                    options={question.enum_options}
                    id={question.question_identifier}
                    getter={answers}
                    setter={setAnswers}
                  />
                ),
                Abierta: (
                  <OpenQuestion
                    question={question.interrogation}
                    id={question.question_identifier}
                    getter={answers}
                    setter={setAnswers}
                  />
                ),
                Numérica: (
                  <NumericQuestion
                    question={question.interrogation}
                    id={question.question_identifier}
                    getter={answers}
                    setter={setAnswers}
                  />
                ),
                "Selección múltiple": (
                  <MultipleSelection
                    question={question.interrogation}
                    options={question.enum_options}
                    id={question.question_identifier}
                    getter={answers}
                    setter={setAnswers}
                  />
                ),
                Escala: (
                  <ScaleQuestion
                    question={question.interrogation}
                    options={question.enum_options}
                    id={question.question_identifier}
                    getter={answers}
                    setter={setAnswers}
                  />
                )
              }[question.question_type]
            }
          </Flex>
        ))}
    </VStack>
  )

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      {form !== undefined ? (
        form !== null ? (
          isNaN(form) ? (
            <DisplayDetails
              icon="form-select"
              title={form?.name}
              children={[Questions()]}
            />
          ) : (
            <VStack
              p={30}
              center
              spacing={20}
            >
              <Icon
                color={theme.colors.onBackground}
                name="alert-circle-outline"
                size={50}
              />
              <VStack center>
                <Text variant="headlineSmall">Ocurrió un problema</Text>
                <Text
                  variant="bodyMedium"
                  style={{ textAlign: "center" }}
                >
                  No podemos recuperar los datos del formulario, inténtalo de nuevo más tarde (Error: {form})
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={(_) => {
                    getForm()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : (
          <VStack
            center
            spacing={20}
            p={30}
          >
            <Icon
              color={theme.colors.onBackground}
              name="wifi-alert"
              size={50}
            />
            <VStack center>
              <Text variant="headlineSmall">Sin internet</Text>
              <Text
                variant="bodyMedium"
                style={{ textAlign: "center" }}
              >
                No podemos recuperar los datos del formulario, revisa tu conexión a internet e inténtalo de nuevo
              </Text>
            </VStack>
            <Flex>
              <Button
                mode="outlined"
                onPress={(_) => {
                  getForm()
                }}
              >
                Volver a intentar
              </Button>
            </Flex>
          </VStack>
        )
      ) : null}
    </Flex>
  )
}
