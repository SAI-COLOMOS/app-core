import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { FlatList, Pressable, ScrollView } from "react-native"
import { Button, Card, Chip, Text, TextInput } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import InformationMessage from "../Shared/InformationMessage"
import Constants from "expo-constants"
import ApplicationContext from "../ApplicationContext"
import ProfileImage from "../Shared/ProfileImage"
import ModalMessage from "../Shared/ModalMessage"

export default AddAttendee = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const { event_identifier, getEvent } = route.params

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [foundUsers, setFoundUsers] = useState(undefined)

  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function searchUsers() {
    setLoading(true)

    const request = await fetch(`${host}/users?search=${search.trim()}&filter=${JSON.stringify({ status: "Activo" })}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
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

  async function addAttendee(register) {
    setModalLoading(true)

    const request = await fetch(`${host}/agenda/${event_identifier}/attendance/several`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        attendees: [{ register }]
      })
    })
      .then(async (response) => {
        console.log(await response.json())
        return response.status
      })
      .catch(() => null)

    setModalLoading(false)

    if (request == 201) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
    // setLoading(true)

    // const request = await fetch(`${host}/agenda/${event_identifier}/attendance/several`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({
    //     register
    //   })
    // })
    //   .then((response) => (response.ok ? response.json() : response.status))
    //   .catch(() => null)

    // setLoading(false)

    // if (request?.users) {
    //   setFoundUsers(request.users)
    //   console.log(request.users)
    // } else {
    //   setFoundUsers(request)
    // }
  }

  useEffect(() => {
    if (search.length == 0) {
      setFoundUsers(undefined)
    }
  }, [search])

  const SearchList = () => (
    <VStack
      fill
      spacing={20}
      key="SearchList"
    >
      <Flex>
        <TextInput
          mode="outlined"
          value={search}
          clearTextOnFocus={true}
          onChangeText={setSearch}
          label="Buscar prestadores"
          returnKeyType="search"
          returnKeyLabel="Buscar"
          onSubmitEditing={() => searchUsers()}
        />
      </Flex>

      <Flex>
        <Text variant="titleMedium">Resultados de la búsqueda</Text>
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
            ) : foundUsers == undefined ? (
              <InformationMessage
                icon="account-plus-outline"
                title="Agrega a un participante"
                description="Puedes buscarlo mediante su nombre o registro. No importa si ya no hay cupo en el evento, puedes agregar cuantos participantes quieras"
              />
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
      </Flex>
    </VStack>
  )

  const Save = () => (
    <Button
      key="Save"
      mode="contained"
      disabled={modalLoading}
      loading={modalLoading}
      onPress={() => setModalConfirm(true)}
    >
      Guardar
    </Button>
  )

  const Cancel = () => (
    <Button
      key="Cancel"
      mode="outlined"
      disabled={modalLoading}
      onPress={() => navigation.pop()}
      icon="close"
    >
      Cancelar
    </Button>
  )

  const Item = useCallback(({ item, register }) => {
    const [avatar, setAvatar] = useState(undefined)

    const requestAvatar = useCallback(async () => {
      const request = await fetch(`${host}/users/${register}?avatar=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .catch(() => null)

      request?.avatar ? setAvatar(request.avatar) : setAvatar(null)
    }, [])

    useEffect(() => {
      requestAvatar()
    }, [])
    return (
      <Flex
        ph={0}
        pv={5}
        onPress={() => {}}
      >
        <Pressable onPress={() => addAttendee(register)}>
          <Card
            mode="outlined"
            style={{ overflow: "hidden" }}
          >
            <HStack>
              <ProfileImage
                image={avatar}
                icon="account-outline"
              />
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
                <Text variant="bodyMedium">{item.register}</Text>
              </Flex>
            </HStack>
          </Card>
        </Pressable>
      </Flex>
    )
  }, [])

  return (
    <Flex fill>
      <CreateForm
        title="Agregar asistente"
        navigation={navigation}
        children={[SearchList()]}
        actions={[/*Save(), */ Cancel()]}
        refreshingStatus={loading}
        refreshingAction={() => searchUsers()}
      />

      <ModalMessage
        title="Confirmar asistente"
        description="¿Seguro que desea agrega a este asistente?"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[["Aceptar", () => null], ["Cancelar"]]}
        dismissable={true}
        icon="account-plus-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El participante ha sido añadido exitosamente"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getEvent()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos añadir al participante, inténtalo más tarde. (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Sin conexión a internet"
        description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`}
        handler={[modalFatal, () => setModalFatal(!modalFatal)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="wifi-alert"
      />
    </Flex>
  )
}
