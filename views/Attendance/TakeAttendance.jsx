import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useContext, useEffect, useState } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Button, Card, FAB, IconButton, Text, TouchableRipple, useTheme } from "react-native-paper"
import Constants from "expo-constants"
// import { DateAndTimerPicker, DatePicker, TimePicker } from "../Shared/TimeAndDatePicker"
// import DateTimePicker from "@react-native-community/datetimepicker"
// import { DatePickerModal, DatePickerModalContent } from "react-native-paper-dates"
import ApplicationContext from "../ApplicationContext"
// import DatePicker from "../Shared/DatePicker"

import { LongDate } from "../Shared/LocaleDate"
import { FlatList } from "react-native"
import InformationMessage from "../Shared/InformationMessage"
import ProfileImage from "../Shared/ProfileImage"

export default TakeAttendance = ({ navigation, route }) => {
  const theme = useTheme()
  const headerMargin = useHeaderHeight()
  const localhost = Constants.expoConfig.extra.API_LOCAL
  const { event_identifier } = route.params
  const { user, token } = useContext(ApplicationContext)

  const [showPicker, setShowPicker] = useState(false)
  const [date, setDate] = useState(new Date())

  const [loading, setLoading] = useState(false)
  const [attendeeList, setAttendeeList] = useState(undefined)
  const [requestError, setRequestError] = useState(0)

  async function getAttendance() {
    try {
      setLoading(true)

      const request = await fetch(`${localhost}/agenda/${event_identifier}/attendance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache"
        }
      })

      setLoading(false)

      if (request.ok == true) {
        const response = await request.json()
        setAttendeeList(response?.attendees)
        console.log(response)
        return
      } else {
        setAttendeeList(null)
        setRequestError(request.status)
        return
      }
    } catch (error) {
      console.error("Take attendance:", error)
      setLoading(false)
      setAttendeeList(null)
      return
    }
  }

  useEffect(() => {
    getAttendance()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Tomar asistencia"
    })
  }, [])

  const Attendee = useCallback(({ attendance, register }) => {
    const [attendee, setAttendee] = useState(undefined)

    const requestAttendee = async () => {
      const request = await fetch(`${localhost}/users/${register}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .catch(() => null)

      request?.user ? setAttendee(request.user) : setAttendee(null)
    }

    useEffect(() => {
      requestAttendee()
    }, [])

    return (
      <Flex
        ph={20}
        pv={5}
      >
        <Card
          mode="outlined"
          style={{ overflow: "hidden" }}
        >
          {attendee !== null ? (
            <HStack items="center">
              <ProfileImage image={attendee?.avatar} />
              <Flex
                fill
                p={10}
              >
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                >
                  {attendee?.first_name} {attendee?.first_last_name} {attendee?.second_last_name ?? null}
                </Text>
                <Text variant="bodySmall">{attendee?.register}</Text>
                <Text variant="bodySmall">
                  {attendee?.role} {attendee?.role == "Prestador" && attendee?.provider_type}
                </Text>
                {/* <Button mode="text">Editar asistencia</Button> */}
              </Flex>
              <Flex pr={10}>
                <IconButton
                  mode="outlined"
                  icon="pencil-outline"
                  onPress={() => navigation.navigate("EditAttendance", { attendance, event_identifier })}
                />
              </Flex>
            </HStack>
          ) : (
            <HStack
              fill
              spacing={10}
              ph={20}
            >
              <Text variant="bodyMedium">Ocurrió un problema recuperando la información de este usuario</Text>
              <IconButton
                icon="reload"
                mode="outlined"
                onPress={() => requestAttendee()}
              />
            </HStack>
          )}
        </Card>
      </Flex>
    )
  }, [])

  return (
    <Flex
      fill
      mt={headerMargin}
    >
      {attendeeList !== null ? (
        attendeeList?.length >= 0 || attendeeList === undefined ? (
          <Flex fill>
            <FlatList
              data={attendeeList}
              ListEmptyComponent={() =>
                attendeeList === undefined ? null : (
                  <InformationMessage
                    icon="pencil-plus-outline"
                    title="Sin usuarios"
                    description="No hay ningún usuario registrado, ¿qué te parece si hacemos el primero?"
                    buttonIcon="plus"
                    buttonTitle="Agregar"
                    action={() => null}
                  />
                )
              }
              refreshing={loading}
              onRefresh={() => getAttendance()}
              renderItem={({ item }) => (
                <Attendee
                  key={item.attendee_register}
                  register={item.attendee_register}
                  attendance={item}
                />
              )}
            />
          </Flex>
        ) : (
          <InformationMessage
            icon="bug-outline"
            title="¡Ups! Error nuestro"
            description="Algo falló de nuestra parte. Inténtalo nuevamente más tarde, si el problema persiste, comunícate con tu encargado"
            buttonTitle="Volver a cargar"
            buttonIcon="reload"
            action={() => {
              setAttendeeList(undefined)
              getAttendance()
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
            setAttendeeList(undefined)
            getAttendance()
          }}
        />
      )}
      <FAB
        icon="qrcode-scan"
        style={{ position: "absolute", margin: 16, right: 0, bottom: 0 }}
        onPress={() => navigation.navigate("ScanAttendance")}
      />
    </Flex>
  )
}
