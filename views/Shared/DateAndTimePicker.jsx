import { useCallback, useEffect, useState } from "react"
import { Button, Dialog, Portal, Text, TextInput, useTheme } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Pressable } from "react-native"
import { Flex, HStack } from "@react-native-material/core"
import { useFocusEffect } from "@react-navigation/native"

import { DatePickerModalContent, DatePickerInput, TimePicker, Calendar, TimePickerModal } from "react-native-paper-dates"
import { es, registerTranslation } from "react-native-paper-dates"
import { LongDate, ShortDate, Time24 } from "./LocaleDate"
registerTranslation("es", es)

const ClockPicker = ({ handler, date, setDate }) => {
  const [minutes, setMinutes] = useState(Number(date.getMinutes()))
  const [hours, setHours] = useState(Number(date.getHours()))
  const [focused, setFocused] = useState("hours")

  function saveTime() {
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    date.setMilliseconds(0)

    setDate(new Date(date))
    handler[1]()
  }

  useFocusEffect(
    useCallback(() => {
      if (handler ? handler[0] : false) {
        Keyboard.dismiss()
      }

      return () => {}
    }, [handler])
  )

  return (
    <Portal>
      <Dialog
        visible={handler ? handler[0] : false}
        onDismiss={() => (handler ? handler[1]() : null)}
      >
        <Dialog.Content>
          <TimePicker
            locale="es"
            inputType="picker"
            use24HourClock={true}
            inputFontSize={20}
            focused={focused}
            hours={hours}
            minutes={minutes}
            onChange={(data) => {
              setHours(data.hours)
              setMinutes(data.minutes)
              data.focused === "minutes" && setFocused(data.focused)
            }}
            onFocusInput={(data) => setFocused(`${data}`)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <HStack
            justify="between"
            fill
          >
            <Button
              mode="outlined"
              icon="close"
              onPress={() => handler[1]()}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              icon="check"
              onPress={() => saveTime()}
            >
              Aceptar
            </Button>
          </HStack>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const CalendarPicker = ({ handler, date, setDate }) => {
  const local = new Date(date)

  const [day, setDay] = useState(date.getDate())
  const [month, setMonth] = useState(date.getMonth())
  const [year, setYear] = useState(date.getFullYear())
  const [selectedDate, setSelectedDate] = useState(date)

  function cancel() {
    handler[1]()
    setSelectedDate(date)
  }

  function saveDate() {
    handler[1]()
    setDate(selectedDate)
  }

  useEffect(() => {
    local.setDate(day)
    local.setMonth(month)
    local.setFullYear(year)

    setSelectedDate(new Date(local))
  }, [day, month, year])

  useFocusEffect(
    useCallback(() => {
      if (handler ? handler[0] : false) {
        Keyboard.dismiss()
      }

      return () => {}
    }, [handler])
  )

  return (
    <Portal>
      <Dialog
        visible={handler ? handler[0] : false}
        onDismiss={() => (handler ? cancel() : null)}
      >
        <Dialog.Content>
          <Flex
            w={"100%"}
            h={475}
          >
            <Text
              variant="headlineSmall"
              numberOfLines={1}
              style={{ textAlign: "center" }}
            >
              {ShortDate(selectedDate)}
            </Text>
            <Calendar
              onChange={({ date }) => {
                setDay(date.getDate())
                setMonth(date.getMonth())
                setYear(date.getUTCFullYear())
              }}
              locale="es"
              mode="single"
              date={selectedDate}
              uppercase={false}
              startYear={2020}
              endYear={date.getFullYear() + 5}
            />
          </Flex>
        </Dialog.Content>
        <Dialog.Actions>
          <HStack
            justify="between"
            fill
          >
            <Button
              mode="outlined"
              icon="close"
              onPress={() => cancel()}
            >
              Cancelar
            </Button>
            <Button
              mode="contained"
              icon="check"
              onPress={() => saveDate()}
            >
              Aceptar
            </Button>
          </HStack>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

export { CalendarPicker, ClockPicker }
export default DateAndTimePicker = ({ title, date, setDate, hideTime }) => {
  const [showCalendarPicker, setShowCalendarPicker] = useState(false)
  const [showClockPicker, setShowClockPicker] = useState(false)

  return (
    <Flex>
      <Text variant="labelMedium">{title ?? "Selecciona una fecha y hora"}</Text>
      <HStack spacing={10}>
        <Flex fill>
          <Pressable onPress={() => setShowCalendarPicker(true)}>
            <TextInput
              mode="outlined"
              editable={false}
              value={typeof date == "object" ? ShortDate(date) : "Selecciona una fecha"}
              right={
                <TextInput.Icon
                  disabled={true}
                  icon="menu-down"
                />
              }
            />
          </Pressable>
        </Flex>

        {hideTime != true && (
          <Flex w={125}>
            <Pressable onPress={() => setShowClockPicker(true)}>
              <TextInput
                mode="outlined"
                editable={false}
                value={typeof date == "object" ? Time24(date) : "Selecciona una hora"}
                right={
                  <TextInput.Icon
                    disabled={true}
                    icon="menu-down"
                  />
                }
              />
            </Pressable>
          </Flex>
        )}
      </HStack>

      <CalendarPicker
        date={typeof date == "object" ? date : new Date()}
        setDate={(data) => setDate(data)}
        handler={[showCalendarPicker, () => setShowCalendarPicker(!showCalendarPicker)]}
      />
      <ClockPicker
        date={typeof date == "object" ? date : new Date()}
        setDate={(data) => setDate(data)}
        handler={[showClockPicker, () => setShowClockPicker(!showClockPicker)]}
      />
    </Flex>
  )
}
