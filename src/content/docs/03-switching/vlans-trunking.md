---
title: VLANs y Trunking (802.1Q)
description: "VLANs: segmentación del dominio de broadcast, tipos de VLAN, puertos access y trunk, etiquetado 802.1Q y configuración en switches Cisco."
---

Una **VLAN** (Virtual LAN) es un dominio de broadcast separado de forma lógica
dentro del mismo switch. Dos estaciones en VLANs distintas no se ven entre sí
ni intercambian tráfico de broadcast, aunque estén en el mismo equipo.

## ¿Por qué usar VLANs?

| Beneficio        | Descripción                                          |
| :--------------- | :--------------------------------------------------- |
| Segmentación     | Divide el dominio de broadcast (la VLAN 1 lo comparte todo) |
| Seguridad        | Aísla usuarios y departamentos entre sí              |
| Organización     | Agrupa por función (ventas, IT, invitados) sin importar la ubicación física |
| Reducción de tráfico | Limita broadcasts y multicast al grupo correspondiente |
| Rendimiento      | Reduce colisiones y tráfico innecesario              |

> Sin VLANs, todo el switch comparte un único dominio de broadcast. Cuanto más
> grande el dominio, más tráfico de broadcast y menos rendimiento.

## Tipos de VLAN

| VLAN                 | Descripción                                              |
| :------------------- | :------------------------------------------------------- |
| VLAN por defecto     | La **VLAN 1**, no se puede borrar ni renombrar            |
| VLAN de datos        | Transporta tráfico de usuarios                           |
| VLAN de gestión      | Transporta tráfico de administración (SSH, telnet)       |
| VLAN nativa          | En un trunk, tramas sin etiqueta; por defecto la VLAN 1  |
| VLAN de voz          | Separa el tráfico de teléfonos IP (prioridad QoS)        |

## Puertos access y trunk

- **Puerto access**: pertenece a una única VLAN y entrega tramas **sin etiqueta**.
  Es el puerto típico conectado a PCs.
- **Puerto trunk**: transporta **varias VLANs** entre switches (o hacia un router).
  Etiqueta cada trama con su VLAN.

```mermaid
graph TD
    PC1[PC-A] -->|access VLAN 10| S1[SW1]
    PC2[PC-B] -->|access VLAN 20| S1
    S1 -->|"trunk 802.1Q<br/>VLANs 10 y 20"| S2[SW2]
    S2 -->|access VLAN 10| PC3[PC-C]
    S2 -->|access VLAN 20| PC4[PC-D]
```
## Etiquetado 802.1Q

El estándar **IEEE 802.1Q** inserta una etiqueta de 4 bytes en la trama
Ethernet para indicar a qué VLAN pertenece. Los campos principales son:

- **TPID** (Tag Protocol Identifier): indica que la trama está etiquetada.
- **TCI**: contiene la **VID** (VLAN ID, 12 bits → 4094 VLANs) y la prioridad.

```
Ethernet sin etiqueta:  |MAC dest|MAC src|Tipo| Datos |FCS|
Ethernet con 802.1Q:    |MAC dest|MAC src|TPID|TCI|Tipo| Datos |FCS|
                                    |__ 4 bytes de etiqueta __|
```
La **VLAN nativa** es la que se envía por el trunk **sin etiqueta** (por
compatibilidad con equipos que no entienden 802.1Q). Debe ser la misma en ambos
extremos del trunk.

## Configuración de VLANs

### Crear una VLAN y asignar puertos

```ios
SW1# configure terminal
SW1(config)# vlan 10
SW1(config-vlan)# name Ventas
SW1(config-vlan)# exit

SW1(config)# interface GigabitEthernet0/1
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# exit
```

| Comando                              | Función                            |
| :----------------------------------- | :--------------------------------- |
| `vlan 10`                            | Crea la VLAN 10 y entra al submodo |
| `name Ventas`                        | Da un nombre descriptivo           |
| `switchport mode access`             | Marca el puerto como access        |
| `switchport access vlan 10`          | Asigna el puerto a la VLAN 10      |

Para asignar varios puertos a la vez se usa `interface range`:

```ios
SW1(config-if-range)# switchport mode access
SW1(config-if-range)# switchport access vlan 20
```
### Configurar un trunk 802.1Q

```ios
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,99
```
| Comando                            | Función                                    |
| :--------------------------------- | :----------------------------------------- |
| `switchport mode trunk`            | Fuerza el puerto a modo trunk              |
| `switchport trunk native vlan 99`  | Cambia la VLAN nativa (mejor que la 1)     |
| `switchport trunk allowed vlan`    | Restringe las VLANs permitidas en el trunk |

> **Buena práctica:** usa la **VLAN 1** solo como fallback y no pongas tráfico
> de usuario en ella. Separa también la **VLAN de gestión**.

### VLAN de voz

Para teléfonos IP que comparten puerto con un PC, el teléfono se asigna a una
VLAN de voz y el PC a la de datos:

```ios
SW1(config-if)# switchport mode access
SW1(config-if)# switchport access vlan 10
SW1(config-if)# switchport voice vlan 100
```
## Verificación

```ios
VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Gi0/2, Gi0/3, ...
10   Ventas                           active    Gi0/1
20   Informatica                      active
...
```

```SW1# show interfaces trunk
Port        Mode         Encapsulation  Status        Native vlan
Gi0/24      on           802.1q         trunking      99
...
```

## Preguntas tipo CCNA

1. **¿Qué es una VLAN y qué limita?**
   Una VLAN es un **dominio de broadcast** separado de forma lógica dentro del
   switch.

2. **¿Qué diferencia hay entre un puerto access y un trunk?**
   El access pertenece a **una VLAN** y envía tramas sin etiqueta; el trunk
   transporta **varias VLANs** con tramas etiquetadas (802.1Q).

3. **¿Qué es la VLAN nativa en un trunk 802.1Q?**
   La VLAN cuyas tramas viajan **sin etiqueta**; debe coincidir en ambos
   extremos del trunk.

4. **¿Cuántas VLANs admite el identificador 802.1Q?**
   12 bits → hasta **4094** VLANs utilizables (1-1001 por defecto, 1002-1005
   reservadas, 1006-4094 extendidas).

5. **¿Qué comando restringe las VLANs que cruzan un trunk?**
   `switchport trunk allowed vlan <lista>`.

## Resumen

- Las VLANs segmentan el **dominio de broadcast** de forma lógica.
- **Access** = una VLAN sin etiqueta; **trunk** = varias VLANs con 802.1Q.
- 802.1Q inserta una etiqueta de 4 bytes en la trama; la VLAN nativa no se
  etiqueta.
- Se crean con `vlan <id>` + `name` y se asignan con `switchport access vlan`.
- Verifica con `show vlan brief` y `show interfaces trunk`.