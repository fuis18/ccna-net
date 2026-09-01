---
title: IP Services and Maintenance
description: "Servicios IP y mantenimiento: NAT/PAT, conexión al ISP (enlaces WAN), DHCP/DNS/NTP y listas de control de acceso."
---

Este módulo cubre los servicios IP que mantienen una red en funcionamiento:
traducción de direcciones NAT/PAT, la conexión al ISP (enlaces WAN),
servicios de DHCP/DNS/NTP y filtrado de tráfico con listas de control de
acceso (ACLs).

## Temas del módulo

### NAT / PAT

Traduce direcciones IP privadas a públicas para salir a internet y reutiliza
direcciones públicas con sobrecarga (PAT).

- [NAT / PAT](./nat-pat)

### Conexión al ISP (Enlaces WAN)

La frontera del edificio con internet: qué es un ISP, tipos de enlace WAN,
encapsulaciones HDLC/PPP y la ruta por defecto hacia el proveedor. Se apoya en
el NAT del tema anterior: las IPs privadas salen por la IP pública del enlace.

- [Conexión al ISP (Enlaces WAN)](./conexion-isp)

### DHCP / DNS / NTP

Proporciona direcciones IP automáticamente (DHCP), resuelve nombres (DNS) y
sincroniza el reloj de los equipos (NTP).

- [DHCP / DNS / NTP](./dhcp-dns-ntp)

### Listas de Control de Acceso (ACLs)

Filtra el tráfico que entra y sale de una interfaz, basado en IP, protocolo o
puerto.

- [Listas de Control de Acceso (ACLs)](./acls)

## Repaso rápido

| Concepto | Resumen                                            |
| :------- | :------------------------------------------------- |
| NAT      | Traducción IP privada a pública (1:1)              |
| PAT      | Sobrecarga: muchas privadas comparten una pública   |
| ISP      | Proveedor de servicios de internet (enlace + IP + gateway) |
| Enlace WAN | Conexión de borde al ISP (HDLC/PPP, /30)          |
| DHCP     | Asignación automática de direcciones IP             |
| DNS      | Resolución de nombres a direcciones IP              |
| NTP      | Sincronización de hora en la red                    |
| ACL      | Lista de permisos/denegaciones de tráfico           |

## Ejercicio

Cierra el edificio con los servicios IP usando el
[Ejercicio: Servicios IP (Parte 5)](./exercise).

Continúa con el [Módulo 8: QoS & Network Design](../08-qos-network-design/)
cuando domines estos temas.
