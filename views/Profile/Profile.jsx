import { Flex, VStack } from '@react-native-material/core'
import { useState, useEffect, useCallback } from 'react'
import { Button, Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper'
import { useHeaderHeight } from '@react-navigation/elements'
import Header from '../Shared/Header'
import * as SecureStore from 'expo-secure-store'
import { FlatList, Image, RefreshControl, ScrollView } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Constants from 'expo-constants'
import DisplayDetails from '../Shared/DisplayDetails'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator'

export default Profile = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const headerMargin = useHeaderHeight()
  const { user, token } = route.params

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} children={[<Logout key="Logout"/>]} />,
      headerTransparent: true,
      headerTitle: 'Tu perfil'
    })
  }, [])

  const Logout = () => (
    <IconButton
      icon="logout"
      onPress={async (_) => {
        await SecureStore.deleteItemAsync('token')
        await SecureStore.deleteItemAsync('user')
        await SecureStore.deleteItemAsync('keepAlive')
        navigation.popToTop()
        navigation.replace('Login')
      }}
    />
  )

  const PersonalData = () => (
    <Card mode="outlined">
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Datos personales</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Edad</Text>
            <Text variant="bodyMedium">{user?.age} años</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">CURP</Text>
            <Text variant="bodyMedium">{user?.curp}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Grupo sanguíneo</Text>
            <Text variant="bodyMedium">RH {user?.blood_type}</Text>
          </Flex>

          {user?.school != 'No aplica' ? (
            <Flex>
              <Text variant="labelSmall">Escuela de procedencia</Text>
              <Text variant="bodyMedium">{user?.school}</Text>
            </Flex>
          ) : null}
        </VStack>
      </VStack>
    </Card>
  )

  const ContactData = () => (
    <Card mode="outlined">
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Datos de contacto</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Teléfono</Text>
            <Text variant="bodyMedium">{user?.phone}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Correo electrónico</Text>
            <Text variant="bodyMedium">{user?.email}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const EmergencyData = () => (
    <Card mode="outlined">
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Datos de emergencia</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Contacto de emergencia</Text>
            <Text variant="bodyMedium">{user?.emergency_contact}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Teléfono de emergencia</Text>
            <Text variant="bodyMedium">{user?.emergency_phone}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const AccountData = () => (
    <Card mode="outlined">
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Datos de la cuenta</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Registro</Text>
            <Text variant="bodyMedium">{user?.register}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Estado</Text>
            <Text variant="bodyMedium">{user?.status}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Rol</Text>
            <Text variant="bodyMedium">{user?.role}</Text>
          </Flex>

          {user?.provider_type != 'No aplica' ? (
            <Flex>
              <Text variant="labelSmall">Tipo de prestador</Text>
              <Text variant="bodyMedium">{user?.provider_type}</Text>
            </Flex>
          ) : null}

          <Flex>
            <Text variant="labelSmall">Bosque urbano</Text>
            <Text variant="bodyMedium">{user?.place}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Área asignada</Text>
            <Text variant="bodyMedium">{user?.assigned_area}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const UpdatePassword = () => (
    <Button
      icon="form-textbox-password"
      onPress={() => {
        navigation.navigate('UpdatePassword', { token, register: user?.register })
      }}
    >
      Actualizar contraseña
    </Button>
  )

  return (
    <Flex fill mt={headerMargin - 20}>
      <ScrollView>
        <DisplayDetails icon="account-circle-outline" photo={user?.avatar} title={`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name ?? ''}`} children={[<PersonalData key="Personal"/>, <ContactData key="Contact" />, <EmergencyData key="Emergency" />, <AccountData key="Account" />]} actions={[<UpdatePassword key="UpdatePassword" />]} />
      </ScrollView>
    </Flex>
  )
}
