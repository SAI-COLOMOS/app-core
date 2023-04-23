import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState, useContext, Component } from "react"
import { Button, Text, TextInput, useTheme, IconButton, Card } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from "expo-constants"
import ModalMessage from "../Shared/ModalMessage"
import Dropdown from "../Shared/Dropdown"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"
import InformationMessage from "../Shared/InformationMessage"
import ModalQuestion from "../Shared/ModalQuestion"

export default EditForm = ({ navigation, route }) => {
  const theme = useTheme()
  const { host, user, token } = useContext(ApplicationContext)
  const { form, getForms, getForm } = route.params

  const [name, setName] = useState(`${form?.name ?? ""}`)
  const [description, setDescription] = useState(`${form?.description ?? ""}`)
  const [version, setVersion] = useState(`${form?.version}`)
  const [questions, setQuestions] = useState(form.questions)
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

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showQuestionMaker, setShowQuestionMaker] = useState(false)
  const [verified, setVerified] = useState(false)

  const [loading, setLoading] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function saveForm() {
    setModalLoading(true)
    const request = await fetch(`${host}/forms/${form.form_identifier}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim(),
        version: Number(version),
        questions: questions,
        isTemplate: true
      })
    })
      .then((response) => response.status)
      .catch((error) => console.error("Error: ", error))

    setModalLoading(false)

    if (request == 200) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  async function deleteForm() {
    const request = await fetch(`${host}/forms/${form.form_identifier}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        isTemplate: true
      })
    })
      .then(async (response) => /*response.json()*/ {
        console.log(await response.json())
        return response.status
      })
      .catch((error) => console.error("Error: ", error))

    // console.log(request)

    if (request == 200) {
      setModalSuccessDelete(true)
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

    console.log("Valid", valid, questions)

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
          label="Folio del formulario"
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

  const Delete = () => (
    <VStack
      key="Delete"
      spacing={5}
    >
      <Text variant="labelLarge">Eliminar al formulario</Text>
      <VStack spacing={10}>
        <Button
          textColor={theme.colors.error}
          icon="trash-can-outline"
          mode="outlined"
          disabled={modalLoading}
          onPress={() => {
            setModalConfirm(!modalConfirm)
          }}
        >
          Eliminar
        </Button>
      </VStack>
    </VStack>
  )

  const Save = () => (
    <Button
      key="SaveButton"
      mode="contained"
      icon="content-save-outline"
      disabled={modalLoading || !verified}
      loading={modalLoading}
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
      mode="outlined"
      disabled={modalLoading}
      icon="close"
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
        title="Editar formulario"
        children={[Data(), Questions(), Delete()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
      />

      <ModalMessage
        title="Eliminar formulario"
        description="¿Seguro que deseas eliminar este formulario? La acción no se puede deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm)
              deleteForm()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El formulario ha sido actualizado"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getForm()
              getForms()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El formulario ha sido eliminado"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[
          [
            "Aceptar",
            () => {
              navigation.pop(2)
              //getForms()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar al formulario, inténtalo más tarde. (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos eliminar al formulario, inténtalo más tarde. (${responseCode})`}
        handler={[modalErrorDelete, () => setModalErrorDelete(!modalErrorDelete)]}
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
