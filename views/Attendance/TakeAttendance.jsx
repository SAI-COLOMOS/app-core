import { Flex } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Button, Text } from "react-native-paper"
import { DatePicker, TimePicker } from "../Shared/TimeAndDatePicker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { DatePickerModal } from "react-native-paper-dates"
import { es, registerTranslation } from "react-native-paper-dates"
registerTranslation("es", es)
import { LongDate } from "../Shared/LocaleDate"

export default TakeAttendance = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()

  const [date, setDate] = useState(new Date())

  // const [date, setDate] = useState(undefined)
  // const [open, setOpen] = useState(false)

  // const onDismissSingle = useCallback(() => {
  //   setOpen(false)
  // }, [setOpen])

  // const onConfirmSingle = useCallback(
  //   (params) => {
  //     setOpen(false)
  //     setDate(params.date)
  //     console.log(params)
  //   },
  //   [setOpen, setDate]
  // )

  // useEffect(() => {
  //   const dd = new Date(dateSelected?.nativeEvent.timestamp)
  //   console.log(dd.toTimeString())
  // }, [dateSelected])

  useEffect(() => {
    navigation.setOptions({
      header: (props) => <Header {...props} />,
      headerTransparent: true,
      headerTitle: "Tomar asistencia"
    })
  }, [])

  return (
    <Flex fill mt={headerMargin}>
      <Text>Hola</Text>
      <Button
        onPress={() => {
          navigation.navigate("ScanAttendance")
        }}
      >
        Scanner
      </Button>

      <Text>{LongDate("2011-10-05T14:48:00.000Z")}</Text>
      <Text>{LongDate(new Date())}</Text>

      <DatePicker actualDate={date} title="Selecciona una fecha" setDate={setDate} withMonth={true} withDay={true} />
      <TimePicker actualTime={date} title="Selecciona una hora" setTime={setDate} />

      {/* <DatePickerModal locale="es" mode="single" visible={open} onDismiss={onDismissSingle} date={date} onConfirm={onConfirmSingle} /> */}

      {/* <DateTimePicker value={new Date()} mode="time" onChange={setDateSelected} /> */}
    </Flex>
  )
}
