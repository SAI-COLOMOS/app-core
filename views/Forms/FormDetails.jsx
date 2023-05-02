import { Flex, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { FlatList, RefreshControl, ScrollView } from "react-native"
import { ActivityIndicator, Avatar, Button, Card, FAB, ProgressBar, Text, useTheme } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"
import Constants from "expo-constants"
import Header from "../Shared/Header"
import DisplayDetails from "../Shared/DisplayDetails"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { log } from "react-native-reanimated"
import ApplicationContext from "../ApplicationContext"
import { MultipleOption, MultipleSelection, NumericQuestion, OpenQuestion, ScaleQuestion } from "../Shared/FormsComponents"

export default FormDetails = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const { form_identifier, getForms } = route.params
  const headerMargin = useHeaderHeight()
  const theme = useTheme()

  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(undefined)
  const [isTemplate, setIsTemplate] = useState(false)

  async function getForm() {
    setLoading(true)

    const request = await fetch(`${host}/forms/${form_identifier}?isTemplate=${true}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    //const json = await request.json()
    //console.log("String: " + json)

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
      headerTitle: "Datos del formulario"
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

  useFocusEffect(
    useCallback(() => {
      getForm()
      return () => {}
    }, [])
  )

  const Details = () => (
    <Card
      key="Details"
      mode="outlined"
    >
      <VStack
        p={20}
        spacing={5}
      >
        <Text variant="titleMedium">Datos del formulario</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Descripción del evento</Text>
            <Text variant="bodyMedium">{form?.description}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Folio del formulario</Text>
            <Text variant="bodyMedium">{form?.version ?? "Sin folio"}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const Questions = () => (
    <VStack
      key="Questions"
      spacing={20}
    >
      {form?.questions.length > 0 &&
        form.questions.map((question, index) => (
          <Flex key={index.toString()}>
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
      {/* <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => getForm()}
          />
        }
      > */}
      {form !== undefined ? (
        form !== null ? (
          isNaN(form) ? (
            <DisplayDetails
              icon="form-select"
              title={form?.name}
              children={[Details(), Questions()]}
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
                onPress={() => {
                  getForm()
                }}
              >
                Volver a intentar
              </Button>
            </Flex>
          </VStack>
        )
      ) : null}
      {/* </ScrollView> */}

      {!(form === undefined || form === null) && (
        <FAB
          icon="pencil-outline"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate("EditForm", {
              form,
              getForms,
              getForm
            })
          }}
        />
      )}
    </Flex>
  )
}
