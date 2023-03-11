import { Flex, HStack } from '@react-native-material/core'
import React, { useState, useEffect } from 'react'
import { IconButton, TextInput } from 'react-native-paper'

export default SearchBar = ({ label, value, setter, show, action }) => {
  const [clear, setClear] = useState(false)

  useEffect(() => {
    if (clear === true && value == '') {
      action()
      setClear(false)
    }
  }, [value, clear])

  useEffect(() => {
    if (show === false) {
      setter('')
      setClear(true)
    }
  }, [show])

  return show ? (
    <HStack ph={20} spacing={10} items="end">
      <Flex fill>
        <TextInput mode="outlined" label={label ?? 'Búsqueda'} clearTextOnFocus={true} value={value} returnKeyType="search" returnKeyLabel="Buscar" onChangeText={setter} onSubmitEditing={() => action(value)} />
      </Flex>
      {value ? (
        <IconButton
          mode="outlined"
          icon="close"
          onPress={() => {
            setter('')
            setClear(true)
          }}
        />
      ) : null}
    </HStack>
  ) : null
}
