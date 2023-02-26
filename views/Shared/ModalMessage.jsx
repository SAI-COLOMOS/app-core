import { useCallback, useEffect, useState } from "react"
import { Button, Dialog, Portal, Text } from "react-native-paper"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Flex } from "@react-native-material/core";
import { useFocusEffect } from "@react-navigation/native";

/**
    Example

    const [modalConfrim, setModalConfrim] = useState(false)
    const [modalSuccess, setModalSuccess] = useState(false)
    const [modalError, setModalError] = useState(false)
    const [modalFatal, setModalFatal] = useState(false)
    const [reponseCode, setReponseCode] = useState("")

    <ModalMessage title="Actualizar contraseña" description="¿Seguro que desea actualizar su contraseña?" handler={[modalConfrim, () => setModalConfrim(!modalConfrim)]} actions={[['Aceptar', () => changePassword()], ['Cancelar', () => setModalConfrim(!modalConfrim)]]} dismissable={true} icon="help-circle-outline"/>

    <ModalMessage title="¡Listo!" description="La contraseña ha sido actualizada, ahora puedes acceder a la aplicación" handler={[modalSuccess, () => setModalSuccess(!modalSuccess)]} actions={[['Aceptar', () => navigation.replace("Dashboard")]]} dismissable={false} icon="check-circle-outline"/>

    <ModalMessage title="Ocurrió un problema" description={`No pudimos actualizar tu contraseña, intentalo más tarde. (${reponseCode})`} handler={[modalError, () => setModalError(!modalError)]} actions={[['Aceptar']]} dismissable={true} icon="close-circle-outline"/>

    <ModalMessage title="Sin conexión a internet" description={`Parece que no tienes conexión a internet, conectate e intenta de nuevo`} handler={[modalFatal, () => setModalFatal(!modalFatal)]} actions={[['Aceptar']]} dismissable={true} icon="wifi-alert"/>

 */

export default Modal = ({title, description, icon, actions, handler, dismissable}) => {
    useFocusEffect(useCallback(() => {
        if(handler ? handler[0] : false) {
            Keyboard.dismiss()
        }

        return () => {}
    }, [handler]))

    return (
        <Portal>
            <Dialog visible={handler ? handler[0] : false} onDismiss={() => handler ? handler[1]() : null} dismissable={dismissable}>
                {
                    icon ? (
                        <Dialog.Icon size={50} icon={icon}/>
                        ) : (
                            null
                            )
                        }
                <Dialog.Title style={{textAlign: "center"}}>
                    {title}
                </Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">
                        {description}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions>
                    {
                        actions?.length > 0 ? (
                            actions.map((action, index) => (
                                <Button key={index.toString()} onPress={() => action[1] ? action[1]() : handler[1]()}>
                                    {action[0]}
                                </Button>
                            ))
                            ) : (
                                <Button onPress={() => handler ? handler[1]() : null}>
                                Aceptar
                            </Button>
                        )
                    }
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}