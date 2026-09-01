---
title: Redundancia y Seguridad
description: "Redundancia y seguridad de red: Spanning Tree, EtherChannel, métricas y distancia administrativa, FHRP/HSRP y seguridad de capa 2."
---

Este módulo va un nivel más allá de la configuración básica: hace que la red sea
**confiable** (redundancia y elección de mejor ruta) y **segura** (protección de
la capa 2). Son los temas que no necesitas para que una red de un piso
funcione, pero sí para que siga funcionando cuando algo falla o cuando alguien
intenta entrar donde no debe.

## Temas del módulo

### Spanning Tree Protocol (STP / RSTP)

Evita los bucles de capa 2 en redes redundantes con la elección de root bridge,
puertos root y puertos designados.

- [Spanning Tree Protocol (STP / RSTP)](./spanning-tree-protocol)

### EtherChannel (LACP / PAgP)

Agrega varios enlaces físicos en un único enlace lógico para multiplicar ancho
de banda y ganar redundancia.

- [EtherChannel (LACP / PAgP)](./etherchannel)

### Métricas y Distancia Administrativa

Cómo el router elige la mejor ruta cuando existen varias fuentes de información
de enrutamiento.

- [Métricas y Distancia Administrativa](./metrics-administrative-distance)

### OSPF avanzado (multi-área y punto a punto)

Diseños que escalan la red OSPF más allá del laboratorio: full-mesh punto a
punto sin DR/BDR y áreas con ABR resumiendo rutas.

- [OSPF avanzado](./ospf-avanzado)

### First Hop Redundancy (FHRP / HSRP)

Proporciona un gateway por defecto redundante para los hosts, con HSRP, VRRP o
GLBP.

- [First Hop Redundancy (FHRP / HSRP)](./fhrp-hsrp)

### Seguridad de Capa 2

Protege el acceso a la red de conmutación: Port Security, DHCP Snooping, DAI y
protección de puertos no utilizados.

- [Seguridad de Capa 2](./layer-2-security)

## Repaso rápido

| Concepto          | Resumen                                            |
| :---------------- | :------------------------------------------------- |
| STP/RSTP          | Evita bucles de capa 2 en topologías redundantes   |
| EtherChannel      | Agregación de enlaces (LACP / PAgP)                |
| Distancia administrativa | Prioridad entre fuentes de enrutamiento     |
| HSRP              | IP virtual compartida para alta disponibilidad     |
| OSPF multi-área   | ABR resume entre áreas con LSA tipo 3 (`O IA`)    |
| Port Security     | Restringe el acceso por MAC al puerto              |
| DHCP Snooping     | Bloquea servidores DHCP falsos                     |

## Referencia rápida

- [Cheat Sheet (Referencia Técnica)](./cheat-sheet)

## Ejercicio

Aplica todo lo anterior a la misma red del módulo anterior con el
[Ejercicio: Redundancia y seguridad (parte 3)](./exercise).

Continúa con [el Módulo 6](../06-wireless-networks/) cuando la red sea
redundante y segura.
