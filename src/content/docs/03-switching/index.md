---
title: Switching
description: "Conmutación de capa 2: VLANs y trunking, Spanning Tree, EtherChannel y seguridad de capa 2."
---

Este módulo cubre la conmutación de capa 2: cómo se segmenta la red en VLANs, cómo
se enlazan los switches entre sí, cómo se evitan los bucles de capa 2 con Spanning
Tree y cómo se asegura la infraestructura de conmutación.

## Temas del módulo

### VLANs y Trunking (802.1Q)

Segmenta la red en dominios de broadcast y enlaza VLANs entre switches mediante
trunks etiquetados con 802.1Q.

- [VLANs y Trunking (802.1Q)](./vlans-trunking)

### Spanning Tree Protocol (STP / RSTP)

Protocolo de capa 2 que evita los bucles en redes redundantes con la elección de
root bridge, puertos root y puertos designados.

- [Spanning Tree Protocol (STP / RSTP)](./spanning-tree-protocol)

### EtherChannel (LACP / PAgP)

Agrega varios enlaces físicos en un único enlace lógico para multiplicar ancho de
banda y ganar redundancia.

- [EtherChannel (LACP / PAgP)](./etherchannel)

### Seguridad de Capa 2

Protege el acceso a la red de conmutación: Port Security, DHCP Snooping, DAI y
protección de puertos no utilizados.

- [Seguridad de Capa 2](./layer-2-security)

## Repaso rápido

| Concepto       | Resumen                                            |
| :------------- | :------------------------------------------------- |
| VLAN           | Segmentación lógica del dominio de broadcast        |
| Trunk (802.1Q) | Etiqueta tramas para transportar varias VLANs       |
| STP/RSTP       | Evita bucles de capa 2 en topologías redundantes    |
| EtherChannel   | Agregación de enlaces (LACP / PAgP)                 |
| Port Security  | Restringe el acceso por dirección MAC al puerto     |

Continúa con [el Módulo 4](../04-routing/) cuando domines la conmutación.
