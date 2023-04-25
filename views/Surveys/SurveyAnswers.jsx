import { Flex, VStack } from "@react-native-material/core"
import { Card, List, Text, useTheme } from "react-native-paper"
import DisplayDetails from "../Shared/DisplayDetails"
import { useContext, useEffect, useState } from "react"
import ApplicationContext from "../ApplicationContext"
import { useHeaderHeight } from "@react-navigation/elements"
import Header from "../Shared/Header"

export default SurveyAnswers = ({ navigation, route }) => {
  const theme = useTheme()
  const headerMargin = useHeaderHeight()
  const { host, token } = useContext(ApplicationContext)
  const { survey_identifier } = route.params

  const [survey, setSurvey] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState("")

  async function getSurvey() {
    try {
      setLoading(true)

      const request = await fetch(`${host}/surveys/${survey_identifier}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      setLoading(false)

      if (request.ok) {
        const response = await request.json()
        setSurvey(response?.survey)
        return
      }

      setStatusCode(request.status)
      return
    } catch (error) {
      console.error("Get survey:", error)
      return
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Detalles de la encuesta"
    })
  }, [])

  useEffect(() => {
    getSurvey()
  }, [])

  const Info = () => (
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

  const Responses = () => {
    const totalAnswers = survey?.answers[0]?.answer

    return (
      <Card
        key="Responses"
        mode="outlined"
      >
        <VStack p={20}>
          <Flex
            fill
            pb={20}
          >
            <Text variant="titleMedium">Respuestas de la encuesta</Text>
          </Flex>

          <List.AccordionGroup>
            <VStack spacing={10}>
              {totalAnswers?.length > 0 &&
                totalAnswers.map((answer, index) => (
                  <Flex>
                    <List.Accordion
                      key={index.toString()}
                      id={index.toString()}
                      title={`Encuesta #${index + 1}`} //{survey?.questions?.find((question) => question.question_identifier == answer.question_referenced)?.interrogation}
                      style={{ backgroundColor: theme.colors.elevation.level5 }}
                      //style={{ borderColor: theme.colors.onSurface, borderWidth: 0.5 }}
                    >
                      <VStack
                        spacing={10}
                        p={20}
                        // mt={-10}
                        style={{ backgroundColor: theme.colors.elevation.level2, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}
                        //style={{ borderRadius: 10, borderColor: theme.colors.onSurface, borderWidth: 0.5, zIndex: -1 }}
                      >
                        {survey?.questions.map((question) => (
                          <Flex fill>
                            <Text variant="labelMedium">{question?.interrogation}</Text>
                            <Text variant="bodyLarge">{survey?.answers.find((answer) => answer.question_referenced == question?.question_identifier)?.answer[index]}</Text>
                          </Flex>
                        ))}
                      </VStack>
                    </List.Accordion>
                  </Flex>
                ))}
            </VStack>
          </List.AccordionGroup>
          {/* <Text>{JSON.stringify(survey)}</Text>
        <Text>{JSON.stringify(totalAnswers)}</Text> */}
        </VStack>
      </Card>
    )
  }

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      <DisplayDetails
        showHeader={false}
        refreshStatus={loading}
        refreshAction={() => getSurvey()}
        children={[Info(), Responses()]}
      />
      <Text>Hola</Text>
    </Flex>
  )
}
