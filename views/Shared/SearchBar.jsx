import { Flex, HStack } from '@react-native-material/core'
import React, { useState, useEffect } from 'react'
import { IconButton, TextInput } from 'react-native-paper'

export default SearchBar = ({label, value, setter, show, action}) => {
    useEffect(() => {
        if(value == "") {
            action()
        }
    }, [value]);

    useEffect(() => {
        if(!show) {
            setter("")
        }
    }, [show]);


    return show ? (
        <HStack pv={10} ph={20} spacing={10} items="end">
            <Flex fill>
                <TextInput mode="outlined" label={label ?? "Búsqueda"} value={value} returnKeyType="search" returnKeyLabel="Buscar" onChangeText={setter} onSubmitEditing={() => action(value)}/>
            </Flex>
            {
                value ? (
                    <IconButton mode="outlined" icon="close" onPress={() => {
                        setter("")
                    }} />
                ) : (
                    null
                )
            }
        </HStack>
    ) : (
        null
    )
}