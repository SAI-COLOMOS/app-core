import { createContext, useCallback, useContext, useState } from "react"
import ApplicationContext from "../ApplicationContext"

const CacheContext = createContext()
const images = []

const CacheProvider = ({ children }) => {
  const [users, setUsers] = useState(undefined)
  const [places, setPlaces] = useState(undefined)
  const [schools, setSchools] = useState(undefined)
  const [events, setEvents] = useState(undefined)
  const [activities, setActivities] = useState(undefined)

  const [attendees, setAttendees] = useState(undefined)
  const [profiles, setProfiles] = useState(undefined)

  const getImage = useCallback((id, url, reload) => {
    async function get() {
      const { token } = useContext(ApplicationContext)

      if (reload != true) {
        const image = images.find((item) => item?.id == id)

        if (image != undefined) {
          console.log("true", id)
          return image.image
        }
      }

      console.log("false", id)

      const request = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache"
        }
      })
        .then(async (response) => (response.ok ? await response.json() : null))
        .catch(() => null)

      if (request?.avatar) {
        images.push({ id: id, image: request.avatar })
        // console.log(id, request.avatar)
        return request.avatar
      }

      return null
    }

    get()
  }, [])

  const props = {
    users,
    setUsers,
    places,
    setPlaces,
    schools,
    setSchools,
    events,
    setEvents,
    activities,
    setActivities,
    attendees,
    setAttendees,
    profiles,
    setProfiles
  }

  return (
    <CacheContext.Provider
      key="CacheProvider"
      value={props}
    >
      {children}
    </CacheContext.Provider>
  )
}

export { CacheProvider }
export default CacheContext
