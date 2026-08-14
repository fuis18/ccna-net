---
title: Network Fundamentals
description: "Fundamentos de red: modelos OSI y TCP/IP, direccionamiento IPv4/IPv6 y subnetting."
---

Este módulo cubre los fundamentos necesarios antes de trabajar con routers y switches:
cómo se comunican los dispositivos en una red, cómo se modela esa comunicación en capas
y cómo se direcciona a los equipos dentro de la red.

## Temas del módulo

### Modelo OSI y TCP/IP

Entiende la comunicación en capas: el modelo de referencia OSI de 7 capas y el modelo
TCP/IP de 4 capas que se usa realmente en internet. Incluye la PDUs, encapsulación
y las funciones de cada capa.

- [Modelo OSI y TCP/IP](./osi-tcp-ip-model)

### Direccionamiento IPv4 y Subnetting

La capa de red necesita identificar cada host. Aprende la estructura de la dirección
IPv4, direcciones públicas y privadas, máscaras, CIDR y cómo dividir redes mediante
subnetting y VLSM.

- [Direccionamiento IPv4 y Subnetting](./ipv4-addressing-subnetting)

### Direccionamiento IPv6

IPv6 resuelve el agotamiento de IPv4 con un espacio de direcciones mucho mayor.
Aprende su formato hexadecimal, tipos de direcciones (unicast, multicast, anycast),
configuración (EUI-64, SLAAC) y coexistencia con IPv4.

- [Direccionamiento IPv6](./ipv6-addressing)

## Repaso rápido

| Concepto           | Resumen                                            |
| :----------------- | :------------------------------------------------- |
| Modelo OSI         | 7 capas, referencia para entender la comunicación  |
| Modelo TCP/IP      | 4 capas, el modelo real de internet                |
| PDU                | Dato en cada capa: segmento, paquete, trama        |
| IPv4               | 32 bits, binario, clases, máscaras, CIDR, subnetting |
| IPv6               | 128 bits, hexadecimal, tipos unicast/multicast/anyscast |

Continúa con [el Módulo 2](../02-device-management/) cuando domines estos conceptos.