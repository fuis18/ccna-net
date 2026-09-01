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

Esta guía está organizada en 11 módulos que cubren los temas esenciales de redes.
Se recomienda seguirlos en orden, aunque cada capítulo puede consultarse de forma independiente.
Cada módulo (del 2 al 11) termina con un **ejercicio incremental** que retoma la
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

### [3. Configuración de Red (Switching & Direccionamiento)](03-network-configuration/)

El flujo de configuración de una red LAN en la capa 2 y su direccionamiento:
VLANs y trunking, direccionamiento IP en switch y router y subinterfaces
(router-on-a-stick) para enrutar entre VLANs.

- [VLANs y Trunking (802.1Q)](03-network-configuration/vlans-trunking)
- [Direccionamiento IP (Switch y Router)](03-network-configuration/addressing)
- [Subinterfaces (Router-on-a-Stick)](03-network-configuration/subinterfaces)

### [4. Protocolos de Enrutamiento](04-routing-protocols/)

Conexión de la red con otras redes: rutas estáticas y default, distancia
administrativa y protocolos de enrutamiento dinámico OSPF, EIGRP y RIP.

- [Rutas Estáticas y Default](04-routing-protocols/static-default-routes)
- [OSPF (Open Shortest Path First)](04-routing-protocols/ospf)
- [EIGRP y RIP](04-routing-protocols/eigrp-rip)

### [5. Redundancia y Seguridad](05-redundancy-security/)

Los temas que hacen que la red siga funcionando cuando algo falla o cuando
alguien intenta entrar: Spanning Tree, EtherChannel, métricas y distancia
administrativa, FHRP y seguridad de capa 2.

- [Spanning Tree Protocol (STP / RSTP)](05-redundancy-security/spanning-tree-protocol)
- [EtherChannel (LACP / PAgP)](05-redundancy-security/etherchannel)
- [Métricas y Distancia Administrativa](05-redundancy-security/metrics-administrative-distance)
- [OSPF avanzado (multi-área y punto a punto)](05-redundancy-security/ospf-avanzado)
- [First Hop Redundancy (FHRP / HSRP)](05-redundancy-security/fhrp-hsrp)
- [Seguridad de Capa 2](05-redundancy-security/layer-2-security)

### [6. Wireless Networks (WLAN)](06-wireless-networks/)

Redes inalámbricas: arquitectura de puntos de acceso y controladores, configuración
de WLANs y seguridad inalámbrica.

- [Arquitectura de APs y WLC](06-wireless-networks/ap-wlc-architecture)
- [Configuración de WLANs y SSIDs](06-wireless-networks/wlan-ssid-configuration)
- [Seguridad Inalámbrica (WPA2 / WPA3)](06-wireless-networks/wireless-security)

### [7. IP Services and Maintenance](07-ip-services/)

Servicios IP y mantenimiento: NAT/PAT, DHCP/DNS/NTP y listas de control de acceso.

- [NAT / PAT](07-ip-services/nat-pat)
- [Conexión al ISP (Enlaces WAN)](07-ip-services/conexion-isp)
- [DHCP / DNS / NTP](07-ip-services/dhcp-dns-ntp)
- [Listas de Control de Acceso (ACLs)](07-ip-services/acls)

### [8. QoS & Network Design](08-qos-network-design/)

Calidad de servicio y diseño de red jerárquico: algoritmos de encolamiento,
métricas de transmisión, capas Core/Distribution/Access y documentación.

- [Algoritmos de Encolamiento](08-qos-network-design/queuing-algorithms)
- [Calidad de Transmisión en Red](08-qos-network-design/network-transmission-quality)
- [Redes Jerárquicas y Escalables](08-qos-network-design/hierarchy-scalable-networks)
- [Documentación de Red](08-qos-network-design/network-documentation)

### [9. Network Management & Troubleshooting](09-management-troubleshooting/)

Gestión y diagnóstico de red: CDP/LLDP, SNMP, Syslog y metodología de
troubleshooting con herramientas Cisco.

- [Descubrimiento de Dispositivos (CDP / LLDP)](09-management-troubleshooting/cdp-lldp)
- [Monitoreo: SNMP y Syslog](09-management-troubleshooting/snmp-syslog)
- [Metodología de Troubleshooting](09-management-troubleshooting/troubleshooting-process)

### [10. Network Virtualization](10-network-virtualization/)

Virtualización de red: cloud computing, infraestructura virtual (VRF, GRE, VXLAN)
y Software-Defined Networking (SDN).

- [Cloud Computing](10-network-virtualization/cloud-computing)
- [Infraestructura Virtual de Red](10-network-virtualization/virtual-network-infra)
- [Software-Defined Networking (SDN)](10-network-virtualization/sdn)

### [11. Network Automation](11-network-automation/)

Automatización de red: APIs, formatos de datos, herramientas de configuración
(Ansible, Terraform), IBN y Cisco DNA Center.

- [Panorama de Automatización](11-network-automation/automation-overview)
- [APIs y Formatos de Datos](11-network-automation/apis-data-frames)
- [Herramientas de Gestión de Configuración](11-network-automation/config-management-tools)
- [IBN y Cisco DNA Center](11-network-automation/ibn-dna-center)
