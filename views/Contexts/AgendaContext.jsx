import { createContext, useState } from "react"

const AgendaContext = createContext()

const AgendaProvider = ({ children }) => {
  const [events, setEvents] = useState(undefined)
  const getEvents = async () => {
    setLoading(true)

    const request = await fetch(`${localhost}/agenda`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => (response.ok ? response.json() : response.status))
      .catch(() => null)

    setLoading(false)

    if (request?.events) {
      setEvents(request.events)
    } else {
      setEvents(request)
    }
  }

  return <AgendaContext.Provider value={{ events, setEvents, getEvents }}>{children}</AgendaContext.Provider>
}

export { ContextProvider }
export default AgendaContext
