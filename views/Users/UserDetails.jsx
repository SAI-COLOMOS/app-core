import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { FlatList, RefreshControl, ScrollView } from "react-native"
import { ActivityIndicator, Avatar, Button, Card, FAB, ProgressBar, Text, useTheme } from "react-native-paper"
import { useHeaderHeight } from "@react-navigation/elements"
import Constants from "expo-constants"
import Header from "../Shared/Header"
import DisplayDetails from "../Shared/DisplayDetails"
import { useFocusEffect } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export default UserDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { actualUser, token, register, placesOptions, schoolsOptions } = route.params
  const headerMargin = useHeaderHeight()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(undefined)

  async function getUser() {
    setLoading(true)
    const request = await fetch(`${localhost}/users/${register}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.user) {
      setUser(request.user)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Datos del usuario"
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      getUser()
      return () => {}
    }, [])
  )

  const PersonalData = () => (
    <Card key="Personal" mode="outlined">
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

          {user?.school != "No aplica" ? (
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
    <Card key="Contact" mode="outlined">
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
    <Card key="Emergency" mode="outlined">
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
    <Card key="Account" mode="outlined">
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

          {user?.provider_type != "No aplica" ? (
            <Flex>
              <Text variant="labelSmall">Tipo de prestador</Text>
              <Text variant="bodyMedium">{user?.provider_type}</Text>
            </Flex>
          ) : null}

          {user?.provider_type != "No aplica" ? (
            <Flex>
              <Text variant="labelSmall">Horas asignadas</Text>
              <Text variant="bodyMedium">{user?.total_hours}</Text>
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

  return (
    <Flex fill mt={headerMargin - 20}>
      {user !== undefined ? (
        user !== null ? (
          isNaN(user) ? (
            <DisplayDetails photo={user?.avatar} icon="account" title={`${user?.first_name} ${user?.first_last_name} ${user?.second_last_name == undefined ? "" : user?.second_last_name}`} children={[PersonalData(), ContactData(), EmergencyData(), AccountData()]} refreshStatus={loading} refreshAction={getUser} />
          ) : (
            <VStack p={30} center spacing={20}>
              <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50} />
              <VStack center>
                <Text variant="headlineSmall">Ocurrió un problema</Text>
                <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                  No podemos recuperar los datos de la escuela, intentalo de nuevo más tarde (Error: {user})
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getUser()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : (
          <VStack center spacing={20} p={30}>
            <Icon color={theme.colors.onBackground} name="wifi-alert" size={50} />
            <VStack center>
              <Text variant="headlineSmall">Sin internet</Text>
              <Text variant="bodyMedium" style={{ textAlign: "center" }}>
                No podemos recuperar los datos de la escuela, revisa tu conexión a internet e intentalo de nuevo
              </Text>
            </VStack>
            <Flex>
              <Button
                mode="outlined"
                onPress={() => {
                  getUser()
                }}
              >
                Volver a intentar
              </Button>
            </Flex>
          </VStack>
        )
      ) : null}

      {!(user === undefined || user === null) ? (
        <FAB
          icon="pencil-outline"
          style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate("EditUser", {
              token,
              actualUser,
              user,
              placesOptions,
              schoolsOptions
            })
          }}
        />
      ) : null}
    </Flex>
  )
}
