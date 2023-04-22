import { Flex, HStack } from "@react-native-material/core"
import React, { useState, useEffect } from "react"
import { IconButton, TextInput } from "react-native-paper"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"

export default SearchBar = ({ label, value, setter, show, action }) => {
  const [clear, setClear] = useState(false)
  const [timer, setTimer] = useState(undefined)

  const animationConfiguration = { duration: 250, easing: Easing.bezier(0.5, 0.01, 0.75, 1) }

  const displaySearchBarHeight = useSharedValue(0)
  const displaySearchBarOpacity = useSharedValue(0)
  const displayEraseWidth = useSharedValue(0)
  const displayEraseOpacity = useSharedValue(0)

  const animatedSearchBarStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(displaySearchBarHeight.value, animationConfiguration),
      opacity: withTiming(displaySearchBarOpacity.value, animationConfiguration)
    }
  })

  const animatedEraseStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(displayEraseWidth.value, animationConfiguration),
      opacity: withTiming(displayEraseOpacity.value, animationConfiguration)
    }
  })

  function handler(input) {
    setter(input)
    clearTimeout(timer)
    setTimer(setTimeout(() => action(input), 2000))
  }

  useEffect(() => {
    if (show == true) {
      displaySearchBarHeight.value = 60
      displaySearchBarOpacity.value = 1
    } else {
      displaySearchBarHeight.value = 0
      displaySearchBarOpacity.value = 0
    }
  }, [show])

  useEffect(() => {
    if (value) {
      displayEraseWidth.value = 50
      displayEraseOpacity.value = 1
    } else {
      displayEraseWidth.value = 0
      displayEraseOpacity.value = 0
    }
  }, [value])

  useEffect(() => {
    if (clear === true && value == "") {
      action()
      setClear(false)
    }
  }, [value, clear])

  useEffect(() => {
    if (show === false) {
      setter("")
      setClear(true)
    }
  }, [show])

  return (
    <Animated.View style={[{}, animatedSearchBarStyle]}>
      <HStack
        ph={20}
        spacing={10}
        items="end"
      >
        <Flex fill>
          <TextInput
            mode="outlined"
            label={label ?? "Búsqueda"}
            clearTextOnFocus={true}
            value={value}
            returnKeyType="search"
            returnKeyLabel="Buscar"
            onChangeText={setter}
            onSubmitEditing={() => action(value)}
          />
        </Flex>
        <Animated.View style={[{}, animatedEraseStyle]}>
          <IconButton
            mode="outlined"
            icon="close"
            onPress={() => {
              setter("")
              setClear(true)
            }}
          />
        </Animated.View>
      </HStack>
    </Animated.View>
  )
}
