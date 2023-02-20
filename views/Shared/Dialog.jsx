import { ScrollView } from "react-native";
import { ActivityIndicator, Button, Dialog, List, Paragraph, Portal, Provider, useTheme,  } from "react-native-paper";

const VentanaDeDialogo = (props) => {
    let {titulo, descripcion, icono, cargando, botonUno, botonDos, handler, permanente, opciones} = props;

    /*
    
    Ejemplo de uso:
    <VentanaDeDialogo titulo="Hola" descripcion="Hola" icono="alert" permanente={false} cargando={true} opciones={[opciones, setOpcionSeleccionada]} handler={[mostartDialogo, cambiarEstadoDialogo]} botonUno={['Aceptar', () => {alert('Hola')}]} botonDos={['Cancelar']} />

    Use state para el estado:
    const [mostartDialogo, setMostartDialogo] = useState(false);

    Opciones:
    const opciones = [
        {
            "opcion": "Opción 1",
            "id": 1
        }, {
            "opcion": "Opción 2",
            "id": 2
        }
    ]

    Función toggle:
    function cambiarEstadoDialogo() {
        mostartDialogo ? setMostartDialogo(false) : setMostartDialogo(true);
    }

    */


    return (
        <Portal>
            <Dialog style={{maxHeight: "70%", zIndex: 10}} visible={(handler[0] ? handler[0] : false)} onDismiss={(handler[1] ? handler[1] : null)} dismissable={(permanente ? false : true)} >
                {
                    icono ? (
                        <Dialog.Icon icon={icono} />
                    ) : (
                        ''
                    )
                }

                {
                    titulo ? (
                        <Dialog.Title>
                            {titulo}
                        </Dialog.Title>
                    ) : (
                        ''
                    )
                }

                {
                    opciones ? (
                        <Dialog.ScrollArea>
                            <ScrollView>
                                {
                                    opciones[0].map((item) => (
                                        <List.Item key={item.id.toString()} title={item.opcion} onPress={() => {
                                            opciones[1]({
                                                "opcion": item.opcion,
                                                "id": item.id
                                            });
                                            handler[1]();
                                        }}/>
                                    ))
                                }
                            </ScrollView>
                        </Dialog.ScrollArea>
                    ) : (
                        ""
                    )
                }

                {
                    descripcion || cargando ? (
                        <Dialog.Content>
                            {
                                cargando ? (
                                    <ActivityIndicator style={{paddingTop: 30}} animating={true} size={100}/>
                                ) : (
                                    ''
                                )
                            }

                            {
                                descripcion ? (
                                    <Paragraph>
                                        {descripcion}
                                    </Paragraph>
                                ) : (
                                    ''
                                )
                            }

                        </Dialog.Content>
                    ) : (
                        ""
                    )
                }


                {
                    botonUno || botonDos ? (
                        <Dialog.Actions>
                            {
                                botonDos ? (
                                    <Button onPress={botonDos[1] ? botonDos[1] : handler[1]}>
                                        {botonDos[0]}
                                    </Button>
                                ) : (
                                    ''
                                )
                            }

                            {
                                botonUno ? (
                                    <Button onPress={(botonUno[1] ? botonUno[1] : handler[1])}>
                                        {botonUno[0]}
                                    </Button>
                                ) : (
                                    ''
                                )
                            }
                        </Dialog.Actions>
                    ) : (
                        ''
                    )
                }

            </Dialog>
        </Portal>
    );
}

export default VentanaDeDialogo;