import { Flex, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { useHeaderHeight } from "@react-navigation/elements";
import { Text, Card, Avatar, TouchableRipple, IconButton, Button } from "react-native-paper"
import Header from "../Shared/Header"
import { ScrollView } from "react-native";

export default PlaceDetails = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const {place} = route.params

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props}/>,
            headerTransparent: true,
            headerTitle: place.place_name
        })
    }, [])

    const Item = ({area}) => {
        return (
            <Card>
                <TouchableRipple onPress={() => {
                    
                }}>
                    <Card.Title
                        title={`${area.area_name}`}
                        subtitle={`Empty`}
                        left={props => <Avatar.Icon {...props} icon="account"/>}
                    />
                </TouchableRipple>
            </Card>
        )
    }

    return (
        <Flex fill pt={headerMargin}>
            <ScrollView>
                <VStack p={10} spacing={10}>
                    <Flex>
                        <Text variant="bodyLarge">
                            Áreas del lugar
                        </Text>
        
                        <VStack spacing={10}>
                            {
                                place?.place_areas.length > 0 ? (
                                    place.place_areas.map(area => (
                                        <Flex>
                                            <Item area={area}/>
                                        </Flex>
                                    ))
                                ) : (
                                    <VStack center spacing={20}>
                                        <IconButton icon="wifi-alert" size={50}/>
                                        <VStack center>
                                            <Text variant="headlineSmall">
                                                Sin datos
                                            </Text>
                                            <Text variant="bodyMedium" style={{textAlign: "center"}}>
                                                El lugar no cuenta con áreas registradas 
                                            </Text>
                                        </VStack>
                                    </VStack>
                                )
                            }
                        </VStack>

                    </Flex>
                </VStack>
            </ScrollView>
        </Flex>
    )
}