import { Flex } from "@react-native-material/core"
import React, { useState, useEffect } from "react"
import { Pressable } from "react-native"
import { Text, TextInput, TouchableRipple, Menu, Card } from "react-native-paper"

export default Dropdown = ({ title, options, selected, value, isAnObjectsArray, objectInfo }) => {
  const [show, setShow] = useState(false)
  return (
    <Menu
      anchorPosition="bottom"
      contentStyle={false}
      visible={show}
      onDismiss={() => setShow(!show)}
      anchor={
        // <TouchableRipple onPress={() => setShow(!show)} style={{ zIndex: 10 }}>
        <Pressable onPress={() => setShow(!show)} style={{ zIndex: 10 }}>
          <TextInput label={title} value={value} mode="outlined" editable={false} style={{ zIndex: -5 }} right={<TextInput.Icon disabled={true} icon="menu-down" />} />
        </Pressable>
        // </TouchableRipple>
      }
    >
      {options?.length > 0
        ? options.map((option) => (
          <Menu.Item
            key={`Menu item ${option?.value ?? option?.option}`}
            title={option?.option}
            onPress={() => {
              if (!isAnObjectsArray)
                selected(option?.value ? { option: option.option, value: option.value } : option.option)
              else {
                const selectedValue = option?.value ? { option: option.option, value: option.value } : option.option
                objectInfo.arr[objectInfo.index][objectInfo.key] = selectedValue
                objectInfo.setArr([...objectInfo.arr])
              }
              setShow(!show)
            }}
          />
        ))
        : null}
    </Menu>
  )
}
