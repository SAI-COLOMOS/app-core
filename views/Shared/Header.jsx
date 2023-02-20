import { useState } from "react";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { Flex, VStack, HStack } from "@react-native-material/core";
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default Header = (props) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()

    const {headerTitle} = props.options

    const [showSearchBar, setShowSearchBar] = useState(false)
    const [showFilterBar, setShowFilterBar] = useState(false)

    return (
        <Flex>
            <Flex pt={insets.top} style={{backgroundColor: theme.colors.elevation.level5, borderBottomLeftRadius: 50, borderBottomRightRadius: 50}}>
                <HStack p={10} justify="between" items="center">
                    <HStack items="center" spacing={10}>
                        <IconButton icon="arrow-left" onPress={_ => {
                            props.navigation.pop()
                        }}/>
                        <Text variant="headlineMedium">
                            {headerTitle}
                        </Text>
                    </HStack>

                    <HStack>
                        <IconButton icon="filter-outline" onPress={_ => {
                            setShowFilterBar(!showFilterBar)
                            console.log(showFilterBar)
                        }}/>

                        <IconButton icon="magnify" onPress={_ => {
                            setShowSearchBar(!showSearchBar)
                            console.log(showSearchBar)
                        }}/>
                    </HStack>
                </HStack>
            </Flex>
            
            {
                showSearchBar ? (
                    <Flex pr={10} pl={10}>
                        <TextInput mode="outlined"/>
                    </Flex>
                ) : (
                    null
                )
            }
        </Flex>
    )
}