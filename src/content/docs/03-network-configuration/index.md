---
title: Configuración de Red (Switching & Routing)
description: "Configuración de una red LAN: VLANs y trunking, direccionamiento IP en switch y router, subinterfaces, rutas estáticas y protocolos de enrutamiento dinámico."
---

Este módulo sigue el flujo de configuración de una red de un edificio de un
piso, de principio a fin: primero se segmenta con VLANs, luego se da
direccionamiento IP a los dispositivos, se enruta entre VLANs con subinterfaces
y por último se conectan las redes con rutas estáticas y protocolos de
enrutamiento dinámico (OSPF, EIGRP y RIP).

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

### Rutas Estáticas y Default

Define rutas de forma manual y la ruta por defecto que captura el tráfico sin
destino específico en la tabla de enrutamiento.

- [Rutas Estáticas y Default](./static-default-routes)

### Protocolos de Enrutamiento Dinámico (OSPF / EIGRP / RIP)

Los routers aprenden las rutas solos: OSPF en detalle, EIGRP y RIP con sus
métricas, configuración y verificación.

- [Protocolos de Enrutamiento Dinámico (OSPF / EIGRP / RIP)](./routing-protocols)

## Repaso rápido

| Concepto           | Resumen                                         |
| :----------------- | :---------------------------------------------- |
| VLAN               | Segmentación lógica del dominio de broadcast    |
| Trunk (802.1Q)     | Etiqueta tramas para transportar varias VLANs   |
| SVI                | IP de gestión del switch y gateway en multicapa |
| Subinterfaz        | Interfaz lógica por VLAN en el router (802.1Q)  |
| Ruta estática      | Ruta configurada manualmente                    |
| Ruta default       | Ruta `0.0.0.0/0` para tráfico sin coincidencia  |
| OSPF / EIGRP / RIP | Protocolos dinámicos (AD 110 / 90 / 120)        |

## Referencia rápida

- [Cheat Sheet (Referencia Técnica)](./cheat-sheet)

## Ejercicio

Ponlo todo en práctica con el [Ejercicio: Red de un piso (parte 2)](./exercise),
que retoma la configuración del módulo anterior y deja la red funcional de
extremo a extremo.

Continúa con [el Módulo 4](../04-redundancy-security/) cuando la red funcione.
