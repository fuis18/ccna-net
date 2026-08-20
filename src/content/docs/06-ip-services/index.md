---
title: IP Services and Maintenance
description: "Servicios IP y mantenimiento: NAT/PAT, DHCP/DNS/NTP y listas de control de acceso."
---

Este módulo cubre los servicios IP que mantienen una red en funcionamiento:
traducción de direcciones NAT/PAT, servicios de DHCP/DNS/NTP y filtrado de
tráfico con listas de control de acceso (ACLs).

## Temas del módulo

### NAT / PAT

Traduce direcciones IP privadas a públicas para salir a internet y reutiliza
direcciones públicas con sobrecarga (PAT).

- [NAT / PAT](./nat-pat)

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
| DHCP     | Asignación automática de direcciones IP             |
| DNS      | Resolución de nombres a direcciones IP              |
| NTP      | Sincronización de hora en la red                    |
| ACL      | Lista de permisos/denegaciones de tráfico           |

## Ejercicio

Cierra el edificio con los servicios IP usando el
[Ejercicio: Servicios IP (Parte 5)](./exercise).

Este es el último módulo de la guía. Si dominas todos los temas y completas los
ejercicios, ya tienes una base sólida para los objetivos del examen CCNA.
