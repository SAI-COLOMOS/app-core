import { Flex, HStack, VStack } from "@react-native-material/core"
import Header from "../Shared/Header"
import Constants from "expo-constants"
import { useCallback, useEffect, useState } from "react"
import { useFocusEffect } from "@react-navigation/native"
import { Card, IconButton, TouchableRipple, Text, TextInput, useTheme, Avatar, FAB } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"


export default Forms = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const { actualUser, token } = route.params
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const theme = useTheme()

    const [forms, setForms] = useState(undefined);
    
    const getForms = async () => {
        // setLoading(true)
    
        const request = await fetch(`${localhost}/forms`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache"
          }
        })
          .then((response) => (response.ok ? response.json() : response.status))
          .catch(() => null)
    
        // setLoading(false)
    
        if (request?.forms) {
          setForms(request.forms)
        } else {
          setUsers(request)
        }
    }

    useEffect(() => {
        navigation.setOptions({
          header: (props) => <Header {...props} /*children={[<IconButton key="FilterButton" icon="filter-outline" onPress={() => setShowFilters(!showFilters)} />, <IconButton key="SearchButton" icon="magnify" onPress={() => setShowSearch(!showSearch)} />]}*/ />,
          headerTransparent: true,
          headerTitle: "Formularios"
        })
    }, [])

    useFocusEffect(
        useCallback(() => {
          getForms()
          return () => {}
        }, [])
    )

    return (
        <Flex fill pt={headerMargin}>

        </Flex>
    )
}