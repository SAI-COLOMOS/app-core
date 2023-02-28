import { Flex } from "@react-native-material/core"
import { useState, useEffect } from "react"
import { Text } from "react-native-paper"

export default AddArea = ({route}) => {
    const {usuario} = route.params
    return (
        <Flex fill>
            <Text variant="headlineMedium">
                Hola {usuario}
            </Text>
        </Flex>
    )
}