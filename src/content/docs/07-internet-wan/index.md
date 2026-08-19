---
title: Conexión a Internet y Enlaces WAN
description: "Conexión de la red al ISP: qué es un ISP, tipos de enlaces WAN, encapsulaciones HDLC/PPP, direccionamiento de borde y salida a internet."
---

Este módulo cierra el edificio por el lado de **internet**: qué es un ISP, los
tipos de enlace WAN que puede darte (línea dedicada, fibra, Metro Ethernet),
las encapsulaciones de los enlaces seriales (HDLC/PPP) y cómo se configura la
frontera del router de borde para salir a internet.

## Temas del módulo

### Conexión al ISP (Enlaces WAN)

Qué entrega el proveedor, cómo se configura el enlace de borde y qué hay del
otro lado del cable de tu router.

- [Conexión al ISP (Enlaces WAN)](./conexion-isp)

## Repaso rápido

| Concepto         | Resumen                                              |
| :--------------- | :--------------------------------------------------- |
| ISP              | Proveedor de servicios de internet (enlace + IP + gateway) |
| Línea dedicada   | Enlace serial punto a punto (HDLC/PPP)               |
| Metro Ethernet   | Enlace de fibra tipo Ethernet hasta el ISP           |
| HDLC             | Encapsulación propietaria de Cisco (por defecto)     |
| PPP              | Encapsulación estándar con autenticación (PAP/CHAP)  |
| Enlace /30       | Subred mínima del enlace hacia el ISP (2 hosts)      |

## Referencia rápida

- [Cheat Sheet (Referencia Técnica)](./cheat-sheet)

## Ejercicio

Termina la configuración incremental del edificio con el
[Ejercicio: Conexión al ISP (Parte 6)](./ejercicio), que deja la frontera con
internet lista y verificada.

Este es el último módulo de la guía. Si completaste todos los temas y los
ejercicios de las Partes 1 a 6, ya tienes configurado un edificio de un piso
completo, de los equipos hasta internet.