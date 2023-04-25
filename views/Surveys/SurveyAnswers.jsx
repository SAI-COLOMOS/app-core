import { Flex, HStack, VStack } from "@react-native-material/core"
import { Button, Card, Dialog, IconButton, List, Portal, Text, Tooltip, useTheme } from "react-native-paper"
import DisplayDetails from "../Shared/DisplayDetails"
import { useContext, useEffect, useState } from "react"
import ApplicationContext from "../ApplicationContext"
import { useHeaderHeight } from "@react-navigation/elements"
import Header from "../Shared/Header"
import Dropdown from "../Shared/Dropdown"

export default SurveyAnswers = ({ navigation, route }) => {
  const theme = useTheme()
  const headerMargin = useHeaderHeight()
  const { host, token } = useContext(ApplicationContext)
  const { survey_identifier } = route.params

  const [survey, setSurvey] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [statusCode, setStatusCode] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [downloadFormat, setDownloadFormat] = useState("")

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
                onPress={() => setShowDialog(true)}
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
            <Text variant="labelSmall">Nombre</Text>
            <Text variant="bodyMedium">{survey?.name ?? "Sin nombre"}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Descripción</Text>
            <Text variant="bodyMedium">{survey?.description ?? "Sin descripción"}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Folio</Text>
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
                      //style={{ borderColor: theme.colors.onSurface, borderWidth: 0.5 }}
                    >
                      <VStack
                        spacing={10}
                        p={20}
                        // mt={-10}
                        style={{ backgroundColor: theme.colors.elevation.level2, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}
                        //style={{ borderRadius: 10, borderColor: theme.colors.onSurface, borderWidth: 0.5, zIndex: -1 }}
                      >
                        {survey?.questions.map((question) => (
                          <Flex
                            key={question?.interrogation}
                            fill
                          >
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

  const DownloadDialog = () => {
    const formats = [{ option: "PDF" }, { option: "Hoja de calculo" }, { option: "CSV" }]
    return (
      <Portal>
        <Dialog
          visible={showDialog}
          onDismiss={() => {
            setShowDialog(false)
            setDownloadFormat("")
          }}
        >
          <Dialog.Title style={{ textAlign: "center" }}>Descargar respuestas</Dialog.Title>
          <Dialog.Content>
            <VStack spacing={10}>
              <Text variant="bodyMedium">Selecciona el formato de descarga</Text>
              <Flex>
                <Dropdown
                  title="Formato"
                  options={formats}
                  value={downloadFormat}
                  selected={setDownloadFormat}
                />
              </Flex>
            </VStack>
          </Dialog.Content>
          <Dialog.Actions>
            <HStack
              fill
              justify="between"
            >
              <Button
                mode="outlined"
                icon="close"
                onPress={() => {
                  setShowDialog(false)
                  setDownloadFormat("")
                }}
              >
                Cancelar
              </Button>
              <Button
                disabled={downloadFormat == ""}
                mode="contained"
                icon="tray-arrow-down"
                onPress={() => null}
              >
                Descargar
              </Button>
            </HStack>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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

      <DownloadDialog />
    </Flex>
  )
}
