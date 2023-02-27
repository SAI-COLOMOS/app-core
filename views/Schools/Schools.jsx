import { Flex } from "@react-native-material/core"
import { useState, useEffect } from "react"
import { Button, FAB, Text } from "react-native-paper"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useHeaderHeight } from "@react-navigation/elements";
import Header from "../Shared/Header"
import { FlatList } from "react-native";

export default Schools = ({navigation, route}) => {
    const {user, token} = route.params
    const insets = useSafeAreaInsets()
    const headerMargin = useHeaderHeight()

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props}/>,
            headerTransparent: true,
            headerTitle: "Escuelas"
        })
    }, [])

    return (
        <Flex fill pt={headerMargin}>
            <FlatList>
            </FlatList>
            <FAB icon="plus" style={{position: "absolute", margin: 16, right: 0, bottom: 0}} onPress={() => {
                navigation.navigate("AddSchool", {
                    user,
                    token
                })
            }}/>
        </Flex>
    )
}