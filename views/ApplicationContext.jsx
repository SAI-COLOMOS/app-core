import { createContext, useMemo, useState } from "react"
import Constants from "expo-constants"

const ApplicationContext = createContext()

const ApplicationProvider = ({ children }) => {
  const [register, setRegister] = useState(null)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [achieved_hours, setAchieved_hours] = useState(0)

  const host = useMemo(() => {
    switch (Constants.expoConfig.extra.environment) {
      case "production":
        return Constants.expoConfig.extra.api_production

      case "development":
        return Constants.expoConfig.extra.api_development

      default:
        return Constants.expoConfig.extra.api_development
    }
  }, [])

  const params = {
    host,
    register,
    setRegister,
    user,
    setUser,
    token,
    setToken,
    achieved_hours,
    setAchieved_hours
  }

  return <ApplicationContext.Provider value={params}>{children}</ApplicationContext.Provider>
}

export { ApplicationProvider }
export default ApplicationContext
