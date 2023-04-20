import { useCallback, useEffect, useState } from "react"
import { Button, Dialog, IconButton, Portal, Text, TextInput, useTheme } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native"
import { Flex, HStack, VStack } from "@react-native-material/core"
import { useFocusEffect } from "@react-navigation/native"
import Dropdown from "./Dropdown"
import InformationMessage from "./InformationMessage"

export default Modal = ({ questions, setter, index, handler, dismissable }) => {
  const theme = useTheme()
  const [question_type, setQuestion_type] = useState("")
  const [interrogation, setInterrogation] = useState("")
  const [enum_options, setEnum_options] = useState([])

  const questionTypes = [{ option: "Abierta" }, { option: "Numérica" }, { option: "Opción múltiple" }, { option: "Selección múltiple" }, { option: "Escala" }]

  function saveQuestion() {
    const question = {
      interrogation: interrogation,
      question_type: question_type,
      enum_options: enum_options
      // val: questions.length
    }

    const newArray = [...questions]
    newArray[index] = question
    setter(newArray)
  }

  useEffect(() => {
    setQuestion_type(questions[index]?.question_type)
    setInterrogation(questions[index]?.interrogation)
    setEnum_options(questions[index]?.enum_options ?? [])
  }, [handler[0]])

  useFocusEffect(
    useCallback(() => {
      if (handler ? handler[0] : false) {
        Keyboard.dismiss()
      }

      return () => {}
    }, [handler])
  )

  return (
    <Portal>
      <Dialog
        visible={handler ? handler[0] : false}
        onDismiss={() => (handler ? handler[1]() : null)}
        dismissable={dismissable}
      >
        <Dialog.Title style={{ textAlign: "center" }}>Editar pregunta</Dialog.Title>

        <Dialog.ScrollArea style={{ maxHeight: 500 }}>
          <ScrollView>
            <VStack
              spacing={10}
              pv={20}
            >
              <TextInput
                mode="outlined"
                value={interrogation}
                onChangeText={setInterrogation}
                label="Pregunta"
                maxLength={150}
                autoComplete="off"
              />
              <Flex>
                <Dropdown
                  title="Tipo de pregunta"
                  value={question_type}
                  selected={setQuestion_type}
                  options={questionTypes}
                />
              </Flex>

              {(question_type == "Selección múltiple" || question_type == "Opción múltiple") && (
                <Flex>
                  <Text>Respuestas</Text>
                  <VStack spacing={10}>
                    {enum_options?.length > 0 ? (
                      enum_options.map((item, index) => (
                        <HStack
                          key={index.toString()}
                          items="end"
                        >
                          <Flex fill>
                            <TextInput
                              mode="outlined"
                              value={enum_options[index]}
                              onChangeText={(text) => {
                                const newArray = [...enum_options]
                                newArray[index] = text
                                setEnum_options(newArray)
                              }}
                              label={`Respuesta número ${index + 1}`}
                              maxLength={150}
                              autoComplete="off"
                            />
                          </Flex>
                          <IconButton
                            icon="delete"
                            iconColor={theme.colors.error}
                            mode="outlined"
                            onPress={() => {
                              const newArray = [...enum_options]
                              newArray.splice(index, 1)
                              setEnum_options(newArray)
                            }}
                          />
                        </HStack>
                      ))
                    ) : (
                      <InformationMessage
                        title="Sin respuestas"
                        description="Presiona el botón para agregar respuestas"
                      />
                    )}
                    <Button
                      mode="outlined"
                      onPress={() => {
                        const newArray = [...enum_options, ""]
                        setEnum_options(newArray)
                      }}
                    >
                      Agregar respuesta
                    </Button>
                    {/* <HStack reverse={true}>
                    <Flex>
                      <Text>AG</Text>
                    </Flex>
                    <IconButton
                      mode="contained"
                      icon="plus"
                      onPress={() => }
                    />
                  </HStack> */}
                  </VStack>
                </Flex>
              )}
            </VStack>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <HStack>
            <Button
              mode="contained"
              onPress={() => {
                saveQuestion()
                handler[1]()
              }}
            >
              Guardar
            </Button>
          </HStack>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}
