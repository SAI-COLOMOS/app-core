import { Flex, HStack, VStack } from "@react-native-material/core"
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Button, IconButton, Text, TextInput, useTheme } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import Constants from "expo-constants"
import CreateForm from "../Shared/CreateForm"
import ModalMessage from "../Shared/ModalMessage"
import Dropdown from "../Shared/Dropdown"
import ApplicationContext from "../ApplicationContext"
import ImageSelector from "../Shared/ImageSelector"

export default EditUser = ({ navigation, route }) => {
  const { host, user, token } = useContext(ApplicationContext)
  const theme = useTheme()
  const { profile, image, getUsers, getUser } = route.params

  const [first_name, setFirst_name] = useState(`${profile.first_name ?? ""}`)
  const [first_last_name, setFirst_last_name] = useState(`${profile.first_last_name ?? ""}`)
  const [second_last_name, setSecond_last_name] = useState(`${profile.second_last_name ?? ""}`)
  const [age, setAge] = useState(`${profile.age ?? ""}`)
  const [email, setEmail] = useState(`${profile.email ?? ""}`)
  const [phone, setPhone] = useState(`${profile.phone ?? ""}`)
  const [emergency_contact, setEmergency_contact] = useState(`${profile.emergency_contact ?? ""}`)
  const [emergency_phone, setEmergency_phone] = useState(`${profile.emergency_phone ?? ""}`)
  const [blood_type, setBlood_type] = useState(`${profile.blood_type ?? ""}`)
  const [provider_type, setProvider_type] = useState(`${profile.provider_type ?? ""}`)
  const [place, setPlace] = useState(`${profile.place ?? ""}`)
  const [assigned_area, setAssigned_area] = useState(`${profile.assigned_area ?? ""}`)
  const [school, setSchool] = useState(`${profile.school ?? ""}`)
  const [role, setRole] = useState(`${profile.role ?? ""}`)
  const [status, setStatus] = useState(`${profile.status ?? ""}`)
  const [total_hours, setTotal_hours] = useState(`${profile.total_hours ?? ""}`)
  const [avatar, setAvatar] = useState(image ?? null)
  const [curp, setCurp] = useState(`${profile.curp ?? ""}`)
  const [verified, setVerified] = useState(false)

  const [loading, setLoading] = useState(false)
  const [modalConfirm, setModalConfirm] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalSuccess, setModalSuccess] = useState(false)
  const [modalSuccessDelete, setModalSuccessDelete] = useState(false)
  const [modalError, setModalError] = useState(false)
  const [modalErrorDelete, setModalErrorDelete] = useState(false)
  const [modalFatal, setModalFatal] = useState(false)
  const [responseCode, setResponseCode] = useState("")

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
  const statusTypes = [
    {
      option: "Activo"
    },
    {
      option: "Suspendido"
    },
    {
      option: "Inactivo"
    },
    {
      option: "Finalizado"
    }
  ]
  const [schoolsOptions, setSchoolsOptions] = useState(undefined)
  const [placesOptions, setPlacesOptions] = useState(undefined)
  const [areasOptions, setAreasOptions] = useState(undefined)

  async function saveUser() {
    setModalLoading(true)

    let bodyRequest = {
      first_name: first_name.trim(),
      first_last_name: first_last_name.trim(),
      second_last_name: second_last_name.trim(),
      age: age.trim(),
      email: email.trim(),
      phone: phone.trim(),
      emergency_contact: emergency_contact.trim(),
      emergency_phone: emergency_phone.trim(),
      blood_type: blood_type.trim(),
      provider_type: provider_type.trim(),
      school: school.trim(),
      status: status.trim(),
      total_hours: Number(total_hours),
      avatar: avatar,
      curp: curp.trim()
    }

    if (user?.role == "Administrador") {
      bodyRequest = {
        ...bodyRequest,
        role: role.trim(),
        assigned_area: assigned_area.trim(),
        place: place.trim()
      }
    }

    const request = await fetch(`${host}/users/${profile.register}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(bodyRequest)
    })
      .then((response) => response.status)
      .catch(() => null)

    setModalLoading(false)

    if (request == 200) {
      setModalSuccess(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalError(true)
    } else {
      setModalFatal(true)
    }
  }

  async function deleteUser() {
    setModalLoading(true)
    const request = await fetch(`${host}/users/${profile.register}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache"
      }
    })
      .then((response) => response.status)
      .catch(() => null)

    setModalLoading(false)

    if (request == 200) {
      setModalSuccessDelete(true)
    } else if (request != null) {
      setResponseCode(request)
      setModalErrorDelete(true)
    } else {
      setModalFatal(true)
    }
  }

  async function getData() {
    setLoading(true)

    const requests = await Promise.all([
      await fetch(`${host}/places`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }).catch((error) => console.error("Get places:", error)),
      await fetch(`${host}/schools`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }).catch((error) => console.error("Get schools", error))
    ]).catch((error) => console.error("Get data:", error))

    setLoading(false)

    if (requests[0]?.ok) {
      const response = await requests[0].json()

      let placesData = []
      response.places.forEach((place) => {
        let areasData = []

        place.place_areas.map((area) => {
          areasData.push({ option: area.area_name })
        })

        placesData.push({ option: place.place_name, areas: areasData })
      })
      setPlacesOptions(placesData)
    } else {
      setPlacesOptions(null)
    }

    if (requests[1]?.ok) {
      const response = await requests[1].json()
      let schoolsData = []
      response.schools.forEach((school) => {
        schoolsData.push({ option: school.school_name })
      })
      setSchoolsOptions(schoolsData)
    } else {
      setSchoolsOptions(null)
    }
  }

  useEffect(() => {
    getData()
  }, [])

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

    ;/^[a-zA-Z0-9]+(\.?[a-zA-Z0-9])+@+[a-zA-Z0-9_\-]+\.+[a-zA-Z0-9]/.test(email) ? null : (check = false)
    first_name?.length > 0 ? null : (check = false)
    first_last_name?.length > 0 ? null : (check = false)
    age?.length > 0 ? null : (check = false)
    blood_type?.length > 0 ? null : (check = false)
    email?.length > 0 ? null : (check = false)
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
  }, [first_name, first_last_name, age, blood_type, email, phone, emergency_contact, emergency_phone, provider_type, place, assigned_area, school, role, status, total_hours, curp])

  useEffect(() => {
    if (role != "Prestador") {
      setProvider_type("")
      setSchool("")
      setTotal_hours("")
    } else {
      setProvider_type(profile?.provider_type)
      setSchool(profile?.school)
    }
  }, [role])

  useEffect(() => {
    if (place == profile?.place) {
      setAssigned_area(profile?.assigned_area)
    } else {
      setAssigned_area("")
    }
    const placeSelected = placesOptions?.find((item) => item.option == place)

    let areaData = []
    placeSelected?.areas.forEach((area) => {
      areaData.push({
        option: area.option
      })
    })

    setAreasOptions(areaData)
  }, [place, placesOptions])

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
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={first_last_name}
          onChangeText={setFirst_last_name}
          label="Apellido paterno"
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={second_last_name}
          onChangeText={setSecond_last_name}
          label="Apellido materno"
          maxLength={150}
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={age}
          onChangeText={setAge}
          label="Edad"
          keyboardType="numeric"
          maxLength={2}
          multiline={true}
          numberOfLines={1}
          autoComplete="off"
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
          multiline={true}
          numberOfLines={1}
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
          maxLength={150}
          multiline={true}
          numberOfLines={1}
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          mode="outlined"
          value={phone}
          onChangeText={setPhone}
          label="Teléfono"
          keyboardType="phone-pad"
          maxLength={10}
          multiline={true}
          numberOfLines={1}
          autoComplete="off"
          autoCorrect={false}
        />
        <TextInput
          mode="outlined"
          value={emergency_contact}
          onChangeText={setEmergency_contact}
          label="Contacto de emergencia"
          maxLength={150}
          autoCapitalize="words"
          multiline={true}
          numberOfLines={1}
        />
        <TextInput
          mode="outlined"
          value={emergency_phone}
          onChangeText={setEmergency_phone}
          label="Teléfono de emergencia"
          keyboardType="phone-pad"
          maxLength={10}
          multiline={true}
          numberOfLines={1}
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
        {user?.role == "Administrador" && (
          <Flex fill>
            <Dropdown
              title="Rol"
              options={roleTypes}
              value={role}
              selected={setRole}
            />
          </Flex>
        )}

        {(role == "Prestador" || user.role == "Encargado") && (
          <Flex fill>
            <Dropdown
              title="Tipo de prestador"
              options={providerTypes}
              value={provider_type}
              selected={setProvider_type}
            />
          </Flex>
        )}

        {user?.role == "Administrador" && (
          <Flex>
            {placesOptions != null ? (
              <Dropdown
                title="Bosque urbano"
                value={place}
                selected={setPlace}
                options={placesOptions}
              />
            ) : loading == true ? (
              <HStack
                fill
                items="center"
                pv={10}
                spacing={20}
              >
                <Flex fill>
                  <Text variant="bodyMedium">Obteniendo la lista de bosques urbanos</Text>
                </Flex>
                <ActivityIndicator />
              </HStack>
            ) : (
              <HStack
                fill
                items="center"
                pv={10}
                spacing={20}
              >
                <Flex fill>
                  <Text variant="bodyMedium">Ocurrió un problema obteniendo la lista de bosques urbanos</Text>
                </Flex>
                <IconButton
                  icon="reload"
                  mode="outlined"
                  onPress={() => getData()}
                />
              </HStack>
            )}
          </Flex>
        )}

        {user?.role == "Administrador" &&
          (place != "" && areasOptions?.length > 0 ? (
            <Flex>
              <Dropdown
                value={assigned_area}
                selected={setAssigned_area}
                title="Área asignada"
                options={areasOptions}
              />
            </Flex>
          ) : (
            areasOptions?.length == 0 &&
            place != "" && (
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
            )
          ))}

        {role == "Prestador" && (
          <Flex>
            {placesOptions != null ? (
              <Dropdown
                value={school}
                selected={setSchool}
                title="Escuela"
                options={schoolsOptions}
              />
            ) : loading == true ? (
              <HStack
                fill
                items="center"
                pv={10}
                spacing={20}
              >
                <Flex fill>
                  <Text variant="bodyMedium">Obteniendo la lista de escuelas</Text>
                </Flex>
                <ActivityIndicator />
              </HStack>
            ) : (
              <HStack
                fill
                items="center"
                pv={10}
                spacing={20}
              >
                <Flex fill>
                  <Text variant="bodyMedium">Ocurrió un problema obteniendo la lista de escuelas</Text>
                </Flex>
                <IconButton
                  icon="reload"
                  mode="outlined"
                  onPress={() => getData()}
                />
              </HStack>
            )}
          </Flex>
        )}

        {(role == "Prestador" || user.role == "Encargado") && (
          <TextInput
            mode="outlined"
            value={total_hours}
            onChangeText={setTotal_hours}
            label="Total de horas"
            keyboardType="numeric"
            maxLength={3}
            autoComplete="off"
            autoCorrect={false}
          />
        )}

        <Flex fill>
          <Dropdown
            title="Estado"
            options={statusTypes}
            value={status}
            selected={setStatus}
          />
        </Flex>
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

  const Delete = () => (
    <VStack
      key="Delete"
      spacing={5}
    >
      <Text variant="labelLarge">Eliminar al usuario</Text>
      <VStack spacing={10}>
        <Button
          textColor={theme.colors.error}
          icon="trash-can-outline"
          mode="outlined"
          disabled={modalLoading}
          onPress={() => {
            setModalConfirm(!modalConfirm)
          }}
        >
          Eliminar
        </Button>
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
        saveUser()
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
      disabled={modalLoading}
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
        title="Editar usuario"
        children={[PersonalData(), ContactData(), UserData(), ImageData(), Delete()]}
        actions={[Save(), Cancel()]}
        navigation={navigation}
        loading={modalLoading}
      />

      <ModalMessage
        title="Eliminar usuario"
        description="¿Seguro que deseas eliminar a este usuario? La acción no se puede deshacer"
        handler={[modalConfirm, () => setModalConfirm(!modalConfirm)]}
        actions={[
          ["Cancelar", () => setModalConfirm(!modalConfirm)],
          [
            "Aceptar",
            () => {
              setModalConfirm(!modalConfirm)
              deleteUser()
            }
          ]
        ]}
        dismissable={true}
        icon="help-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El usuario ha sido actualizado"
        handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]}
        actions={[
          [
            "Aceptar",
            () => {
              getUser()
              getUsers()
              navigation.pop()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="¡Listo!"
        description="El usuario ha sido eliminado"
        handler={[modalSuccessDelete, () => setModalSuccessDelete(!modalSuccessDelete)]}
        actions={[
          [
            "Aceptar",
            () => {
              navigation.pop(2)
              getUsers()
            }
          ]
        ]}
        dismissable={false}
        icon="check-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos actualizar al usuario, inténtalo más tarde. (${responseCode})`}
        handler={[modalError, () => setModalError(!modalError)]}
        actions={[["Aceptar"]]}
        dismissable={true}
        icon="close-circle-outline"
      />

      <ModalMessage
        title="Ocurrió un problema"
        description={`No pudimos eliminar al usuario, inténtalo más tarde. (${responseCode})`}
        handler={[modalErrorDelete, () => setModalErrorDelete(!modalErrorDelete)]}
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
