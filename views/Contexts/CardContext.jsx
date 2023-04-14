import { createContext, useState } from "react"

const CardContext = createContext()

const CardProvider = ({ children }) => {
  const [activities, setActivities] = useState(undefined)

  const params = {
    activities,
    setActivities
  }

  return <CardContext.Provider value={params}>{children}</CardContext.Provider>
}

export { CardProvider }
export default CardContext
