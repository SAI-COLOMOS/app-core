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

export default AddSurvey = ({ navigation, route }) => {
  const { host, token } = useContext(ApplicationContext)
  const { event_identifier, getEvent } = route.params

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [foundForms, setFoundForms] = useState(undefined)

  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function searchForms() {
    setLoading(true)

    const request = await fetch(`${host}/forms?search=${search.trim()}&isTemplate=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.forms) {
      setFoundForms(request.forms)
      console.log(request.forms)
    } else {
      setFoundForms(request)
    }
  }

  async function linkForm(form_identifier) {
    setModalLoading(true)

    const request = await fetch(`${host}/surveys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        form_identifier,
        event_identifier
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
  }

  useEffect(() => {
    if (search.length == 0) {
      setFoundForms(undefined)
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
          label="Buscar formularios"
          returnKeyType="search"
          returnKeyLabel="Buscar"
          onSubmitEditing={() => searchForms()}
        />
      </Flex>

      <Flex>
        <Text variant="titleMedium">Resultados de la búsqueda</Text>
        {foundForms !== null ? (
          foundForms?.length >= 0 || foundForms === undefined ? (
            foundForms?.length > 0 ? (
              foundForms.map((item) => (
                <Item
                  key={item.form_identifier}
                  item={item}
                  form_identifier={item.form_identifier}
                />
              ))
            ) : foundForms == undefined ? (
              <InformationMessage
                icon="form-select"
                title="Vincula un formulario"
                description="Puedes buscarlo mediante su nombre o folio"
              />
            ) : (
              <InformationMessage
                icon="magnify"
                title="Sin resultados"
                description="No hay ningún formulario que cumpla con los parámetros de tu búsqueda"
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
                setFoundForms(undefined)
                searchForms()
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
              setFoundForms(undefined)
              searchForms()
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

  const Item = useCallback(({ item, form_identifier }) => {
    return (
      <Flex
        ph={0}
        pv={5}
        onPress={() => {}}
      >
        <Pressable onPress={() => linkForm(form_identifier)}>
          <Card
            mode="outlined"
            style={{ overflow: "hidden" }}
          >
            <HStack>
              <ProfileImage icon="form-select" />
              <Flex
                fill
                p={10}
              >
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text variant="bodyMedium">{item.version}</Text>
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
        title="Vincular formulario"
        navigation={navigation}
        children={[SearchList()]}
        actions={[/*Save(), */ Cancel()]}
        refreshingStatus={loading}
        refreshingAction={() => searchForms()}
      />

      <ModalMessage
        title="Confirmar asistente"
        description="¿Seguro que desea agrega este formulario?"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[["Aceptar", () => null], ["Cancelar"]]}
        dismissable={true}
        icon="account-plus-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El formulario ha sido vinculado exitosamente"
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
        description={`No pudimos vincular el formulario, inténtalo más tarde. (${responseCode})`}
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
