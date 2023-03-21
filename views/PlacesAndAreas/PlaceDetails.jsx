import { Flex, VStack } from '@react-native-material/core'
import { useEffect, useState, useCallback } from 'react'
import { useHeaderHeight } from '@react-navigation/elements'
import { Text, Card, Button, FAB, useTheme } from 'react-native-paper'
import Header from '../Shared/Header'
import Constants from 'expo-constants'
import DisplayDetails from '../Shared/DisplayDetails'
import { ScrollView, RefreshControl } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default PlaceDetails = ({ navigation, route }) => {
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const headerMargin = useHeaderHeight()
  const { token, place_identifier } = route.params
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [place, setPlace] = useState(undefined)

  async function getPlace() {
    setLoading(true)

    const request = await fetch(`${localhost}/places/${place_identifier}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.place) {
      setPlace(request.place)
      console.log(request.place.place_areas)
    } else {
      setPlace(request)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: 'Datos del bosque urbano'
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      getPlace()
      return () => {}
    }, [])
  )

  const Places = () => {
    return (
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Bosque urbano</Text>
        <VStack spacing={10}>
          <Text variant="labelSmall">Domicilio</Text>
          <Text variant="bodyMedium">{`${place?.street} #${place?.exterior_number}\n${place?.colony}, ${place?.municipality}, ${place?.postal_code}`}</Text>

          <Flex>
            <Text variant="labelSmall">Referencia</Text>
            <Text variant="bodyMedium">{place?.reference ? place?.reference : 'Sin referencia'}</Text>
          </Flex>

          <Flex>
            <Text variant="labelSmall">Número de teléfono</Text>
            <Text variant="bodyMedium">{place?.phone}</Text>
          </Flex>
        </VStack>
      </VStack>
    )
  }

  const Areas = () => {
    return (
      <VStack p={20} spacing={5}>
        <Text variant="bodyLarge">Áreas</Text>
        <VStack spacing={10}>
          {place.place_areas.length > 0 ? (
            place.place_areas.map((area) => (
              <Card mode="outlined" key={area.area_name}>
                <VStack spacing={10} p={20}>
                  <VStack fill spacing={10}>
                    <Flex>
                      <Text variant="labelSmall">Nombre del área</Text>
                      <Text variant="bodyMedium">{area?.area_name}</Text>
                    </Flex>
                    <Flex>
                      <Text variant="labelSmall">Teléfono de contacto</Text>
                      <Text variant="bodyMedium">{area?.phone}</Text>
                    </Flex>
                  </VStack>
                  <Button
                    icon="pencil-outline"
                    onPrpess={() => {
                      navigation.navigate('EditArea', {
                        token,
                        area,
                        place_identifier
                      })
                    }}
                  >
                    Editar área
                  </Button>
                </VStack>
              </Card>
            ))
          ) : (
            <VStack center spacing={20} p={30}>
              <Icon name="pencil-plus-outline" color={theme.colors.onBackground} size={50} />
              <VStack center>
                <Text variant="headlineSmall">Sin áreas</Text>
                <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                  No hay ningún área registrada, ¿qué te parece si hacemos el primero?
                </Text>
              </VStack>
            </VStack>
          )}
        </VStack>
        <Button
          icon="plus"
          onPress={() => {
            navigation.navigate('AddArea', {
              token,
              place,
              place_identifier
            })
          }}
        >
          Agregar área
        </Button>
      </VStack>
    )
  }

  return (
    <Flex fill pt={headerMargin - 20}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={(_) => getPlace()} />}>
        {place !== undefined ? (
          place !== null ? (
            isNaN(place) ? (
              <DisplayDetails icon="pine-tree" title={place?.place_name} children={[Places(), Areas()]} />
            ) : (
              <VStack p={30} center spacing={20}>
                <Icon color={theme.colors.onBackground} name="alert-circle-outline" size={50} />
                <VStack center>
                  <Text variant="headlineSmall">Ocurrió un problema</Text>
                  <Text variant="bodyMedium" style={{ textAlign: 'center' }}>
                    No podemos recuperar del bosque urbano, inténtalo de nuevo más tarde (Error: {place})
                  </Text>
                </VStack>
                <Flex>
                  <Button
                    mode="outlined"
                    onPress={(_) => {
                      getPlace()
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
                  No podemos recuperar los datos del bosque urbano, revisa tu conexión a internet e inténtalo de nuevo
                </Text>
              </VStack>
              <Flex>
                <Button
                  mode="outlined"
                  onPress={() => {
                    getPlace()
                  }}
                >
                  Volver a intentar
                </Button>
              </Flex>
            </VStack>
          )
        ) : null}
      </ScrollView>

      {!(place === undefined || place === null) ? (
        <FAB
          icon="pencil-outline"
          style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
          onPress={() => {
            navigation.navigate('EditPlace', {
              token,
              place
            })
          }}
        />
      ) : null}
    </Flex>
  )
}
