import { createContext, useState } from "react"

const ApplicationContext = createContext()

const ContextProvider = ({ children }) => {
  const [register, setRegister] = useState(null)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [achieved_hours, setAchieved_hours] = useState(0)

  return <ApplicationContext.Provider value={{ register, setRegister, user, setUser, token, setToken, achieved_hours, setAchieved_hours }}>{children}</ApplicationContext.Provider>
}

export { ContextProvider }
export default ApplicationContext
