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

Esta guía está organizada en 12 módulos que cubren los temas esenciales de redes.
Se recomienda seguirlos en orden, aunque cada capítulo puede consultarse de forma independiente.
Cada módulo (del 2 al 12) termina con un **ejercicio incremental** que retoma la
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

### [5. Switching y Seguridad](05-switching-security/)

Los temas que hacen que la **capa de conmutación** siga funcionando cuando algo
falla o cuando alguien intenta entrar: Spanning Tree, EtherChannel y seguridad
de capa 2.

- [Spanning Tree Protocol (STP / RSTP)](05-switching-security/spanning-tree-protocol)
- [EtherChannel (LACP / PAgP)](05-switching-security/etherchannel)
- [Seguridad de Capa 2](05-switching-security/layer-2-security)

### [6. Routing y Redundancia](06-routing-redundancy/)

Redundancia del plano de control y del gateway: selección de ruta (métricas y
distancia administrativa), OSPF avanzado y protocolos FHRP (HSRP) para un
gateway por defecto redundante.

- [Métricas y Distancia Administrativa](06-routing-redundancy/metrics-administrative-distance)
- [OSPF avanzado (multi-área y punto a punto)](06-routing-redundancy/ospf-avanzado)
- [First Hop Redundancy (FHRP / HSRP)](06-routing-redundancy/fhrp-hsrp)

### [7. Wireless Networks (WLAN)](07-wireless-networks/)

Redes inalámbricas: arquitectura de puntos de acceso y controladores, configuración
de WLANs y seguridad inalámbrica.

- [Arquitectura de APs y WLC](07-wireless-networks/ap-wlc-architecture)
- [Configuración de WLANs y SSIDs](07-wireless-networks/wlan-ssid-configuration)
- [Seguridad Inalámbrica (WPA2 / WPA3)](07-wireless-networks/wireless-security)

### [8. IP Services and Maintenance](08-ip-services/)

Servicios IP y mantenimiento: NAT/PAT, DHCP/DNS/NTP y listas de control de acceso.

- [NAT / PAT](08-ip-services/nat-pat)
- [Conexión al ISP (Enlaces WAN)](08-ip-services/conexion-isp)
- [DHCP / DNS / NTP](08-ip-services/dhcp-dns-ntp)
- [Listas de Control de Acceso (ACLs)](08-ip-services/acls)

### [9. QoS & Network Design](09-qos-network-design/)

Calidad de servicio y diseño de red jerárquico: algoritmos de encolamiento,
métricas de transmisión, capas Core/Distribution/Access y documentación.

- [Algoritmos de Encolamiento](09-qos-network-design/queuing-algorithms)
- [Calidad de Transmisión en Red](09-qos-network-design/network-transmission-quality)
- [Redes Jerárquicas y Escalables](09-qos-network-design/hierarchy-scalable-networks)
- [Documentación de Red](09-qos-network-design/network-documentation)

### [10. Network Management & Troubleshooting](10-management-troubleshooting/)

Gestión y diagnóstico de red: CDP/LLDP, SNMP, Syslog y metodología de
troubleshooting con herramientas Cisco.

- [Descubrimiento de Dispositivos (CDP / LLDP)](10-management-troubleshooting/cdp-lldp)
- [Monitoreo: SNMP y Syslog](10-management-troubleshooting/snmp-syslog)
- [Metodología de Troubleshooting](10-management-troubleshooting/troubleshooting-process)

### [11. Network Virtualization](11-network-virtualization/)

Virtualización de red: cloud computing, infraestructura virtual (VRF, GRE, VXLAN)
y Software-Defined Networking (SDN).

- [Cloud Computing](11-network-virtualization/cloud-computing)
- [Infraestructura Virtual de Red](11-network-virtualization/virtual-network-infra)
- [Software-Defined Networking (SDN)](11-network-virtualization/sdn)

### [12. Network Automation](12-network-automation/)

Automatización de red: APIs, formatos de datos, herramientas de configuración
(Ansible, Terraform), IBN y Cisco DNA Center.

- [Panorama de Automatización](12-network-automation/automation-overview)
- [APIs y Formatos de Datos](12-network-automation/apis-data-frames)
- [Herramientas de Gestión de Configuración](12-network-automation/config-management-tools)
- [IBN y Cisco DNA Center](12-network-automation/ibn-dna-center)
