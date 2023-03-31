import { Flex, VStack } from '@react-native-material/core'
import { useCallback, useEffect, useState } from 'react'
import { FlatList, RefreshControl, ScrollView } from 'react-native'
import { ActivityIndicator, Avatar, Button, Card, FAB, ProgressBar, Text, useTheme } from 'react-native-paper'
import { useHeaderHeight } from '@react-navigation/elements'
import Constants from 'expo-constants'
import Header from '../Shared/Header'
import DisplayDetails from '../Shared/DisplayDetails'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default FormDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { token, form_identifier } = route.params
  const headerMargin = useHeaderHeight()
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(undefined)

  async function getForm() {
    setLoading(true)

    const request = await fetch(`${localhost}/forms/${form_identifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    })
    .then((response) => (response.ok ? response.json() : response.status))
    .catch((_) => null)

    console.log(request.json)

    setLoading(false)

    if (request?.form) {
      setForm(request.form)
      console.log(request)
    } else {
      setForm(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: 'Datos del formulario'
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      getForm()
      return () => {}
    }, [])
  )

  const Details = () => (
    <Card key="Details" mode="outlined">
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Datos del formulario</Text>
        <VStack spacing={10}>
          <Flex>
            <Text variant="labelSmall">Descripción</Text>
            <Text variant="bodyMedium">{form?.description}</Text>
          </Flex>
          
          <Flex>
            <Text variant="labelSmall">Registro del autor </Text>
            <Text variant="bodyMedium">{form?.author_register}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Área al que pertenece </Text>
            <Text variant="bodyMedium">{form?.belonging_area}</Text>
          </Flex>
          
          <Flex>
            <Text variant="labelSmall">Parque al que pertenece </Text>
            <Text variant="bodyMedium">{form?.belonging_place}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Version </Text>
            <Text variant="bodyMedium">{form?.version}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">ID </Text>
            <Text variant="bodyMedium">{form?.form_identifier}</Text>
          </Flex>
        </VStack>
      </VStack>
    </Card>
  )

  const Questions = () => (
    <Flex key="Preguntas">
      <VStack p={10} spacing={10}>
        {form.questions.length > 0 ? (
          form.questions.map((ask) => (
            <Card mode="outlined" key={ask.interrogation}>
                <Flex>
                    <Text variant="labelSmall">Preguntas</Text>
                    <Text variant="bodyMedium">{ask?.interrogation}</Text>
                </Flex>
            </Card>
          ))
        ):( <Text variant="labelSmall">No hay preguntas en este formulario.</Text> ) }
      </VStack>
    </Flex>
  )

  return (
    <Flex fill pt={headerMargin - 20}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={(_) => getForm()} />}>
        {form !== undefined ? (
          form !== null ? (
            isNaN(form) ? (
              <DisplayDetails icon="form-select" title={form?.name} children={[Details()]} />
            ) : (
              <VStack p={30} center spacing={20}>
                <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50} />
                <VStack center>
                  <Text variant="headlineSmall">Ocurrió un problema</Text>
                  <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                    No podemos recuperar los datos del formulario, intentalo de nuevo más tarde (Error: {form})
                  </Text>
                </VStack>
                <Flex>
                  <Button
                    mode="outlined"
                    onPress={(_) => {
                      getForm()
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
                <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                  No podemos recuperar los datos del formulario, revisa tu conexión a internet e intentalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={(_) => {
                    getForm()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : null}
      </ScrollView>

      {!(form === undefined || form === null) ? (
        <FAB
          icon="pencil-outline"
          style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate('AddSchool', {
              token,
              form
            })
          }}
        />
      ) : null}
    </Flex>
  )
}
