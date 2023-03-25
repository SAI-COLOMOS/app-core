import { Flex } from "@react-native-material/core"
import { Text } from "react-native-paper"

export const LongDate = (date) => {
  console.log("Tipo de date", typeof date)
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

  // const date = new Date("2011-10-05T14:48:00.000Z")
  console.log(originalDate)

  return `${weekDay()} ${day()} de ${month()}, ${year()}`
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