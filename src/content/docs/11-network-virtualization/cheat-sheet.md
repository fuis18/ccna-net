---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Network Virtualization: cloud computing, VRF, GRE, VXLAN y SDN."
---

## Modelos de servicio cloud

| Modelo | Usuario administra | Ejemplo |
| :----- | :----------------- | :------ |
| IaaS | SO, apps, datos | AWS EC2, Azure VM |
| PaaS | Apps, datos | Heroku, App Engine |
| SaaS | Solo usa | Gmail, Office 365 |

## Modelos de despliegue

| Modelo | Propiedad | Seguridad |
| :----- | :-------- | :-------- |
| Private | Una organización | Alto control |
| Public | Proveedor (multi-tenant) | Compartido |
| Hybrid | Combinación | Flexible |

## Hypervisors

| Tipo | Instalación | Rendimiento | Ejemplo |
| :--- | :---------- | :---------- | :------ |
| Tipo 1 | Bare-metal | Alto | ESXi, Hyper-V, KVM |
| Tipo 2 | Sobre SO | Medio | VirtualBox, Workstation |

## VRF

```ios
vrf definition <nombre>
 rd <ASN>:<id>
 address-family ipv4
  route-target export <target>
  route-target import <target>

interface <iface>
 vrf forwarding <nombre>
 ip address <ip> <mask>

show vrf
show ip route vrf <nombre>
ping vrf <nombre> <ip>
```

## GRE

```ios
interface Tunnel0
 ip address <ip> <mask>
 tunnel source <ip-fuente>
 tunnel destination <ip-destino>
 tunnel mode gre ip

ip route <red-destino> <mascara> <ip-tunnel>
show interface Tunnel0
show tunnel interface Tunnel0
```

## VXLAN

| Concepto | Descripción |
| :------- | :---------- |
| VTEP | Tunnel Endpoint (físico o virtual) |
| VNI | Network Identifier (24 bits, 16M segmentos) |
| Underlay | Red física IP que transporta VXLAN |
| Overlay | Red virtual L2 sobre el underlay |
| UDP Port | 4789 |

```ios
show nve peers
show nve interface nve 1
show vxlan vni
```

## SDN

| Capa | Función | Ejemplo |
| :--- | :------ | :------ |
| Application | Apps de red | Cisco APIC-EM |
| Control | Controlador centralizado | OpenDaylight, ONOS |
| Infrastructure | Dispositivos forwarding | Switches OpenFlow |

| API | Dirección | Protocolo |
| :-- | :-------- | :-------- |
| Northbound | App → Controlador | REST |
| Southbound | Controlador → Dispositivos | OpenFlow, NETCONF, gNMI |

## Cisco ACI

| Componente | Función |
| :--------- | :------ |
| APIC | Controlador central |
| Spine | Backbone de alto rendimiento |
| Leaf | Acceso a servidores/VMs |
| EPG | Endpoint Group (grupo de endpoints) |
| Contract | Reglas entre EPGs |

## Overlay vs Underlay

| Capa | Underlay | Overlay |
| :--- | :------- | :------ |
| Física | OSPF, BGP | - |
| Virtual | - | VXLAN, GRE |
| Propósito | Transporte | Segmentación |

## Comandos verificación

```ios
show vrf                                # VRFs configuradas
show ip route vrf <nombre>              # Rutas de una VRF
show interface Tunnel0                  # Estado de túnel GRE
show nve peers                          # VTEPs vecinos (VXLAN)
show vxlan vni                          # VNIs activos
show mac address-table                  # MACs (incluidas por VXLAN)
show ip ospf neighbor                   # Underlay routing
```
