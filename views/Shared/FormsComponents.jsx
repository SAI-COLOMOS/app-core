import { Slider } from "@miblanchard/react-native-slider"
import { Flex, HStack, VStack } from "@react-native-material/core"
import { useState } from "react"
import { Card, Checkbox, RadioButton, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

const Base = ({ question, icon, description, child }) => {
  const theme = useTheme()

  return (
    <Card
      mode="outlined"
      style={{ overflow: "hidden", backgroundColor: theme.colors.background }}
    >
      <>
        <HStack
          style={{ backgroundColor: theme.colors.primaryContainer }}
          p={20}
          spacing={10}
          items="start"
        >
          {icon && (
            <Flex pt={3}>
              <Icon
                name={icon}
                size={20}
                color={theme.colors.onPrimaryContainer}
              />
            </Flex>
          )}
          <Flex fill>
            <Text variant="titleMedium">{question}</Text>
          </Flex>
        </HStack>

        {description && (
          <Flex
            style={{ backgroundColor: theme.colors.elevation.level1 }}
            ph={20}
            pv={10}
          >
            <Text variant="labelMedium">{description}</Text>
          </Flex>
        )}

        <Flex>{child}</Flex>
      </>
    </Card>
  )
}

const MultipleOption = ({ question, options, id, getter, setter }) => {
  const Child = () => (
    <Flex>
      <RadioButton.Group
        onValueChange={(newValue) => {
          const newObject = { ...getter, [id]: newValue }
          setter(newObject)
        }}
        value={getter[id]}
      >
        {options?.length > 0 &&
          options.map((option, index) => (
            <RadioButton.Item
              style={{ paddingHorizontal: 20 }}
              label={option}
              value={option}
            />
          ))}
      </RadioButton.Group>
    </Flex>
  )

  return (
    <Base
      question={question}
      icon="checkbox-marked-circle-outline"
      description="Selecciona solo una respuesta"
      child={Child()}
    />
  )
}

const MultipleSelection = ({ question, options, id, getter, setter }) => {
  const Child = () => (
    <Flex>
      {options?.length > 0 &&
        options.map((option, index) => (
          <Checkbox.Item
            label={option}
            onPress={() => {
              const newArray = getter[id] === null ? [] : [...getter[id]]

              const index = newArray.indexOf(option)

              if (index == -1) {
                newArray.push(option)
              } else {
                newArray.splice(index, 1)
              }
              // setSelectedOptions(newArray)
              const newObject = { ...getter, [id]: newArray }
              setter(newObject)
            }}
            status={getter[id]?.includes(option) ? "checked" : "unchecked"}
          />
        ))}
    </Flex>
  )

  return (
    <Base
      question={question}
      icon="checkbox-multiple-marked-circle-outline"
      description="Puedes seleccionar varias respuestas"
      child={Child()}
    />
  )
}

const OpenQuestion = ({ question, id, getter, setter }) => {
  const theme = useTheme()

  const Child = () => (
    <Flex>
      <TextInput
        mode="flat"
        style={{ backgroundColor: theme.colors.background }}
        multiline={true}
        numberOfLines={5}
        placeholder="Escribe aquí tu respuesta..."
        maxLength={500}
        value={getter[id]}
        onChangeText={(text) => {
          const newObject = { ...getter, [id]: text }
          setter(newObject)
        }}
      />
    </Flex>
  )

  return (
    <Base
      question={question}
      icon="alphabetical-variant"
      child={Child()}
    />
  )
}

const NumericQuestion = ({ question, id, getter, setter }) => {
  const theme = useTheme()

  const Child = () => (
    <Flex>
      <TextInput
        mode="flat"
        placeholder="Escribe aquí tu respuesta..."
        style={{ backgroundColor: theme.colors.background }}
        maxLength={100}
        value={getter[id]}
        onChangeText={(text) => {
          const newObject = { ...getter, [id]: text }
          setter(newObject)
        }}
        keyboardType="numeric"
        autoComplete="off"
      />
    </Flex>
  )

  return (
    <Base
      question={question}
      icon="numeric"
      child={Child()}
    />
  )
}

const ScaleQuestion = ({ question, options, id, getter, setter }) => {
  const [valueSelected, setValueSelected] = useState(options[1])
  const theme = useTheme()

  const Child = () => (
    <Flex p={20}>
      <HStack justify="between">
        <Text variant="titleMedium">{options[0]}</Text>
        <Text variant="titleMedium">{options[1]}</Text>
      </HStack>
      <Slider
        step={1}
        renderThumbComponent={() => (
          <Flex
            center
            style={{ width: 30, height: 30, borderRadius: theme.roundness, backgroundColor: theme.colors.primary, overflow: "hidden" }}
          >
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onPrimary }}
            >
              {getter[id] ?? options[1]}
            </Text>
          </Flex>
        )}
        minimumTrackTintColor={theme.colors.inversePrimary}
        maximumTrackTintColor={theme.colors.backdrop}
        thumbTintColor={theme.colors.primary}
        minimumValue={options[0]}
        maximumValue={options[1]}
        value={getter[id] ?? options[1]}
        onValueChange={(value) => {
          const newObject = { ...getter, [id]: value[0] }
          setter(newObject)
        }}
      />
    </Flex>
  )

  return (
    <Base
      question={question}
      icon="format-list-bulleted"
      child={Child()}
    />
  )
}

export { MultipleOption, OpenQuestion, NumericQuestion, MultipleSelection, ScaleQuestion }
