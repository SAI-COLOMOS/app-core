import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useContext } from "react"
import { Button, Text, TextInput, useTheme, IconButton } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from "expo-constants"
import ModalMessage from "../Shared/ModalMessage"
import Dropdown from "../Shared/Dropdown"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"

const defaultQuestion = {
  interrogation: "",
  question_type: "Abierta",
  enum_options: []
}

export default AddForm = ({ navigation, route }) => {
  const theme = useTheme()
  const { user, token } = useContext(ApplicationContext)
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [belonging_area, setBeging_area] = useState("")
  const [belonging_place, setBelonging_place] = useState("")
  const [belonging_event_identifier, setBelonging_event_identifier] = useState("")
  const [version, setVersion] = useState("")
  const [questions, setQuestions] = useState([
    {
      interrogation: "",
      question_type: "Abierta",
      enum_options: []
    }
  ])
  const [isTemplate, setIsTemplate] = useState(false)

  const QuestionType = [
    {
      option: "Abierta"
    },
    {
      option: "Numérica"
    },
    {
      option: "Opción múltiple"
    },
    {
      option: "Selección múltiple"
    },
    {
      option: "Escala"
    }
  ]
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function SaveForm() {
    const request = await fetch(`${localhost}/forms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        belonging_area: belonging_area.trim(),
        belonging_place: belonging_place.trim(),
        belonging_event_identifier: belonging_event_identifier.trim(),
        version: Number(version),
        questions: Array(questions),
        isTemplate
      })
    })
      .then((response) => response.json() /*response.status*/)
      .catch((error) => console.error("Error: ", error))

    console.log(request)

    if (request == 201) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  const FormData = () => {
    return (
      <VStack
        key="Form"
        spacing={5}
      >
        <Text variant="labelLarge">Datos del formulario</Text>
        <VStack
          key="FormData"
          spacing={10}
        >
          <TextInput
            mode="outlined"
            value={name}
            onChangeText={setName}
            label="Nombre del formulario"
            maxLength={50}
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="sentences"
          />
          <TextInput
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            label="Descripción del formulario"
            maxLength={250}
            multiline={true}
            numberOfLines={5}
            autoCapitalize="sentences"
          />
          <TextInput
            mode="outlined"
            value={belonging_place}
            onChangeText={setBelonging_place}
            label="Lugar de origen"
            maxLength={150}
            autoCapitalize="words"
          />
          <TextInput
            mode="outlined"
            value={belonging_area}
            onChangeText={setBeging_area}
            maxLength={150}
            label="Área de origen"
          />
          <TextInput
            mode="outlined"
            value={belonging_event_identifier}
            onChangeText={setBelonging_event_identifier}
            label="Identificador de evento de origen"
            maxLength={150}
            autoCapitalize="characters"
          />
          <TextInput
            mode="outlined"
            value={version}
            onChangeText={setVersion}
            label="Versión"
            // keyboardType="number-pad"
            maxLength={3}
            autoComplete="off"
          />
          <Text variant="labelLarge">Preguntas</Text>

          {questions.length > 0
            ? questions.map((question, questionIndex) => (
                <Item
                  key={questionIndex}
                  questionIndex={questionIndex}
                  question={question}
                />
              ))
            : null}
        </VStack>
      </VStack>
    )
  }

  const Save = () => (
    <Button
      key="SaveButton"
      mode="contained"
      icon="content-save-outline"
      // disabled={modalLoading || !verified}
      loading={modalLoading}
      onPress={() => {
        SaveForm()
      }}
    >
      Guardar
    </Button>
  )

  const Cancel = () => (
    <Button
      key="CancelButton"
      mode="outlined"
      icon="close"
      onPress={() => {
        navigation.pop()
      }}
    >
      Cancelar
    </Button>
  )

  const addQuestion = (questionIndex) => {
    questions.splice(questionIndex + 1, 0, { ...defaultQuestion, interrogation: "" })
    setQuestions([...questions])
  }

  const addAnswer = (questionIndex) => {
    questions.splice(questionIndex + 1, 0, { ...defaultQuestion, enum_options: [""] })
    setQuestions([...questions])
  }

  const deleteQuestion = (questionIndex) => {
    questions.splice(questionIndex, 1)
    setQuestions([...questions])
  }

  const changeQuestion = (questionIndex, text, debounce) => {
    if (text !== undefined) questions[questionIndex].interrogation = text
    setQuestions([...questions])
  }

  const Item = ({ questionIndex, question }) => {
    const [debounce, setDebounce] = useState()
    return (
      <VStack
        key="Question"
        spacing={5}
      >
        <TextInput
          mode="outlined"
          value={question.interrogation}
          onChangeText={(text) => changeQuestion(questionIndex, text)}
          label="Interrogante"
          autoComplete="off"
        />
        <Dropdown
          title="Tipo de pregunta"
          options={QuestionType}
          value={question.question_type}
          selected={(_) => changeQuestion(questionIndex)}
          isArray={true}
        />
        {/* {quesType == "Opción múltiple" || quesType == "Selección múltiple" || quesType == "Escala" ? (
          <TextInput
            mode="outlined"
            value={question.enum_options}
            onChangeText={setQuestions}
            label="Respuestas"
            autoComplete="off"
          />
        ) : null} */}

        <TextInput
          mode="outlined"
          value={question.enum_options}
          onChangeText={(text) => changeAnswer(questionIndex, text)}
          label="Respuesta"
          autoComplete="off"
        />

        <Flex
          direction="row"
          items="center"
          justify="end"
        >
          <IconButton
            icon="database-plus-outline"
            mode="contained"
            onPress={(_) => addAnswer(questionIndex)}
          />
          <IconButton
            icon="plus"
            mode="contained"
            onPress={(_) => addQuestion(questionIndex)}
          />
          {questionIndex > 0 && (
            <IconButton
              icon="minus"
              mode="contained"
              onPress={(_) => deleteQuestion(questionIndex)}
            />
          )}
        </Flex>
      </VStack>
    )
  }

  const NewQuestion = (question, setQuestion) => (
    <Button
      key="SaveButton"
      mode="contained"
      icon="plus"
      onPress={() => {
        AddQuestion(question, setQuestion)
      }}
    >
      Agregar pregunta
    </Button>
  )

  // const EraseQuestion = () => <Button>Eliminar pregunta</Button>

  return (
    <Flex fill>
      <CreateForm
        title="Añadir nuevo formulario"
        children={[FormData()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
      />

      <ModalMessage
        title="¡Listo!"
        description="El formulario ha sido creado"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[["Aceptar", () => navigation.pop()]]}
        dismissable={false}
        icon="check-circle-outline"
      />
      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos crear el formulario, inténtalo más tarde.`}
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
