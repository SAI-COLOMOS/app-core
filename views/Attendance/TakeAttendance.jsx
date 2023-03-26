import { Flex } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { useHeaderHeight } from "@react-navigation/elements"
import { Button, Text } from "react-native-paper"
import { DateAndTimerPicker, DatePicker, TimePicker } from "../Shared/TimeAndDatePicker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { DatePickerModal } from "react-native-paper-dates"
import { es, registerTranslation } from "react-native-paper-dates"
registerTranslation("es", es)
import { LongDate } from "../Shared/LocaleDate"

export default TakeAttendance = ({ navigation, route }) => {
  const headerMargin = useHeaderHeight()

  const [date, setDate] = useState(new Date())

  useEffect(() => {
    console.log("Date date date", date)
  }, [date])

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
      <Text>{LongDate(date)}</Text>

      <DateAndTimerPicker actualDate={date} selectedDate={setDate} />
    </Flex>
  )
}
