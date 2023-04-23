import { Flex, HStack, VStack } from "@react-native-material/core"
import { useHeaderHeight } from "@react-navigation/elements"
import { Button, Card, Text, useTheme } from "react-native-paper"
import { MultipleOption, MultipleSelection, NumericQuestion, OpenQuestion, ScaleQuestion } from "../Shared/FormsComponents"
import { useContext, useEffect, useState } from "react"
import ApplicationContext from "../ApplicationContext"
import Header from "../Shared/Header"
import DisplayDetails from "../Shared/DisplayDetails"

export default ApplySurvey = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()
  const { host, token } = useContext(ApplicationContext)
  const { form_identifier, getForms } = route.params
  const theme = useTheme()

  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [survey, setSurvey] = useState(undefined)
  const [isTemplate, setIsTemplate] = useState(false)

  async function getForm() {
    setLoading(true)

    const request = await fetch(`${host}/forms/${form_identifier}?isTemplate=true`, {
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
      setSurvey(request.form)
      console.log(request)
    } else {
      setSurvey(request)
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
    if (survey?.questions !== undefined) {
      const object = {}
      survey?.questions.forEach((element) => {
        object[element?.question_identifier] = null
      })
      setAnswers({ ...object })
    }
  }, [survey])

  useEffect(() => {
    getForm()
  }, [])

  const Info = () => (
    // <VStack
    //   spacing={20}
    // >
    //   <Text variant="headlineSmall">{survey?.name ?? "Encuesta"}</Text>
    //   {survey?.description && <Text variant="bodyMedium">{survey?.description}</Text>}
    //   <Text
    //     fill
    //     variant="bodyMedium"
    //   >
    //     A continuación, se muestran las preguntas correspondientes a esta encuesta
    //   </Text>
    // </VStack>

    <Card
      key="Info"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Datos de la encuesta</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Nombre</Text>
            <Text variant="bodyMedium">{survey?.name ?? "Sin nombre"}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Descripción</Text>
            <Text variant="bodyMedium">{survey?.description ?? "Sin descripción"}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Versión</Text>
            <Text variant="bodyMedium">{survey?.version ?? "Sin versión"}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const Questions = () => (
    <VStack spacing={20}>
      {survey?.questions.length > 0 &&
        survey.questions.map((question, index) => (
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

  const Buttons = () => (
    <HStack
      key="Button"
      justify="between"
    >
      <Button
        mode="outlined"
        icon="close"
        onPress={() => navigation.pop()}
      >
        Cancelar
      </Button>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("SurveyResume", { questions: survey?.questions, answers })}
        icon="page-next-outline"
      >
        Continuar
      </Button>
    </HStack>
  )

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      {survey !== undefined ? (
        survey !== null ? (
          isNaN(survey) ? (
            <DisplayDetails
              showHeader={false}
              title={survey?.name}
              children={[Info(), Questions(), Buttons()]}
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
                  No podemos recuperar los datos del formulario, inténtalo de nuevo más tarde (Error: {survey})
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
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
