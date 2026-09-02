---
title: Switching y Seguridad
description: "Redundancia y seguridad de la capa de conmutación: Spanning Tree, EtherChannel y seguridad de capa 2."
---

Este módulo hace que la **capa de conmutación** sea **confiable** (redundancia
de enlaces sin bucles) y **segura** (protección del acceso a los puertos). Son
los temas que no necesitas para que una red de un piso funcione, pero sí para
que siga funcionando cuando algo falla o cuando alguien intenta entrar donde no
debe.

## Temas del módulo

### Spanning Tree Protocol (STP / RSTP)

Evita los bucles de capa 2 en redes redundantes con la elección de root bridge,
puertos root y puertos designados.

- [Spanning Tree Protocol (STP / RSTP)](./spanning-tree-protocol)

### EtherChannel (LACP / PAgP)

Agrega varios enlaces físicos en un único enlace lógico para multiplicar ancho
de banda y ganar redundancia.

- [EtherChannel (LACP / PAgP)](./etherchannel)

### Seguridad de Capa 2

Protege el acceso a la red de conmutación: Port Security, DHCP Snooping, DAI y
protección de puertos no utilizados.

- [Seguridad de Capa 2](./layer-2-security)

## Repaso rápido

| Concepto          | Resumen                                            |
| :---------------- | :------------------------------------------------- |
| STP/RSTP          | Evita bucles de capa 2 en topologías redundantes   |
| EtherChannel      | Agregación de enlaces (LACP / PAgP)                |
| Port Security     | Restringe el acceso por MAC al puerto              |
| DHCP Snooping     | Bloquea servidores DHCP falsos                     |

## Referencia rápida

- [Cheat Sheet (Referencia Técnica)](./cheat-sheet)

## Ejercicio

Aplica todo lo anterior a la misma red del módulo anterior con el
[Ejercicio: Switching y seguridad (Parte 3)](./exercise).

Continúa con [el Módulo 6: Routing y Redundancia](../06-routing-redundancy/)
cuando la capa de conmutación sea redundante y segura.