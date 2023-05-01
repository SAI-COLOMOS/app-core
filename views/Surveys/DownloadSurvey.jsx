import { Flex, VStack } from "react-native-flex-layout"
import CreateForm from "../Shared/CreateForm"
import { Button, Card, ProgressBar, Text, useTheme } from "react-native-paper"
import Dropdown from "../Shared/Dropdown"
import * as Sharing from "expo-sharing"
import * as FileSystem from "expo-file-system"
import { useCallback, useContext, useEffect, useState } from "react"
import ApplicationContext from "../ApplicationContext"

export default DownloadSurvey = ({ navigation, route }) => {
  const theme = useTheme()
  const { token, host } = useContext(ApplicationContext)
  const { survey_identifier } = route.params

  const [downloadFormat, setDownloadFormat] = useState({ option: "PDF", value: "pdf", mimeType: "application/pdf" })
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [actualFileURI, setActualFileURI] = useState("")
  const [actualFileExist, setActualFileExist] = useState(undefined)
  const [loading, setLoading] = useState(false)

  const formats = [
    { option: "PDF", value: "pdf", mimeType: "application/pdf" },
    { option: "Hoja de calculo (Excel)", value: "xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
    { option: "CSV", value: "csv", mimeType: "text/csv" }
  ]

  async function downloadSurvey() {
    try {
      setLoading(true)

      const progress = (actualDownload) => {
        const progress = actualDownload.totalBytesWritten / actualDownload.totalBytesExpectedToWrite
        setDownloadProgress(Number(progress))
      }

      const downloadFile = FileSystem.createDownloadResumable(
        `http://192.168.100.84:3000/prueba.${downloadFormat.value}`,
        actualFileURI,
        {
          headers: {
            Authentication: `Bearer ${token}`
          }
        },
        progress
      )

      await downloadFile.downloadAsync()

      setLoading(false)
      setDownloadProgress(0)
      shareSurvey()
      getInfo()

      return
    } catch (e) {
      setLoading(false)
      console.error(e)
      return
    }
  }

  async function shareSurvey() {
    try {
      Sharing.shareAsync(actualFileURI, {
        UTI: downloadFormat.mimeType,
        mimeType: downloadFormat.mimeType
      })

      return
    } catch (error) {
      console.error(e)
      return
    }
  }

  async function getInfo() {
    const result = await FileSystem.getInfoAsync(actualFileURI)
    setActualFileExist(result.exists)
  }

  useEffect(() => {
    const uri = `${FileSystem.documentDirectory}${survey_identifier}.${downloadFormat?.value}`
    setActualFileURI(uri)
  }, [downloadFormat])

  useEffect(() => {
    if (actualFileURI != "") {
      getInfo()
    }

    console.log(actualFileURI)
  }, [actualFileURI])

  const DownloadFormat = useCallback(
    () => (
      <VStack
        key="DownloadFormat"
        fill
        spacing={10}
      >
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
    ),
    [downloadFormat]
  )

  const Options = () => {
    return (
      <VStack spacing={10}>
        <Flex>
          <Text variant="bodyMedium">Opciones</Text>
          <VStack
            pt={10}
            spacing={10}
          >
            <Button
              disabled={loading}
              loading={loading}
              mode="contained"
              icon="tray-arrow-down"
              onPress={() => downloadSurvey()}
            >
              Descargar
            </Button>

            {actualFileExist == true && (
              <Button
                disabled={loading}
                mode="outlined"
                icon="share-outline"
                onPress={() => shareSurvey()}
              >
                Compartir
              </Button>
            )}

            {actualFileExist == true && (
              <Button
                disabled={loading}
                mode="outlined"
                icon="delete"
                textColor={theme.colors.error}
                onPress={async () => {
                  await FileSystem.deleteAsync(actualFileURI, { idempotent: true })
                  getInfo()
                }}
              >
                Eliminar
              </Button>
            )}
          </VStack>
        </Flex>
        {loading == true && (
          <VStack spacing={5}>
            <Text variant="bodyMedium">{downloadProgress == 0 ? "Iniciando descarga" : `${(downloadProgress * 100).toFixed(0)}% descargado`}</Text>
            <ProgressBar
              progress={downloadProgress}
              color={theme.colors.primary}
              indeterminate={downloadProgress == 0}
            />
          </VStack>
        )}
      </VStack>
    )
  }

  const Cancel = () => (
    <Button
      key="Cancel"
      disabled={loading}
      mode="contained"
      icon="page-previous-outline"
      onPress={() => {
        setShowDialog(false)
      }}
    >
      Regresar
    </Button>
  )

  // const Download = () => (

  // )

  return (
    <Flex fill>
      <CreateForm
        loading={loading}
        navigation={navigation}
        title="Descargar encuesta"
        children={[DownloadFormat(), Options()]}
        actions={[Cancel()]}
      />
    </Flex>
  )
}
