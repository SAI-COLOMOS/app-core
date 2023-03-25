import { Flex, HStack, VStack } from "@react-native-material/core"
import { useEffect, useState } from "react"
import { Pressable } from "react-native"
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper"
import Dropdown from "./Dropdown"
import { FormatMonth, LongDate } from "./LocaleDate"

export const DatePicker = ({ actualDate, setDate, title, withDay, withMonth }) => {
  const [selectedYear, setSelectedYear] = useState(typeof actualDate == "object" ? actualDate.getFullYear() : new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(typeof actualDate == "object" ? { value: actualDate.getMonth(), option: FormatMonth(actualDate.getMonth()) } : { value: new Date().getMonth(), option: FormatMonth(new Date().getMonth()) })
  const [selectedDay, setSelectedDay] = useState(typeof actualDate == "object" ? actualDate.getDate() : new Date().getDate())

  const [show, setShow] = useState(false)

  const years = () => {
    let count = []
    const actualYear = Number(new Date().getFullYear())

    for (let i = 2022; i <= actualYear + 5; i++) {
      count.push({
        option: Number(i)
      })
    }

    return count
  }
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
    setSelectedYear(typeof actualDate == "object" ? Number(actualDate.getFullYear()) : Number(new Date().getFullYear()))
    setSelectedMonth(typeof actualDate == "object" ? { value: actualDate.getMonth(), option: FormatMonth(actualDate.getMonth()) } : { value: new Date().getMonth(), option: FormatMonth(new Date().getMonth()) })
    setSelectedDay(typeof actualDate == "object" ? Number(actualDate.getDate()) : Number(new Date().getDate()))
  }

  function save() {
    const selectedDate = new Date(selectedYear, withMonth == true ? selectedMonth?.value : 0, withDay == true ? selectedDay : 1)
    setDate(selectedDate)
    setShow(false)
  }

  useEffect(() => {
    console.log(typeof actualDate == true)
  }, [])

  return (
    <Flex>
      <Pressable onPress={() => setShow(true)} style={{ zIndex: 10 }}>
        <TextInput mode="outlined" label={title ?? "Fecha"} value={typeof actualDate == "object" ? LongDate(actualDate) : ""} editable={false} style={{ zIndex: -5 }} right={<TextInput.Icon disabled={true} icon="menu-down" />} />
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
  const time = new Date().getHours
  const [selectedHours, setSelectedHours] = useState(typeof actualTime == "object" ? actualTime.getHours() : new Date().getHours())
  const [selectedMinutes, setSelectedMinutes] = useState(typeof actualTime == "object" ? actualTime.getMinutes() : new Date().getMinutes())

  const hours = () => {
    let count = []
    for (let i = 0; i <= 23; i++) {
      count.push({
        option: i <= 9 ? `0${i}` : i.toString(),
        value: i
      })
    }
    return count
  }

  const minutes = () => {
    let count = []
    for (let i = 0; i <= 59; i++) {
      count.push({
        option: i <= 9 ? `0${i}` : i.toString(),
        value: i
      })
    }
    return count
  }

  const [show, setShow] = useState(false)

  function cancel() {
    setShow(false)
    setSelectedHours(typeof actualTime == "object" ? actualTime.getHours() : new Date().getHours())
    setSelectedMinutes(typeof actualTime == "object" ? actualTime.getMinutes() : new Date().getMinutes())
  }

  function save() {
    const selectedTime = new Date().setHours(selectedHours.value, selectedMinutes.value)
    console.log(selectedTime)
    setTime(selectedTime)
    setShow(false)
  }

  return (
    <Flex>
      <Pressable onPress={() => setShow(true)} style={{ zIndex: 10 }}>
        <TextInput mode="outlined" label={title ?? "Hora"} value={typeof actualTime == "object" ? actualTime.toString() : ""} editable={false} style={{ zIndex: -5 }} right={<TextInput.Icon disabled={true} icon="menu-down" />} />
      </Pressable>

      <Portal>
        <Dialog visible={show} onDismiss={() => cancel()}>
          <Dialog.Icon icon="clock-outline" />
          <Dialog.Title style={{ textAlign: "center" }}>Selecciona una hora</Dialog.Title>
          <Dialog.Content>
            <HStack spacing={10}>
              <Flex fill>
                <Dropdown title="Horas" options={hours()} value={selectedHours.option} selected={setSelectedHours} />
              </Flex>
              <Flex fill>
                <Dropdown title="Minutos" options={minutes()} value={selectedMinutes.option} selected={setSelectedMinutes} />
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
