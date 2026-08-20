---
title: CCNA (Routers & Switches)
description: "Guía de estudio completa de CCNA: routers, switches, redes y servicios IP."
template: splash
hero:
  tagline: Guía de estudio organizada para prepararte en redes.
  actions:
    - text: Comenzar el Capítulo 1
      link: 01-network-fundamentals/
      icon: right-arrow
---

## Cómo usar esta guía

Esta guía está organizada en 6 módulos que cubren los temas esenciales de redes.
Se recomienda seguirlos en orden, aunque cada capítulo puede consultarse de forma independiente.
Cada módulo (del 2 al 6) termina con un **ejercicio incremental** que retoma la
configuración del anterior, hasta completar un edificio de un piso de principio
a fin.

### [1. Network Fundamentals](01-network-fundamentals/)

Introducción a los fundamentos de red: el modelo OSI y TCP/IP, el direccionamiento
IPv4 con subnetting y el direccionamiento IPv6.

- [Modelo OSI y TCP/IP](01-network-fundamentals/osi-tcp-ip-model)
- [Direccionamiento IPv4 y Subnetting](01-network-fundamentals/ipv4-addressing-subnetting)
- [Direccionamiento IPv6](01-network-fundamentals/ipv6-addressing)

### [2. Device Management](02-device-management/)

Administración y configuración inicial de dispositivos de red: acceso por consola, aseguramiento de líneas de administración, banners de advertencia y gestión del sistema operativo (IOS).

- [Acceso Inicial y Modos de CLI](02-device-management/cli-modes)
- [Configuración Básica de Dispositivo (Hostname, Banners, Secret)](02-device-management/basic-configuration)
- [Acceso Remoto Seguro (SSH vs. Telnet)](02-device-management/secure-remote-access)
- [Gestión de Archivos y Sistema Operativo (IOS / Running-Config)](02-device-management/ios-file-management)

### [3. Configuración de Red (Switching & Routing)](03-network-configuration/)

El flujo de configuración de una red LAN, de principio a fin: VLANs y trunking,
direccionamiento IP en switch y router, subinterfaces (router-on-a-stick), rutas
estáticas y protocolos de enrutamiento dinámico.

- [VLANs y Trunking (802.1Q)](03-network-configuration/vlans-trunking)
- [Direccionamiento IP (Switch y Router)](03-network-configuration/addressing)
- [Subinterfaces (Router-on-a-Stick)](03-network-configuration/subinterfaces)
- [Rutas Estáticas y Default](03-network-configuration/static-default-routes)
- [Conexión al ISP (Enlaces WAN)](03-network-configuration/conexion-isp)
- [Protocolos de Enrutamiento Dinámico (OSPF / EIGRP / RIP)](03-network-configuration/routing-protocols)

### [4. Redundancia y Seguridad](04-redundancy-security/)

Los temas que hacen que la red siga funcionando cuando algo falla o cuando
alguien intenta entrar: Spanning Tree, EtherChannel, métricas y distancia
administrativa, FHRP y seguridad de capa 2.

- [Spanning Tree Protocol (STP / RSTP)](04-redundancy-security/spanning-tree-protocol)
- [EtherChannel (LACP / PAgP)](04-redundancy-security/etherchannel)
- [Métricas y Distancia Administrativa](04-redundancy-security/metrics-administrative-distance)
- [First Hop Redundancy (FHRP / HSRP)](04-redundancy-security/fhrp-hsrp)
- [Seguridad de Capa 2](04-redundancy-security/layer-2-security)

### [5. Wireless Networks (WLAN)](05-wireless-networks/)

Redes inalámbricas: arquitectura de puntos de acceso y controladores, configuración
de WLANs y seguridad inalámbrica.

- [Arquitectura de APs y WLC](05-wireless-networks/ap-wlc-architecture)
- [Configuración de WLANs y SSIDs](05-wireless-networks/wlan-ssid-configuration)
- [Seguridad Inalámbrica (WPA2 / WPA3)](05-wireless-networks/wireless-security)

### [6. IP Services and Maintenance](06-ip-services/)

Servicios IP y mantenimiento: NAT/PAT, DHCP/DNS/NTP y listas de control de acceso.

- [NAT / PAT](06-ip-services/nat-pat)
- [DHCP / DNS / NTP](06-ip-services/dhcp-dns-ntp)
- [Listas de Control de Acceso (ACLs)](06-ip-services/acls)
