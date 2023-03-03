import { Flex, VStack } from '@react-native-material/core'
import { useState, useEffect, useCallback } from 'react'
import { Button, IconButton, Text, TextInput, useTheme } from 'react-native-paper'
import { useHeaderHeight } from "@react-navigation/elements"
import Header from '../Shared/Header'
import * as SecureStore from 'expo-secure-store'
import { FlatList, Image, RefreshControl, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Constants from "expo-constants";
import DisplayDetails from '../Shared/DisplayDetails'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';

export default Profile = ({navigation, route}) => {
    const localhost = Constants.expoConfig.extra.API_LOCAL
    const headerMargin = useHeaderHeight()
    const {user, token} = route.params
    const theme = useTheme()

    const [loading, setLoading] = useState(false)
    const [profile, setProfile] = useState(undefined)
    const [photo, setPhoto] = useState(null)

    async function getProfile() {
        setLoading(true)

        const request = await fetch(
            `${localhost}/profile/${user.register}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                    "Cache-Control": "no-cache"
                }
            }
        ).then(
            response => response.ok ? response.json() : response.status
        ).catch(
            _ => null
        )

        setLoading(false)

        if(request?.user) {
            setProfile(request.user)
        } else {
            setProfile(request)
        }
    }

    async function pickPhoto() {
        let selectedPhoto = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })

        if(!selectedPhoto.canceled) {
            const compressPhoto = await manipulateAsync(
                selectedPhoto.assets[0].uri,
                [{resize: {height: 250, width: 250}}],
                {base64: true}
            )
            console.log(compressPhoto)
            setPhoto(compressPhoto.base64)
        }
    }

    useEffect(() => {
        navigation.setOptions({
            header: (props) => <Header {...props} children={[
                Logout()
            ]}/>,
            headerTransparent: true,
            headerTitle: "Tu perfil"
        })
    }, [])

    useFocusEffect(useCallback(() => {
        getProfile()

        return () => {}
    }, []))

    const Logout = () => {
        return (
            <IconButton key="logut" icon="logout" onPress={async _ => {
                await SecureStore.deleteItemAsync("token")
                await SecureStore.deleteItemAsync("user")
                await SecureStore.deleteItemAsync("keepAlive")
                navigation.popToTop()
                navigation.replace("Login")
            }}/>
        )
    }

    const PersonalData = () => {
        return (
            <VStack p={20} spacing={5}>
                <Text variant="bodyLarge">
                    Datos personales
                </Text>
                <VStack spacing={10}>
                    <Flex>
                        <Text variant='labelSmall'>
                            Edad
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.age} años
                        </Text>
                    </Flex>
                    
                    <Flex>
                        <Text variant='labelSmall'>
                            Grupo sanguíneo
                        </Text>
                        <Text variant="bodyMedium">
                            RH {profile?.blood_type}
                        </Text>
                    </Flex>

                    <Flex>
                        <Text variant='labelSmall'>
                            Escuela de procedencia
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.school}
                        </Text>
                    </Flex>
                </VStack>
            </VStack>
        )
    }

    const ContactData = () => {
        return (
            <VStack p={20} spacing={5}>
                <Text variant="bodyLarge">
                    Datos de contacto
                </Text>
                <VStack spacing={10}>
                    <Flex>
                        <Text variant='labelSmall'>
                            Teléfono
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.phone}
                        </Text>
                    </Flex>

                    <Flex>
                        <Text variant='labelSmall'>
                            Correo electrónico
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.email}
                        </Text>
                    </Flex>
                </VStack>
            </VStack>
        )
    }

    const EmergencyData = () => {
        return (
            <VStack p={20} spacing={5}>
                <Text variant="bodyLarge">
                    Datos de emergencia
                </Text>
                <VStack spacing={10}>
                    <Flex>
                        <Text variant='labelSmall'>
                            Contacto de emergencia
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.emergency_contact}
                        </Text>
                    </Flex>

                    <Flex>
                        <Text variant='labelSmall'>
                            Teléfono de emergencia
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.emergency_phone}
                        </Text>
                    </Flex>
                </VStack>
            </VStack>
        )
    }

    const AccountData = () => {
        return (
            <VStack p={20} spacing={5}>
                <Text variant="bodyLarge">
                    Datos de la cuenta
                </Text>
                <VStack spacing={10}>
                    <Flex>
                        <Text variant='labelSmall'>
                            Rol
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.role}
                        </Text>
                    </Flex>

                    <Flex>
                        <Text variant='labelSmall'>
                            Tipo de prestador
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.provider_type}
                        </Text>
                    </Flex>

                    <Flex>
                        <Text variant='labelSmall'>
                            Bosque urbano de procedencia
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.place}
                        </Text>
                    </Flex>

                    <Flex>
                        <Text variant='labelSmall'>
                            Área de asignada
                        </Text>
                        <Text variant="bodyMedium">
                            {profile?.assigned_area}
                        </Text>
                    </Flex>
                </VStack>
            </VStack>
        )
    }

    const UpdatePassword = () => {
        return (
            <Button icon="form-textbox-password" onPress={() => {
                navigation.navigate("UpdatePassword", {token, register: profile?.register})
            }}>
                Actualizar contraseña
            </Button>
        )
    }

    const UpdatePhoto = () => {
        return (
            <Button icon="form-textbox-password" onPress={() => {
                pickPhoto()
            }}>
                Actualizar foto
            </Button>
        )
    }
    
    return (
        <Flex fill mt={headerMargin - 20}>
            <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={_ => getProfile()} />}>
                {
                    profile !== undefined ? (
                        profile !== null ? (
                            isNaN(profile) ? (
                                <DisplayDetails icon="account-circle-outline" photo={profile?.avatar} title={`${profile?.first_name} ${profile?.first_last_name} ${profile?.second_last_name ?? ""}`} children={[PersonalData(), ContactData(), EmergencyData(), AccountData()]} actions={[UpdatePassword(), UpdatePhoto()]}/>
                            ) : (
                                null
                            )
                        ) : (
                            null
                        )
                    ) : (
                        null
                    )
                }
            </ScrollView>
        </Flex>
    )
}