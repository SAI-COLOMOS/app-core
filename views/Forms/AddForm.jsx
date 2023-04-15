import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useContext, Component, useFocusEffect, useCallback } from "react"
import { Button, Text, TextInput, useTheme, IconButton } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from "expo-constants"
import ModalMessage from "../Shared/ModalMessage"
import Dropdown from "../Shared/Dropdown"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"
import { event } from "react-native-reanimated"

// const defaultQuestion = {
//   interrogation: "Nombre",
//   question_type: "Abierta",
//   enum_options: []
// }

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
    // elimnarVacio()
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
        questions: questions,
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
          {/* <TextInput
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
          /> */}
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

          {questions.length > 0 &&
            questions.map((question, questionIndex) => (
              <Item
                key={questionIndex}
                questionIndex={questionIndex}
                question={question}
              />
            ))}
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
        // elimnarVacio()
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

  const elimnarVacio = () => {
    setQuestions((questions) => {
      const nuevosDatos = questions.filter((dato) => dato.interrogation.trim() !== "")
      return nuevosDatos
    })
    // console.log("Si entra")
  }

  const addQuestion = (interrogation, setInterrogation, question_type, enum_options, setEnum_options) => {
    const newQuestion = {
      interrogation: interrogation,
      question_type: question_type,
      enum_options: enum_options
    }

    const updatedQuestions = [...questions]
    updatedQuestions.push(newQuestion)
    setQuestions(updatedQuestions)
    setInterrogation("")
    // setEnum_options("")
  }

  //Aun no usar, elimina las preguntas
  const changeQuestion = (questionIndex, interrogation) => {
    const modifyQuestion = questions[questionIndex]
    modifyQuestion[questionIndex] = { interrogation }
    // setInterrogation(modifyQuestion.interrogation)
    // setEnum_options(modifyQuestion.enum_options || [])

    const updatedQuestions = [...questions]
    updatedQuestions.splice(questionIndex, 1)
    setQuestions(updatedQuestions)
  }

  const deleteQuestion = (questionIndex) => {
    setQuestions(questions.filter((_, i) => i !== questionIndex))
  }

  const modificarOpcionRespuesta = (e, index, enum_options, setEnum_options) => {
    const opcionesActualizadas = [...enum_options]
    opcionesActualizadas[index] = e.target.value
    setEnum_options(opcionesActualizadas)
  }

  // const addAnswerOptions = (questionIndex, nuevaOpcion, setNewAnswerOption) => {
  //   const updatedAnswer = {
  //     ...questions[questionIndex],
  //     enum_options: [...questions[questionIndex].enum_options, nuevaOpcion]
  //   }

  //   const updatedAnswers = [...questions]
  //   updatedAnswers[questionIndex] = updatedAnswer
  //   setQuestions(updatedAnswers)
  //   setNewAnswerOption("Presionado")
  // }

  const addOption = (nuevaOpcion, setNewAnswerOption) => {
    if (nuevaOpcion.trim() !== "") {
      setQuestions((questions) => {
        const nuevosDatos = [...questions]
        nuevosDatos.forEach((dato) => {
          dato.enum_options.push(nuevaOpcion)
        })
        return nuevosDatos
      })
      setNewAnswerOption("")
    }
  }

  const Item = ({ questionIndex, question }) => {
    const { question_type } = question
    const [interrogation, setInterrogation] = useState(question.interrogation)
    const [enum_options, setEnum_options] = useState(question.enum_options)
    const [newAnswerOption, setNewAnswerOption] = useState("")
    console.log(questions)
    return (
      <VStack
        key="Question"
        spacing={5}
      >
        <Dropdown
          title="Tipo de pregunta"
          options={QuestionType}
          value={question_type}
          isAnObjectsArray={true}
          objectInfo={{ index: questionIndex, key: "question_type", arr: questions, setArr: setQuestions }}
        />
        <TextInput
          mode="outlined"
          value={interrogation}
          onChangeText={setInterrogation}
          label="Interrogante"
        />
        {question_type === "Opción múltiple" || question_type === "Selección múltiple" || question_type === "Escala" ? (
          <Flex>
            <TextInput
              mode="outlined"
              value={newAnswerOption}
              onChangeText={setNewAnswerOption}
              label="Respuestas"
            />
            <Text variant="bodyMedium">Simbologia: </Text>
            <Text variant="labelSmall">El icono de el pastel con + es para agregar respuestas, El icono + agrega pregunta, El icono de la hoja de papel con un lapiz modifica la pregunta, El icono - borra la pregunta</Text>
            <Flex
              direction="row"
              items="center"
              justify="end"
            >
              <IconButton //Boton agregar respuesta
                icon="database-plus-outline"
                mode="contained"
                // onPress={(_) => addAnswerOptions(questionIndex, newAnswerOption, setNewAnswerOption)}
                onPress={(_) => addOption(newAnswerOption, setNewAnswerOption)}
              />

              <IconButton //Boton agregar pregunta
                icon="plus"
                mode="contained"
                onPress={(_) => addQuestion(interrogation, setInterrogation, question_type, enum_options, setEnum_options)}
              />
              <IconButton //Boton modificar pregunta
                icon="file-document-edit-outline"
                mode="contained"
                // onPress={(_) => changeQuestion(questionIndex, interrogation)}
              />
              {questionIndex > 0 && (
                <IconButton //Boton eliminar pregunta
                  icon="minus"
                  mode="contained"
                  onPress={(_) => deleteQuestion(questionIndex)}
                />
              )}
            </Flex>
          </Flex>
        ) : null}
        {question_type === "Abierta" || question_type === "Numérica" ? (
          <Flex>
            <Text variant="bodyMedium">Simbologia: </Text>
            <Text variant="labelSmall">El icono + agrega pregunta, El icono de la hoja de papel con un lapiz modifica la pregunta, El icono - borra la pregunta</Text>

            <Flex
              direction="row"
              items="center"
              justify="end"
            >
              <IconButton
                icon="plus"
                mode="contained"
                onPress={(_) => addQuestion(interrogation, setInterrogation, question_type, enum_options, setEnum_options)}
              />
              <IconButton
                icon="file-document-edit-outline"
                mode="contained"
                // onPress={(_) => changeQuestion(questionIndex)}
              />
              {questionIndex > 0 && (
                <IconButton
                  icon="minus"
                  mode="contained"
                  onPress={(_) => deleteQuestion(questionIndex)}
                />
              )}
            </Flex>
          </Flex>
        ) : null}
      </VStack>
    )
  }

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
