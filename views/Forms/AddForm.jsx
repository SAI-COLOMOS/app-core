import { Flex, HStack, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { Button, Card, IconButton, Text, TextInput } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import ApplicationContext from "../ApplicationContext"
import InformationMessage from "../Shared/InformationMessage"
import ModalQuestion from "../Shared/ModalQuestion"

export default AddForm = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [belonging_event_identifier, setBelonging_event_identifier] = useState("")
  const [version, setVersion] = useState("")
  const [isTemplate, setIsTemplate] = useState(true)
  const [questions, setQuestions] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showQuestionMaker, setShowQuestionMaker] = useState(false)

  const [verified, setVerified] = useState(false)

  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function saveForm() {
    setModalLoading(true)

    const request = await fetch(`${host}/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        //        belonging_area: belonging_area.trim(),
        //        belonging_place: belonging_place.trim(),
        belonging_event_identifier: "AAA",
        version: Number(version),
        questions: questions,
        isTemplate: true
      })
    })
      .then((response) => response.status)
      .catch(() => null)

    setModalLoading(false)

    if (request == 201) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  useEffect(() => {
    let valid = true

    if (name.length <= 0) {
      valid = false
    }

    if (description.length <= 0) {
      valid = false
    }

    if (version.length <= 0) {
      valid = false
    }

    if (questions?.length == 0) {
      valid = false
    }

    questions?.forEach((question) => {
      if (question.interrogation == "") {
        valid = false
      }
      if (question.question_type == "") {
        valid = false
      }
      if (question?.enum_options?.length <= 0) {
        valid = false
      }
    })

    setVerified(valid)
  }, [questions, name, description, version])

  const Data = () => (
    <VStack
      key="Data"
      spacing={5}
    >
      <Text variant="labelLarge">Datos del formulario</Text>
      <VStack spacing={10}>
        <TextInput
          mode="outlined"
          value={name}
          onChangeText={setName}
          label="Nombre del formulario"
          maxLength={150}
          autoComplete="off"
        />

        <TextInput
          mode="outlined"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={3}
          label="Descripción del formulario"
          maxLength={500}
          autoComplete="off"
        />

        <TextInput
          mode="outlined"
          value={version}
          onChangeText={setVersion}
          label="Versión del formulario"
          maxLength={150}
          autoComplete="off"
        />
      </VStack>
    </VStack>
  )

  const Questions = () => (
    <VStack
      key="Questions"
      spacing={5}
    >
      <Text variant="labelLarge">Preguntas</Text>
      <VStack spacing={10}>
        {questions?.length > 0 ? (
          questions.map((item, index) => (
            <Card
              mode="outlined"
              key={index.toString()}
            >
              <VStack
                p={20}
                spacing={20}
              >
                <Flex fill>
                  <Text variant="titleMedium">{questions[index].interrogation == "" ? "Pregunta vacía" : questions[index].interrogation}</Text>
                  <Text variant="bodyMedium">Tipo de pregunta: {questions[index].question_type == "" ? "Sin definir" : questions[index].question_type}</Text>
                </Flex>

                <HStack
                  items="baseline"
                  justify="between"
                >
                  <Button
                    mode="outlined"
                    icon="delete"
                    onPress={() => {
                      const newArray = [...questions]
                      newArray.splice(index, 1)
                      console.log("AAAA", newArray)
                      setQuestions(newArray)
                    }}
                  >
                    Eliminar
                  </Button>

                  <Button
                    mode="contained"
                    icon="pencil-outline"
                    onPress={() => {
                      setSelectedIndex(index)
                      setShowQuestionMaker(true)
                    }}
                  >
                    Editar
                  </Button>
                </HStack>
              </VStack>
            </Card>
          ))
        ) : (
          <InformationMessage
            icon="clipboard-edit-outline"
            title="Sin preguntas"
            description="Todavía no registras alguna pregunta, ¿qué te parece si hacemos la primera?"
          />
        )}
        <HStack reverse={true}>
          <Button
            icon="plus"
            disabled={questions[questions?.length - 1]?.interrogation == "" || questions[questions?.length - 1]?.question_type == ""}
            mode="outlined"
            onPress={() => {
              let newQuestion = {
                interrogation: "",
                question_type: ""
              }

              setQuestions([...questions, newQuestion])
            }}
          >
            Agregar pregunta
          </Button>
        </HStack>
      </VStack>
    </VStack>
  )

  const Save = () => (
    <Button
      key="SaveButton"
      icon="content-save-outline"
      disabled={modalLoading || !verified}
      loading={modalLoading}
      mode="contained"
      onPress={() => {
        saveForm()
      }}
    >
      Guardar
    </Button>
  )

  const Cancel = () => (
    <Button
      key="CancelButton"
      icon="close"
      disabled={modalLoading}
      mode="outlined"
      onPress={() => {
        navigation.pop()
      }}
    >
      Cancelar
    </Button>
  )

  return (
    <Flex fill>
      <CreateForm
        title="Crear formulario"
        children={[Data(), Questions()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />
      <ModalMessage
        title="¡Listo!"
        description="La escuela ha sido añadida"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              //getSchools()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />
      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos añadir la escuela, inténtalo más tarde. (${responseCode})`}
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

      <ModalQuestion
        questions={questions}
        setter={setQuestions}
        index={selectedIndex}
        handler={[showQuestionMaker, () => setShowQuestionMaker(!showQuestionMaker)]}
        dismissable={true}
      />
    </Flex>
  )
}
