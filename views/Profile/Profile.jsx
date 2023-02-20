import { Flex, VStack } from '@react-native-material/core'
import { useState, useEffect } from 'react'
import { IconButton, Text, TextInput } from 'react-native-paper'
import { useHeaderHeight } from "@react-navigation/elements";
import Header from '../Shared/Header'
import * as SecureStore from 'expo-secure-store';
import { Image, ScrollView } from 'react-native';

export default Profile = ({navigation, route}) => {
    const headerMargin = useHeaderHeight()
    const {user, token} = route.params

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props} children={[
                <Logout/>
            ]}/>,
            headerTransparent: true,
            headerTitle: "Tu perfil"
        })
    }, [])

    const Logout = () => {
        return (
            <IconButton key="logut" icon="logout" onPress={async _ => {
                await SecureStore.deleteItemAsync("token")
                navigation.replace("Login")
            }}/>
        )
    }
    
    return (
        <Flex fill pt={headerMargin}>
            <ScrollView>
                <VStack p={20} spacing={30}>
                    <VStack items='center'>
                        <Flex w={150} h={150} justify="end" items='end'>
                            <Image source={require('../../assets/logo.png')} style={{height: "100%", width: "100%", position: 'absolute'}} />
                            <IconButton mode='contained' icon="pencil-outline"/>
                        </Flex>
                        <Text variant="headlineSmall" numberOfLines={1}>
                                {`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name}`}
                        </Text>
                        <Text variant="bodySmall" numberOfLines={1}>
                                {`${user.role}${user.provider_type != "no aplica" ? ` - ${user.provider_type}` : null}`}
                        </Text>
                    </VStack>

                    <Flex>
                        <Text variant='bodyLarge'>
                            Tu información personal
                        </Text>
                        <VStack spacing={10}>
                            <TextInput mode="outlined" editable={false} value={user.first_name} label="Nombre"/>
                            <TextInput mode="outlined" editable={false} value={user.first_last_name} label="Apellido paterno"/>
                            <TextInput mode="outlined" editable={false} value={user.second_last_name} label="Apellido materno"/>
                            <TextInput mode="outlined" editable={false} value={user.age} label="Edad"/>
                            <TextInput mode="outlined" editable={false} value={user.blood_type} label="Grupo sangíneo"/>
                        </VStack>
                    </Flex>

                    <Flex>
                        <Text variant='bodyLarge'>
                            Tu información de contacto
                        </Text>
                        <VStack spacing={10}>
                            <TextInput mode="outlined" editable={false} value={user.first_name} label="Nombre"/>
                            <TextInput mode="outlined" editable={false} value={user.first_last_name} label="Apellido paterno"/>
                            <TextInput mode="outlined" editable={false} value={user.second_last_name} label="Apellido materno"/>
                            <TextInput mode="outlined" editable={false} value={user.age} label="Edad"/>
                            <TextInput mode="outlined" editable={false} value={user.blood_type} label="Grupo sangíneo"/>
                        </VStack>
                    </Flex>
                </VStack>
                <Text>
                    {JSON.stringify(user)}
                </Text>
            </ScrollView>
        </Flex>
    )
}