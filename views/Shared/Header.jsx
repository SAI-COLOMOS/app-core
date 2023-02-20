import { useState } from "react";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { Flex, VStack, HStack } from "@react-native-material/core";
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default Header = ({options, navigation, children}) => {
    const insets = useSafeAreaInsets()
    const theme = useTheme()


    const [showSearchBar, setShowSearchBar] = useState(false)
    const [showFilterBar, setShowFilterBar] = useState(false)

    return (
        <Flex>
            <Flex pt={insets.top} style={{backgroundColor: theme.colors.elevation.level5, borderBottomLeftRadius: 20, borderBottomRightRadius: 20}}>
                <HStack p={10} justify="between" items="center">
                    <HStack items="center" spacing={10}>
                        <IconButton icon="arrow-left" onPress={_ => {
                            navigation.pop()
                        }}/>
                        <Text variant="headlineSmall">
                            {options.headerTitle}
                        </Text>
                    </HStack>

                    <HStack>
                        {
                            children?.length > 0 ? (
                                children.map(child => (
                                    child
                                ))
                            ) : (
                                null
                            )
                        }
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