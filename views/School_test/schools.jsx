import { Flex } from "@react-native-material/core"
import { useState, useEffect } from "react"
import { Button } from "react-native-paper"
//Importar de React Native Paper

// var = () => {} --> Arrow Function con parametros
// var = _ => {} --> Arrow Function sin parametros

// {navigation, route} sirve para deserializar objetos de la ruta
// [var, setVar] sirve para deserializar variables de la ruta,

//Para retornar codigo de HTML se pone dentro de parentesis dentro del return

//UseEffect se ejecuta la primera vez que carga la ventana y cada que cambie de estado una variable.

export default schools = ({navigation, route}) => {

    useEffect(() => {
        
    })

    return (
        <Flex fill>
            <Text variant = "headLineLarge">
                Hola
            </Text>
        </Flex>
    ) 
}