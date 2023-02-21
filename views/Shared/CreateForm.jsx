import { Flex, VStack, HStack } from "@react-native-material/core"
import { ScrollView, KeyboardAvoidingView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, TouchableRipple, useTheme } from "react-native-paper"

export default CreateForm = ({navigation, route, title, children, actions}) => {
    const theme = useTheme()
    const insets = useSafeAreaInsets()

    console.log(children.length);

    return (
        <Flex fill>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{width: "100%", height: "100%"}}>
                <Flex fill style={{backgroundColor: theme.colors.backdrop}} justify="end">
                    <TouchableRipple android_ripple={false} style={{width: "100%", height: "100%", position: "absolute"}} onPress={() => {
                        navigation.pop()
                    }}>
                        <Flex fill/>
                    </TouchableRipple>

                    <Flex maxH={"90%"} pb={insets.bottom} style={{backgroundColor: theme.colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden"}}>
                        <ScrollView>

                                <Flex p={25} items="center">
                                    <Text variant="headlineMedium" style={{textAlign: "center"}}>
                                        {title}
                                    </Text>
                                </Flex>

                                <VStack pr={25} pl={25} pb={50} spacing={30}>
                                    {
                                        children.map(child => (
                                            child
                                        ))
                                    }
                                </VStack>

                        </ScrollView>

                        <HStack spacing={20} justify="end" p={10}>
                            {
                                actions.map(action => (
                                    action
                                ))
                            }
                        </HStack>
                    </Flex>
                </Flex>
            </KeyboardAvoidingView>
        </Flex>
    )
}