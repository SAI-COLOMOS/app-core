import { Flex } from '@react-native-material/core'
import React, { useState, useEffect } from 'react'
import { Text, TextInput, TouchableRipple, Menu, Card } from 'react-native-paper'

export default Dropdown = ({title, options, selected, value}) => {
    const [show, setShow] = useState(false)
    return (
        <Flex fill>
                <Menu anchorPosition='bottom' contentStyle={false} visible={show} onDismiss={() => setShow(!show)} anchor={
                    <TouchableRipple onPress={() => setShow(!show)} style={{zIndex: 10}}>
                        <TextInput label={title} value={value} mode='outlined' editable={false} style={{zIndex: -5}} right={<TextInput.Icon disabled={true} icon="menu-down"/>} />
                    </TouchableRipple>
                }>
                    {
                        options?.length > 0 ? (
                                    options.map(option => (
                                        <Menu.Item title={option?.option} onPress={() => {
                                            selected(option?.option)
                                            setShow(!show)
                                        }}/>
                                    ))
                        ) : (
                            null
                        )
                    }
                </Menu>
        </Flex>
    )
}