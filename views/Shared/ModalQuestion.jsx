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
      question_type: question_type
      // enum_options: enum_options
      // val: questions.length
    }

    if (question_type == "Selección múltiple" || question_type == "Opción múltiple" || question_type == "Escala") {
      question["enum_options"] = enum_options
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
                maxLength={500}
                multiline={true}
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
                    <Flex>
                      <Text variant="titleMedium">Sin respuestas</Text>
                      <Text variant="bodyMedium">Presiona el botón para agregar una respuesta</Text>
                    </Flex>
                  )}
                  <Button
                    mode="outlined"
                    icon="plus"
                    disabled={enum_options[enum_options.length - 1] == ""}
                    onPress={() => {
                      const newArray = [...enum_options, ""]
                      setEnum_options(newArray)
                    }}
                  >
                    Agregar respuesta
                  </Button>
                </VStack>
              )}

              {question_type == "Escala" && (
                <VStack spacing={10}>
                  <HStack
                    items="end"
                    spacing={10}
                  >
                    <Flex fill>
                      <TextInput
                        mode="outlined"
                        value={enum_options[0]}
                        onChangeText={(text) => {
                          const newArray = [...enum_options]
                          newArray[0] = text
                          setEnum_options(newArray)
                        }}
                        label="Mínimo"
                        keyboardType="numeric"
                        maxLength={2}
                        autoComplete="off"
                      />
                    </Flex>
                    {/* <Flex fill>
                      <TextInput
                        mode="outlined"
                        value={enum_options[0]?.label}
                        onChangeText={(text) => {
                          const newArray = [...enum_options]
                          newArray[0] = {
                            ...newArray[0],
                            label: text
                          }
                          setEnum_options(newArray)
                        }}
                        label="Etiqueta"
                        maxLength={100}
                        autoComplete="off"
                      />
                    </Flex> */}
                  </HStack>

                  <HStack
                    items="end"
                    spacing={10}
                  >
                    <Flex fill>
                      <TextInput
                        mode="outlined"
                        value={enum_options[1]}
                        onChangeText={(text) => {
                          const newArray = [...enum_options]
                          newArray[1] = text
                          setEnum_options(newArray)
                        }}
                        label="Máximo"
                        maxLength={2}
                        keyboardType="numeric"
                        autoComplete="off"
                      />
                    </Flex>
                    {/* <Flex fill>
                      <TextInput
                        mode="outlined"
                        value={enum_options[1]?.label}
                        onChangeText={(text) => {
                          const newArray = [...enum_options]
                          newArray[1] = {
                            ...newArray[1],
                            label: text
                          }
                          setEnum_options(newArray)
                        }}
                        label="Etiqueta"
                        maxLength={100}
                        autoComplete="off"
                      /> 
                    </Flex> */}
                  </HStack>
                </VStack>
              )}
            </VStack>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <HStack
            fill
            justify="between"
          >
            <Button
              icon="close"
              mode="outlined"
              onPress={() => {
                handler[1]()
              }}
            >
              Cancelar
            </Button>

            <Button
              icon="content-save-outline"
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
