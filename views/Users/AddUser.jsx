import { Flex, HStack, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { Button, Text, TextInput, useTheme } from "react-native-paper"
import CreateForm from "../Shared/CreateForm"
import Constants from "expo-constants"
import ModalMessage from "../Shared/ModalMessage"
import Dropdown from "../Shared/Dropdown"
import ImageSelector from "../Shared/ImageSelector"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import ApplicationContext from "../ApplicationContext"

export default AddUser = ({ navigation, route }) => {
  const theme = useTheme()
  const { token, user } = useContext(ApplicationContext)
  const { placesOptions, schoolsOptions } = route.params
  const localhost = Constants.expoConfig.extra.API_LOCAL

  const [first_name, setFirst_name] = useState("")
  const [first_last_name, setFirst_last_name] = useState("")
  const [second_last_name, setSecond_last_name] = useState("")
  const [avatar, setAvatar] = useState(null)
  const [age, setAge] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [emergency_contact, setEmergency_contact] = useState("")
  const [emergency_phone, setEmergency_phone] = useState("")
  const [blood_type, setBlood_type] = useState("")
  const [provider_type, setProvider_type] = useState("")
  const [place, setPlace] = useState("")
  const [assigned_area, setAssigned_area] = useState("")
  const [school, setSchool] = useState("")
  const [role, setRole] = useState("")
  const [total_hours, setTotal_hours] = useState("")
  const [curp, setCurp] = useState("")
  const [verified, setVerified] = useState()

  const providerTypes = [
    {
      option: "Servicio social"
    },
    {
      option: "Prácticas profesionales"
    }
  ]
  const roleTypes = [
    {
      option: "Administrador"
    },
    {
      option: "Encargado"
    },
    {
      option: "Prestador"
    }
  ]
  const bloodTypes = [
    {
      option: "O+"
    },
    {
      option: "O-"
    },
    {
      option: "A+"
    },
    {
      option: "A-"
    },
    {
      option: "B+"
    },
    {
      option: "B-"
    },
    {
      option: "AB+"
    },
    {
      option: "AB-"
    }
  ]
  const [areasOptions, setAreasOptions] = useState("")

  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

  async function SaveUser() {
    setModalLoading(true)
    const request = await fetch(`${localhost}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify({
        first_name: first_name.trim(),
        first_last_name: first_last_name.trim(),
        second_last_name: second_last_name.trim(),
        age: age.trim(),
        email: email.trim(),
        phone: phone.trim(),
        emergency_contact: emergency_contact.trim(),
        emergency_phone: emergency_phone.trim(),
        blood_type: blood_type,
        role: role,
        provider_type: provider_type.trim(),
        place: place.trim(),
        assigned_area: assigned_area.trim(),
        school: school.trim(),
        avatar: avatar,
        total_hours: Number(total_hours),
        curp: curp.trim()
      })
    })
      .then((response) => response.status)
      .catch((error) => console.error("Error: ", error))

    setModalLoading(false)

    if (request == 201) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  useEffect(() => {
    let check = true

    if (user?.role == "Encargado") {
      total_hours?.length > 0 ? null : (check = false)
    }

    if (user?.role == "Administrador") {
      if (role == "Encargado") {
        place?.length > 0 ? null : (check = false)
        assigned_area?.length > 0 ? null : (check = false)
      }

      if (role == "Prestador") {
        provider_type?.length > 0 ? null : (check = false)
        school?.length > 0 ? null : (check = false)
        total_hours?.length > 0 ? null : (check = false)
        place?.length > 0 ? null : (check = false)
        assigned_area?.length > 0 ? null : (check = false)
      }

      role?.length > 0 ? null : (check = false)
    }

    first_name?.length > 0 ? null : (check = false)
    first_last_name?.length > 0 ? null : (check = false)
    age?.length > 0 ? null : (check = false)
    blood_type?.length > 0 ? null : (check = false)
    email?.length > 0 ? null : (check = false)
    phone?.length == 10 ? null : (check = false)
    emergency_contact?.length > 0 ? null : (check = false)
    emergency_phone?.length == 10 ? null : (check = false)
    curp?.length >= 18 ? null : (check = false)

    if (check) {
      setVerified(true)
    } else {
      setVerified(false)
    }
  }, [first_name, first_last_name, age, blood_type, email, phone, emergency_contact, emergency_phone, provider_type, place, assigned_area, school, role, total_hours, curp])

  useEffect(() => {
    if (role != "Prestador") {
      setProvider_type("")
      setSchool("")
      setTotal_hours("")
    }
  }, [role])

  useEffect(() => {
    setAssigned_area("")
    const placeSelected = placesOptions?.find((item) => item.option == place)

    let areaData = []
    placeSelected?.areas.forEach((area) => {
      areaData.push({
        option: area.option
      })
    })

    setAreasOptions(areaData)
  }, [place])

  const PersonalData = () => (
    <VStack
      key="Personal"
      spacing={5}
    >
      <Text variant="labelLarge">Datos personales</Text>
      <VStack spacing={10}>
        <TextInput
          mode="outlined"
          value={first_name}
          onChangeText={setFirst_name}
          label="Nombre"
          maxLength={50}
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="words"
        />
        <TextInput
          mode="outlined"
          value={first_last_name}
          onChangeText={setFirst_last_name}
          label="Apellido paterno"
          maxLength={50}
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          mode="outlined"
          value={second_last_name}
          onChangeText={setSecond_last_name}
          label="Apellido materno"
          maxLength={50}
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          mode="outlined"
          value={age}
          onChangeText={setAge}
          label="Edad"
          keyboardType="numeric"
          maxLength={2}
          autoComplete="off"
          autoCorrect={false}
        />
        <Flex fill>
          <Dropdown
            title="Grupo sanguíneo"
            options={bloodTypes}
            value={blood_type}
            selected={setBlood_type}
          />
        </Flex>
        <TextInput
          mode="outlined"
          value={curp}
          onChangeText={setCurp}
          label="CURP"
          autoCapitalize="characters"
          maxLength={18}
          autoComplete="off"
          autoCorrect={false}
        />
      </VStack>
    </VStack>
  )

  const ContactData = () => (
    <VStack
      key="Contact"
      spacing={5}
    >
      <Text variant="labelLarge">Datos de contacto</Text>
      <VStack spacing={10}>
        <TextInput
          mode="outlined"
          value={email}
          onChangeText={setEmail}
          label="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={50}
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          label="Teléfono"
          keyboardType="numeric"
          maxLength={10}
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          mode="outlined"
          value={emergency_contact}
          onChangeText={setEmergency_contact}
          label="Contacto de emergencia"
          maxLength={50}
          autoCapitalize="words"
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          mode="outlined"
          value={emergency_phone}
          onChangeText={setEmergency_phone}
          label="Teléfono de emergencia"
          keyboardType="numeric"
          maxLength={10}
          autoComplete="off"
          autoCorrect={false}
        />
      </VStack>
    </VStack>
  )

  const UserData = () => (
    <VStack
      key="User"
      spacing={5}
    >
      <Text variant="labelLarge">Datos del usuario</Text>
      <VStack spacing={10}>
        {user.role == "Administrador" ? (
          <Flex fill>
            <Dropdown
              title="Rol"
              options={roleTypes}
              value={role}
              selected={setRole}
            />
          </Flex>
        ) : null}
        {role == "Prestador" || user.role == "Encargado" ? (
          <Flex fill>
            <Dropdown
              title="Tipo de prestador"
              options={providerTypes}
              value={provider_type}
              selected={setProvider_type}
            />
          </Flex>
        ) : null}
        {user.role == "Administrador" ? (
          <Flex>
            <Dropdown
              value={place}
              selected={setPlace}
              title="Bosque urbano"
              options={placesOptions}
            />
          </Flex>
        ) : null}
        {user.role == "Administrador" ? (
          place != "" && areasOptions.length > 0 ? (
            <Flex>
              <Dropdown
                value={assigned_area}
                selected={setAssigned_area}
                title="Área asignada"
                options={areasOptions}
              />
            </Flex>
          ) : areasOptions.length == 0 && place != "" ? (
            <HStack
              pv={10}
              items="center"
              spacing={20}
            >
              <Icon
                name="alert"
                color={theme.colors.error}
                size={30}
              />
              <Flex fill>
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.error
                  }}
                >
                  El bosque urbano seleccionado no cuenta con áreas registradas, primero cree un área para poder continuar.
                </Text>
              </Flex>
            </HStack>
          ) : null
        ) : null}
        {role == "Prestador" || user.role == "Encargado" ? (
          <Flex>
            <Dropdown
              value={school}
              selected={setSchool}
              title="Escuela"
              options={schoolsOptions}
            />
          </Flex>
        ) : null}
        {role == "Prestador" || user.role == "Encargado" ? (
          <TextInput
            mode="outlined"
            value={total_hours}
            onChangeText={setTotal_hours}
            label="Total de horas"
            keyboardType="number-pad"
            maxLength={3}
            autoComplete="off"
            autoCorrect={false}
          />
        ) : null}
      </VStack>
    </VStack>
  )

  const ImageData = () => (
    <VStack
      key="Image"
      spacing={5}
    >
      <Text variant="labelLarge">Foto de perfil</Text>
      <VStack spacing={10}>
        <ImageSelector
          value={avatar}
          setter={setAvatar}
          type="square"
        />
      </VStack>
    </VStack>
  )

  const Save = () => (
    <Button
      key="SaveButton"
      mode="contained"
      icon="content-save-outline"
      disabled={modalLoading || !verified}
      loading={modalLoading}
      onPress={() => {
        SaveUser()
      }}
    >
      Guardar
    </Button>
  )

  const Cancel = () => (
    <Button
      key="CancelButton"
      mode="outlined"
      icon="close"
      onPress={() => {
        navigation.pop()
      }}
    >
      Cancelar
    </Button>
  )

  return (
    <Flex fill>
      <CreateForm
        navigation={navigation}
        title={"Añadir nuevo usuario"}
        children={[PersonalData(), ContactData(), UserData(), ImageData()]}
        actions={[Save(), Cancel()]}
      />

      <ModalMessage
        title="¡Listo!"
        description="El usuario ha sido creado"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[["Aceptar", () => navigation.pop()]]}
        dismissable={false}
        icon="check-circle-outline"
      />
      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos crear al usuario, inténtalo más tarde. (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />
      <ModalMessage
        title="Sin conexión a internet"
        description={`Parece que no tienes conexión a internet, conéctate e intenta de nuevo`}
        handler={[modalFatal, () => setModalFatal(!modalFatal)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="wifi-alert"
      />
    </Flex>
  )
}
