import { Flex, HStack, VStack } from "@react-native-material/core"
import { Button, Card, Dialog, IconButton, List, Portal, Text, Tooltip, useTheme } from "react-native-paper"
import DisplayDetails from "../Shared/DisplayDetails"
import { useContext, useEffect, useState } from "react"
import ApplicationContext from "../ApplicationContext"
import { useHeaderHeight } from "@react-navigation/elements"
import Header from "../Shared/Header"
import Dropdown from "../Shared/Dropdown"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default SurveyAnswers = ({ navigation, route }) => {
  const theme = useTheme()
  const headerMargin = useHeaderHeight()
  const { host, token } = useContext(ApplicationContext)
  const { survey_identifier } = route.params

  const [survey, setSurvey] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState(null)

  async function getSurvey() {
    try {
      setLoading(true)
      setStatusCode(null)

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
      setSurvey(null)
      setLoading(false)
      return
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => (
        <Header
          {...props}
          children={[
            <Tooltip
              key="DownloadButton"
              title="Descargar respuestas"
            >
              <IconButton
                icon="tray-arrow-down"
                onPress={() => navigation.navigate("DownloadSurvey", { survey_identifier })}
              />
            </Tooltip>
          ]}
        />
      ),
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
            <Text variant="labelSmall">Nombre de la encuesta</Text>
            <Text variant="bodyMedium">{survey?.name ?? "Sin nombre"}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Descripción de la encuesta</Text>
            <Text variant="bodyMedium">{survey?.description ?? "Sin descripción"}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Folio de la encuesta</Text>
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
                  <Flex key={index.toString()}>
                    <List.Accordion
                      id={index.toString()}
                      title={`Encuesta #${index + 1}`} //{survey?.questions?.find((question) => question.question_identifier == answer.question_referenced)?.interrogation}
                      style={{ backgroundColor: theme.colors.elevation.level5 }}
                    >
                      <VStack
                        spacing={10}
                        p={20}
                        style={{ backgroundColor: theme.colors.elevation.level2, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                      >
                        {survey?.questions.map((question) => (
                          <Flex
                            key={question?.interrogation}
                            fill
                          >
                            <Text variant="labelMedium">{question?.interrogation}</Text>
                            <Text variant="bodyLarge">{survey?.answers.find((answer) => answer.question_referenced == question?.question_identifier)?.answer[index] ?? "Sin respuesta"}</Text>
                          </Flex>
                        ))}
                      </VStack>
                    </List.Accordion>
                  </Flex>
                ))}
            </VStack>
          </List.AccordionGroup>
        </VStack>
      </Card>
    )
  }

  return (
    <Flex
      fill
      pt={headerMargin - 20}
    >
      {survey !== undefined &&
        (survey !== null ? (
          statusCode === null ? (
            <DisplayDetails
              showHeader={false}
              refreshStatus={loading}
              refreshAction={() => getSurvey()}
              children={[Info(), Responses()]}
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
                  No podemos recuperar los datos de la encuesta, inténtalo de nuevo más tarde (Error: {statusCode})
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getSurvey()
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
                No podemos recuperar los datos de la encuesta, revisa tu conexión a internet e inténtalo de nuevo
              </Text>
            </VStack>
            <Flex>
              <Button
                mode="outlined"
                onPress={() => {
                  getSurvey()
                }}
              >
                Volver a intentar
              </Button>
            </Flex>
          </VStack>
        ))}
    </Flex>
  )
}
