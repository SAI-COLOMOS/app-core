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
        return "dom"

      case 1:
        return "lun"

      case 2:
        return "mar"

      case 3:
        return "mié"

      case 4:
        return "jue"

      case 5:
        return "vie"

      case 6:
        return "sáb"

      default:
        return "ddlS"
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

  return `${weekDay()}. ${day()} de ${month()}.`
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

export const GetMoment = (date) => {
  const originalDate = { object: date, string: new Date(date) }[typeof date]

  const actualDate = new Date()
  const subtraction = originalDate - actualDate
  const hours = Math.floor(subtraction / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 2) {
    return "Evento próximo"
  } else if (days === 2) {
    return "Evento para pasado mañana"
  } else if (days === 1) {
    return "Evento para mañana"
  } else if (hours >= 2) {
    return `Evento en ${hours} horas`
  } else if (hours === 1) {
    return "Evento en una hora"
  } else if (subtraction >= 0) {
    return "ahora"
  } else {
    const hoursFrom = Math.abs(hours)
    if (hoursFrom >= 24) {
      return `Evento iniciado hace ${Math.floor(hoursFrom / 24)} días`
    } else {
      return `Evento iniciado hace ${hoursFrom} horas`
    }
  }

  // if (days > 2) {
  //   return "Evento próximo"
  // } else if (days === 2) {
  //   return "Evento para pasado mañana"
  // } else if (days === 1) {
  //   return "Evento para mañana"
  // } else if (hours > 2) {
  //   return `Evento para hoy`
  // } else if (hours <= 2 && hours > 0) {
  //   return "Evento por comenzar"
  // } else if (subtraction >= 0) {
  //   return "Evento iniciado"
  // } else {
  //   return "Evento en curso"
  // }
}
