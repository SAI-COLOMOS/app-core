import { Flex } from "@react-native-material/core"
import { Text } from "react-native-paper"

export const LongDate = (date) => {
  //const originalDate = typeof date == "object" ? date : new Date(date)
  const originalDate = { object: date, string: new Date(date) }[typeof date]

  /* Día de la semana */
  const weekDay = () => {
    switch (Number(originalDate.getDay())) {
      case 0:
        return "Domingo"

      case 1:
        return "Lunes"

      case 2:
        return "Martes"

      case 3:
        return "Miércoles"

      case 4:
        return "Jueves"

      case 5:
        return "Viernes"

      case 6:
        return "Sábado"

      default:
        return "DdlS"
    }
  }

  const day = () => {
    const day = originalDate.getDate()

    if (day <= 9) {
      return `0${day}`
    } else {
      return `${day}`
    }
  }

  const month = () => {
    switch (originalDate.getMonth()) {
      case 0:
        return "enero"

      case 1:
        return "febrero"

      case 2:
        return "marzo"

      case 3:
        return "abril"

      case 4:
        return "mayo"

      case 5:
        return "junio"

      case 6:
        return "julio"

      case 7:
        return "agosto"

      case 8:
        return "septiembre"

      case 9:
        return "octubre"

      case 10:
        return "noviembre"

      case 11:
        return "diciembre"

      default:
        return "mes"
    }
  }

  const year = () => originalDate.getFullYear()

  return `${weekDay()} ${day()} de ${month()}, ${year()}`
}

export const ShortDate = (date) => {
  //const originalDate = typeof date == "object" ? date : new Date(date)
  const originalDate = { object: date, string: new Date(date) }[typeof date]

  /* Día de la semana */
  const weekDay = () => {
    switch (Number(originalDate.getDay())) {
      case 0:
        return "Dom"

      case 1:
        return "Lun"

      case 2:
        return "Mar"

      case 3:
        return "Mié"

      case 4:
        return "Jue"

      case 5:
        return "Vie"

      case 6:
        return "Sáb"

      default:
        return "DdlS"
    }
  }

  const day = () => originalDate.getDate().toString()

  const month = () => {
    switch (originalDate.getMonth()) {
      case 0:
        return "ene"

      case 1:
        return "feb"

      case 2:
        return "mar"

      case 3:
        return "abr"

      case 4:
        return "may"

      case 5:
        return "jun"

      case 6:
        return "jul"

      case 7:
        return "ago"

      case 8:
        return "sep"

      case 9:
        return "oct"

      case 10:
        return "nov"

      case 11:
        return "dic"

      default:
        return "mes"
    }
  }

  const year = () => originalDate.getFullYear()

  return `${weekDay()}. ${day()} de ${month()}`
}

export const CompactDate = (date) => {
  const originalDate = { object: date, string: new Date(date) }[typeof date]

  const day = () => {
    const day = originalDate.getDate()

    if (day <= 9) {
      return `0${day}`
    } else {
      return `${day}`
    }
  }

  const month = () => {
    switch (originalDate.getMonth()) {
      case 0:
        return "ene"

      case 1:
        return "feb"

      case 2:
        return "mar"

      case 3:
        return "abr"

      case 4:
        return "may"

      case 5:
        return "jun"

      case 6:
        return "jul"

      case 7:
        return "ago"

      case 8:
        return "sep"

      case 9:
        return "oct"

      case 10:
        return "nov"

      case 11:
        return "dic"

      default:
        return "mes"
    }
  }

  const year = () => originalDate.getFullYear()

  return `${day()}/${month()}/${year()}`
}

export const GetDay = (date) => {
  const day = { object: date, string: new Date(date) }[typeof date]

  return day.getDate()
}

export const GetCompactMonth = (date) => {
  const month = { object: date, string: new Date(date) }[typeof date]

  switch (month.getMonth()) {
    case 0:
      return "ene"

    case 1:
      return "feb"

    case 2:
      return "mar"

    case 3:
      return "abr"

    case 4:
      return "may"

    case 5:
      return "jun"

    case 6:
      return "jul"

    case 7:
      return "ago"

    case 8:
      return "sep"

    case 9:
      return "oct"

    case 10:
      return "nov"

    case 11:
      return "dic"

    default:
      return "mes"
  }
}

export const FormatMonth = (month) => {
  switch ({ number: month, string: Number(month) }[typeof month]) {
    case 0:
      return "Enero"

    case 1:
      return "Febrero"

    case 2:
      return "Marzo"

    case 3:
      return "Abril"

    case 4:
      return "Mayo"

    case 5:
      return "Junio"

    case 6:
      return "Julio"

    case 7:
      return "Agosto"

    case 8:
      return "Septiembre"

    case 9:
      return "Octubre"

    case 10:
      return "Noviembre"

    case 11:
      return "Diciembre"

    default:
      return "mes"
  }
}

export const Time24 = (time) => {
  const originalTime = { object: time, string: new Date(time) }[typeof time]

  const hours = () => (originalTime.getHours() <= 9 ? `0${originalTime.getHours()}` : originalTime.getHours().toString())
  const minutes = () => (originalTime.getMinutes() <= 9 ? `0${originalTime.getMinutes()}` : originalTime.getMinutes().toString())

  return `${hours()}:${minutes()}`
}
