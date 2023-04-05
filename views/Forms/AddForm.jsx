import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from "expo-constants"
import ModalMessage from "../Shared/ModalMessage"
import Dropdown from "../Shared/Dropdown"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default AddForm = ({ navigation, route }) => {
  const theme = useTheme()
  const { token } = route.params
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [belonging_area, setBeging_area] = useState("")
  const [belonging_place, setBelonging_place] = useState("")
  const [belonging_event_identifier, setBelonging_event_identifier] = useState("")
  const [version, setVersion] = useState("")
  const [question, setQuestion] = useState("")
  const [type, setType] = useState("")
  const [question_options, setQuestion_options] = useState([])
  const [questions, setQuestions] = useState([])
  const [interrogation, setInterrogation] = useState("")
  const [enum_options, setEnum_options] = useState("")
  const [isTemplate, setIsTemplate] = useState(false)
  const [abierta, setAbierta] = useState("")
  const [respuesta, setRespuesta] = useState("")

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

  // console.log(questions[0])

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
        // questions: Array(questions),
        isTemplate: isTemplate
      })
    })
      .then((response) => /*response.json()*/ response.status)
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
        <VStack spacing={10}>
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
            label="Área de origen"
            maxLength={150}
          />
          <TextInput
            mode="outlined"
            value={belonging_event_identifier}
            onChangeText={setBelonging_event_identifier}
            label="Identificador de evento de origen"
            maxLength={150}
            autoCapitalize="words"
          />
          <TextInput
            mode="outlined"
            value={version}
            onChangeText={setVersion}
            label="Versión"
            keyboardType="number-pad"
            maxLength={3}
            autoComplete="off"
          />
          {/* <Dropdown
            title="Tipo de pregunta"
            options={QuestionType}
            value={questions}
            selected={setQuestions}
            // {...(questions.length > 0 && questions.map((question) => <Item question={question}></Item>))}
          /> */}
          {/* <Button
            mode="outlined"
            icon="plus"
            onPress={() => {
              AddQuestion()
              // questions.length > 0 &&
              // questions.map((question, index) => (
              //   <Item
              //     question={question}
              //     index={index}
              //   ></Item>
              // ))
            }}
          >
            Agregar pregunta
          </Button> */}
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

  const AddQuestion = () => {
    return (
      <VStack
        spacing={5}
        key="addQuestion"
      >
        <Text variant="labelLarge">Preguntas</Text>
        <TextInput
          mode="outlined"
          value={question}
          onChangeText={setQuestion}
          label="Pregunta"
          autoComplete="off"
          autoCapitalize="sentences"
        />
        <Dropdown
          title="Tipo de pregunta"
          options={QuestionType}
          value={type}
          selected={setType}
        />
        {type == "Opción múltiple" || type == "Selección múltiple" || type == "Escala" ? CountOptions() : null}
        <VStack
          pt={10}
          spacing={5}
        >
          <Button
            mode="outlined"
            icon="plus"
            onPress={() => {
              AddQuestion()
              // questions.length > 0 &&
              // questions.map((question, index) => (
              //   <Item
              //     question={question}
              //     index={index}
              //   ></Item>
              // ))
            }}
          >
            Agregar pregunta
          </Button>
        </VStack>
      </VStack>
    )
    setQuestions([
      ...questions,
      {
        interrogation: question,
        question_type: type,
        enum_options: question_options
      }
    ])
  }

  const CountOptions = () => {
    return (
      <VStack
        pt={5}
        spacing={5}
        key="opt"
      >
        <TextInput
          mode="outlined"
          value={question_options}
          onChangeText={setQuestion_options}
          label="Respuestas"
          autoComplete="off"
        />
        ,
        <Button
          onPress={() => {
            CountOptions()
          }}
        >
          Agregar otra respuesta
        </Button>
      </VStack>
    )
  }
  const Item = ({ index, question }) => console.log("Entra")

  return (
    <Flex fill>
      <CreateForm
        title="Añadir nuevo formulario"
        children={[FormData(), AddQuestion()]}
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
