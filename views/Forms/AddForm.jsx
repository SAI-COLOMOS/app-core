import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useContext } from "react"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from "expo-constants"
import ModalMessage from "../Shared/ModalMessage"
import Dropdown from "../Shared/Dropdown"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"

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
  // const [newQuestion, setNewQuestion] = useState("")
  // const [type, setType] = useState("")
  // const [question_options, setQuestion_options] = useState([])
  const [questions, setQuestions] = useState([
    {
      interrogation: "¿Que te pareció el evento",
      question_type: "Abierta",
      enum_options: []
    },
    {
      interrogation: "¿En serio?",
      question_type: "Numérica",
      enum_options: []
    }
  ])
  const [inter, setInter] = useState("")
  const [enumOp, setEnumOp] = useState([""])
  // const [quesType, setQuesType] = useState("")
  const [isTemplate, setIsTemplate] = useState(false)
  // const [abierta, setAbierta] = useState("")
  // const [respuesta, setRespuesta] = useState("")

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

  // console.log(questions)

  // questions.push("¿Pregunta añadida?")

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

          {questions != 0
            ? questions.map((question, questionIndex, questions, setQuestions) => (
                // console.log("question: ", question),
                // console.log("questions: ", questions),
                <Item
                  // key="ItemMap"
                  indexQuestion={questionIndex}
                  question={question}
                  questions={questions}
                  setQuestions={setQuestions}
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

  const AddQuestion = (questions, question, setQuestions, newQuestion, quesType) => {
    const defaultQuestion = {
      interrogation: newQuestion,
      question_type: quesType,
      enum_options: ["Sí", "No"]
    }
    // console.log(questions.length)
    const mutatedQuestions = [question]
    mutatedQuestions.push(defaultQuestion)
    setQuestions([...mutatedQuestions])
    console.log(question)
  }

  const ChangeQuestion = (questions, setNewQuestion, indexQuestion, newQuestion) => {
    const mutatedChangeQuestion = questions
    mutatedChangeQuestion[indexQuestion].interrogation = newQuestion
    setQuestions([...mutatedChangeQuestion])
  }

  const Item = ({ indexQuestion, question, questions, setQuestions }) => {
    const [newQuestion, setNewQuestion] = useState()
    const [quesType, setQuesType] = useState()

    return (
      <VStack
        key="Question"
        spacing={5}
      >
        {/* <Text>Pregunta: {question.interrogation}</Text>
        <Text>Tipo de pregunta: {question.question_type}</Text> */}
        <TextInput
          mode="outlined"
          value={newQuestion}
          onChangeText={setNewQuestion}
          label="Nueva Pregunta"
          autoComplete="off"
        />
        {/* <TextInput
          mode="outlined"
          value={quesType}
          onChangeText={setQuesType}
          label="Tipo de Pregunta"
          autoComplete="off"
          autoCapitalize="sentences"
        /> */}
        <Dropdown
          title="Tipo de pregunta"
          options={QuestionType}
          value={quesType}
          selected={setQuesType}
        />
        {quesType == "Opción múltiple" || quesType == "Selección múltiple" || quesType == "Escala" ? (
          <TextInput
            mode="outlined"
            value={question.enum_options}
            onChangeText={setQuestions}
            label="Respuestas"
            autoComplete="off"
          />
        ) : null}
        <VStack
          key="Button"
          pt={10}
          pb={10}
          spacing={5}
        >
          <Button
            key="SaveButton"
            mode="contained"
            icon="plus"
            onPress={() => {
              AddQuestion(questions, setQuestions, quesType, newQuestion)
            }}
          >
            Agregar al formulario
          </Button>
          {/* <Button
            key="ChangeButton"
            mode="contained"
            icon="plus"
            onPress={() => {
              ChangeQuestion(questions, setQuestions, newQuestion, indexQuestion)
            }}
          >
            Cambiar pregunta
          </Button> */}
        </VStack>
        {/* {NewQuestion()} */}
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
