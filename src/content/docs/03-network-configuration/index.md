---
title: Configuración de Red (Switching & Direccionamiento)
description: "Configuración de una red LAN en el switch y el router: VLANs y trunking, direccionamiento IP y subinterfaces para enrutar entre VLANs."
---

Este módulo sigue el flujo de configuración de la capa 2 y el direccionamiento de
una red de un edificio de un piso: se segmenta con VLANs, se da direccionamiento
IP a los dispositivos y se enruta entre VLANs con subinterfaces
(router-on-a-stick). La conexión con otras redes mediante rutas estáticas y
protocolos de enrutamiento (OSPF, EIGRP y RIP) se cubre en el
[Módulo 4: Protocolos de Enrutamiento](../04-routing-protocols/).

## Temas del módulo

### VLANs y Trunking (802.1Q)

Segmenta la red en dominios de broadcast y enlaza VLANs entre switches mediante
trunks etiquetados con 802.1Q.

- [VLANs y Trunking (802.1Q)](./vlans-trunking)

### Direccionamiento IP (Switch y Router)

Da direcciones IP a los dispositivos de capa 3: SVI en el switch, IP en las
interfaces del router, gateway por defecto y enrutamiento entre VLANs.

- [Direccionamiento IP (Switch y Router)](./addressing)

### Subinterfaces (Router-on-a-Stick)

Enruta varias VLANs con un solo enlace switch-router usando subinterfaces
lógicas con etiquetado 802.1Q.

- [Subinterfaces (Router-on-a-Stick)](./subinterfaces)

## Repaso rápido

| Concepto        | Resumen                                       |
| :-------------- | :-------------------------------------------- |
| VLAN            | Segmentación lógica del dominio de broadcast  |
| Trunk (802.1Q)  | Etiqueta tramas para transportar varias VLANs |
| SVI             | IP de gestión del switch y gateway en multicapa |
| Subinterfaz     | Interfaz lógica por VLAN en el router (802.1Q) |

## Referencia rápida

- [Cheat Sheet (Referencia Técnica)](./cheat-sheet)

## Ejercicio

Ponlo todo en práctica con el [Ejercicio: Red de un piso](./exercise), que retoma
la configuración del módulo anterior y deja la red enrutando entre VLANs de
extremo a extremo.

Continúa con [el Módulo 4: Protocolos de Enrutamiento](../04-routing-protocols/)
para conectar esta red con otras mediante rutas estáticas y protocolos dinámicos.
