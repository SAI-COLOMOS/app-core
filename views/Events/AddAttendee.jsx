import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useContext, useState } from "react"
import { FlatList, Pressable, ScrollView } from "react-native"
import { Button, Card, Text, TextInput } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import InformationMessage from "../Shared/InformationMessage"
import Constants from "expo-constants"
import ApplicationContext from "../ApplicationContext"
import ProfileImage from "../Shared/ProfileImage"

export default AddAttendee = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { token } = useContext(ApplicationContext)

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [foundUsers, setFoundUsers] = useState(undefined)
  const [users, setUsers] = useState(undefined)

  const searchUsers = async () => {
    setLoading(true)

    // let filters = {}

    // if (placeFilter !== "") {
    //   filters = { ...filters, place: placeFilter }
    // }

    // if (Object.keys(filters).length === 0 && search === "") {
    //   setFoundUsers(undefined)
    //   setLoading(false)
    //   return
    // }

    const request = await fetch(`${localhost}/users?search=${search.trim()}&filter=${JSON.stringify({ status: "Activo" })}`, {
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

    if (request?.users) {
      setFoundUsers(request.users)
      console.log(request.users)
    } else {
      setFoundUsers(request)
    }
  }

  const SearchList = () => (
    <Flex
      fill
      key="SearchList"
    >
      <Flex pb={20}>
        <TextInput
          mode="outlined"
          value={search}
          onChangeText={setSearch}
          label="Buscar prestadores"
          returnKeyType="search"
          returnKeyLabel="Buscar"
          onSubmitEditing={() => searchUsers()}
        />
      </Flex>

      {foundUsers !== null ? (
        foundUsers?.length >= 0 || foundUsers === undefined ? (
          foundUsers?.length > 0 ? (
            foundUsers.map((item) => (
              <Item
                key={item.register}
                item={item}
                register={item.register}
              />
            ))
          ) : (
            <InformationMessage
              icon="magnify"
              title="Sin resultados"
              description="No hay ningún usuario registrado que cumpla con los parámetros de tu búsqueda"
            />
          )
        ) : (
          <InformationMessage
            icon="bug-outline"
            title="¡Ups! Error nuestro"
            description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setFoundUsers(undefined)
              searchUsers()
            }}
          />
        )
      ) : (
        <InformationMessage
          icon="wifi-alert"
          title="Sin conexión"
          description="Parece que no tienes conexión a internet, conéctate e intenta de nuevo"
          buttonTitle="Volver a cargar"
          buttonIcon="reload"
          action={() => {
            setFoundUsers(undefined)
            searchUsers()
          }}
        />
      )}
      {/* <ScrollView>
        <VStack>
          {search == "" && (
            <InformationMessage
              icon="account-plus-outline"
              title="Agrega a personas"
              description="Busca a personas para agregarlas como asistentes a este evento, puedes hacerlo mediante su nombre o registro"
            />
          )}
        </VStack>
      </ScrollView> */}
    </Flex>
  )

  const Save = () => (
    <Button
      key="Save"
      mode="contained"
    >
      Guardar
    </Button>
  )

  const Cancel = () => (
    <Button
      key="Cancel"
      mode="outlined"
      onPress={() => navigation.pop()}
    >
      Cancelar
    </Button>
  )

  const Item = useCallback(({ item, register }) => {
    return (
      <Flex
        ph={0}
        pv={5}
        onPress={() => {}}
      >
        <Pressable
          onPress={() => {
            navigation.navigate("UserDetails", { register, placesOptions, schoolsOptions })
          }}
        >
          <Card
            mode="outlined"
            style={{ overflow: "hidden" }}
          >
            <HStack items="center">
              <ProfileImage image={item.avatar} />
              <Flex
                fill
                p={10}
              >
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                >
                  {item.first_name} {item.first_last_name} {item.second_last_name ?? null}
                </Text>
                <Text variant="bodySmall">{item.register}</Text>
                <Text variant="bodySmall">
                  {item.role} {item.role == "Prestador" && item.provider_type}
                </Text>
              </Flex>
            </HStack>
          </Card>
        </Pressable>
      </Flex>
    )
  }, [])

  return (
    <CreateForm
      title="Agregar asistentes"
      navigation={navigation}
      children={[SearchList()]}
      actions={[Save(), Cancel()]}
    />
  )
}
