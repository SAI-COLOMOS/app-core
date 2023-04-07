import { createContext, useCallback, useContext, useState } from "react"
import ApplicationContext from "../ApplicationContext"

const CacheContext = createContext()
const images = []

const CacheProvider = ({ children }) => {
  const [event, setEvent] = useState(undefined)
  const [attendees, setAttendees] = useState(undefined)
  const [profiles, setProfiles] = useState(undefined)
  const [users, setUsers] = useState(undefined)

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
    event,
    setEvent,
    attendees,
    setAttendees,
    profiles,
    setProfiles,
    getImage
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
