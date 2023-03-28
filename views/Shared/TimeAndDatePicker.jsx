import { Flex, HStack, VStack } from "@react-native-material/core"
import { useCallback, useEffect, useState } from "react"
import { Pressable } from "react-native"
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper"
import Dropdown from "./Dropdown"
import { CompactDate, FormatMonth, LongDate, Time24 } from "./LocaleDate"

export const DatePicker = ({ actualDate, setDate, title, withDay, withMonth }) => {
  const generatedDate = new Date()
  const [selectedYear, setSelectedYear] = useState(typeof actualDate == "object" ? actualDate.getFullYear() : generatedDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(typeof actualDate == "object" ? { value: actualDate.getMonth(), option: FormatMonth(actualDate.getMonth()) } : { value: generatedDate.getMonth(), option: FormatMonth(generatedDate.getMonth()) })
  const [selectedDay, setSelectedDay] = useState(typeof actualDate == "object" ? actualDate.getDate() : generatedDate.getDate())

  const [show, setShow] = useState(false)

  const years = useCallback(() => {
    let count = []
    const actualYear = Number(generatedDate.getFullYear())

    for (let i = 2022; i <= actualYear + 5; i++) {
      count.push({
        option: Number(i)
      })
    }

    return count
  }, [])
  const months = [
    { option: "Enero", value: "0" },
    { option: "Febrero", value: 1 },
    { option: "Marzo", value: 2 },
    { option: "Abril", value: 3 },
    { option: "Mayo", value: 4 },
    { option: "Junio", value: 5 },
    { option: "Julio", value: 6 },
    { option: "Agosto", value: 7 },
    { option: "Septiembre", value: 8 },
    { option: "Octubre", value: 9 },
    { option: "Noviembre", value: 10 },
    { option: "Diciembre", value: 11 }
  ]
  const days = () => {
    let count = []
    if (selectedMonth == 1 || selectedMonth == 3 || selectedMonth == 5 || selectedMonth == 7 || selectedMonth == 8 || selectedMonth == 10 || selectedMonth || 12) {
      if (selectedMonth == 2) {
        if (selectedYear % 4 == 0) {
          for (let i = 1; i <= 29; i++) {
            count.push({ option: Number(i) })
          }
        } else {
          for (let i = 1; i <= 28; i++) {
            count.push({ option: Number(i) })
          }
        }
      } else {
        for (let i = 1; i <= 31; i++) {
          count.push({ option: Number(i) })
        }
      }
    } else {
      for (let i = 1; i <= 30; i++) {
        count.push({ option: Number(i) })
      }
    }

    return count
  }

  function cancel() {
    setShow(false)
    setSelectedYear(typeof actualDate == "object" ? Number(actualDate.getFullYear()) : Number(generatedDate.getFullYear()))
    setSelectedMonth(typeof actualDate == "object" ? { value: actualDate.getMonth(), option: FormatMonth(actualDate.getMonth()) } : { value: generatedDate.getMonth(), option: FormatMonth(generatedDate.getMonth()) })
    setSelectedDay(typeof actualDate == "object" ? Number(actualDate.getDate()) : Number(generatedDate.getDate()))
  }

  useEffect(() => {
    console.log(setDate)
  }, [])

  function save() {
    actualDate.setDate(withDay == true ? selectedDay : 1)
    actualDate.setMonth(withMonth == true ? selectedMonth?.value : 0)
    actualDate.setFullYear(selectedYear)

    console.log("Actual date", actualDate)

    setDate(new Date(actualDate))

    setShow(false)
  }

  return (
    <Flex>
      <Pressable onPress={() => setShow(true)} style={{ zIndex: 10 }}>
        <TextInput mode="outlined" label={title ?? null} value={typeof actualDate == "object" ? CompactDate(actualDate) : ""} editable={false} style={{ zIndex: -5 }} right={<TextInput.Icon disabled={true} icon="menu-down" />} />
      </Pressable>

      <Portal>
        <Dialog visible={show} onDismiss={() => cancel()}>
          <Dialog.Icon icon="calendar" />
          <Dialog.Title style={{ textAlign: "center" }}>Selecciona una fecha</Dialog.Title>
          <Dialog.Content>
            <VStack spacing={10}>
              {withDay == true ? (
                <Flex>
                  <Dropdown title="Día" options={days()} value={selectedDay.toString()} selected={setSelectedDay} />
                </Flex>
              ) : null}

              {withMonth == true ? (
                <Flex>
                  <Dropdown title="Mes" options={months} value={selectedMonth.option} selected={setSelectedMonth} />
                </Flex>
              ) : null}

              <Flex>
                <Dropdown title="Año" options={years()} value={selectedYear.toString()} selected={setSelectedYear} />
              </Flex>
            </VStack>
          </Dialog.Content>
          <Dialog.Actions>
            <HStack fill justify="between" reverse={true}>
              <Button
                mode="contained"
                icon="check"
                onPress={() => {
                  save()
                }}
              >
                Aceptar
              </Button>

              <Button
                mode="outlined"
                icon="close"
                onPress={() => {
                  cancel()
                }}
              >
                Cerrar
              </Button>
            </HStack>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Flex>
  )
}

export const TimePicker = ({ actualTime, setTime, title }) => {
  const generatedDate = new Date()
  const [selectedHours, setSelectedHours] = useState(typeof actualTime == "object" ? (actualTime.getHours() <= 9 ? `0${actualTime.getHours()}` : actualTime.getHours().toString()) : generatedDate.getHours() <= 9 ? `0${generatedDate.getHours()}` : generatedDate.getHours().toString())
  const [selectedMinutes, setSelectedMinutes] = useState(typeof actualTime == "object" ? (actualTime.getMinutes() <= 9 ? `0${actualTime.getMinutes()}` : actualTime.getMinutes().toString()) : generatedDate.getMinutes() <= 9 ? `0${generatedDate.getMinutes()}` : generatedDate.getMinutes().toString())

  const hours = useCallback(() => {
    let count = []
    for (let i = 0; i <= 23; i++) {
      count.push({
        option: i <= 9 ? `0${i}` : i.toString()
      })
    }
    return count
  }, [])

  const minutes = useCallback(() => {
    let count = []
    for (let i = 0; i <= 59; i++) {
      count.push({
        option: i <= 9 ? `0${i}` : i.toString()
      })
    }
    return count
  }, [])

  const [show, setShow] = useState(false)

  function cancel() {
    setShow(false)
    setSelectedHours(typeof actualTime == "object" ? (actualTime.getHours() <= 9 ? `0${actualTime.getHours()}` : actualTime.getHours().toString()) : generatedDate.getHours() <= 9 ? `0${generatedDate.getHours()}` : generatedDate.getHours().toString())
    setSelectedMinutes(typeof actualTime == "object" ? (actualTime.getMinutes() <= 9 ? `0${actualTime.getMinutes()}` : actualTime.getMinutes().toString()) : generatedDate.getMinutes() <= 9 ? `0${generatedDate.getMinutes()}` : generatedDate.getMinutes().toString())
  }

  function save() {
    actualTime.setHours(Number(selectedHours))
    actualTime.setMinutes(Number(selectedMinutes))
    setTime(new Date(actualTime))
    setShow(false)
  }

  return (
    <Flex>
      <Pressable onPress={() => setShow(true)} style={{ zIndex: 10 }}>
        <TextInput mode="outlined" label={title ?? null} value={typeof actualTime == "object" ? Time24(actualTime) : ""} editable={false} style={{ zIndex: -5 }} right={<TextInput.Icon disabled={true} icon="menu-down" />} />
      </Pressable>

      <Portal>
        <Dialog visible={show} onDismiss={() => cancel()}>
          <Dialog.Icon icon="clock-outline" />
          <Dialog.Title style={{ textAlign: "center" }}>Selecciona una hora</Dialog.Title>
          <Dialog.Content>
            <HStack spacing={10}>
              <Flex fill>
                <Dropdown title="Horas" options={hours()} value={selectedHours} selected={setSelectedHours} />
              </Flex>
              <Flex fill>
                <Dropdown title="Minutos" options={minutes()} value={selectedMinutes} selected={setSelectedMinutes} />
              </Flex>
            </HStack>
          </Dialog.Content>
          <Dialog.Actions>
            <HStack fill justify="between" reverse={true}>
              <Button
                mode="contained"
                icon="check"
                onPress={() => {
                  save()
                }}
              >
                Aceptar
              </Button>

              <Button
                mode="outlined"
                icon="close"
                onPress={() => {
                  cancel()
                }}
              >
                Cerrar
              </Button>
            </HStack>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </Flex>
  )
}

export const DateAndTimerPicker = ({ actualDate, selectedDate, dateTile, timeTitle }) => {
  return (
    <HStack spacing={20}>
      <Flex fill>
        <DatePicker actualDate={actualDate} setDate={selectedDate} title={dateTile} withMonth={true} withDay={true} />
      </Flex>
      <Flex w={125}>
        <TimePicker actualTime={actualDate} setTime={selectedDate} title={timeTitle} />
      </Flex>
    </HStack>
  )
}
