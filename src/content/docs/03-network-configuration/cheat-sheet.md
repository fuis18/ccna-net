---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Configuración de Red: VLANs y trunks, direccionamiento de switch y router, y subinterfaces (router-on-a-stick)."
---

## Tipos de VLAN

| VLAN        | Descripción                                    |
| :---------- | :--------------------------------------------- |
| Por defecto | VLAN 1, no se puede borrar ni renombrar        |
| Datos       | Tráfico de usuarios                            |
| Gestión     | Administración (SSH, telnet)                   |
| Nativa      | En trunk, tramas sin etiqueta (default VLAN 1) |
| Voz         | Teléfonos IP (QoS)                             |

802.1Q: etiqueta de 4 bytes; VID de 12 bits → hasta **4094** VLANs.

## Configuración de VLANs

```ios
vlan 10
name Ventas
vlan 20
name Systems
vlan 99
name Administrative

interface range f0/1 - 12
switchport mode access
switchport access vlan 10

interface range f0/1 - 24
switchport mode access
switchport access vlan 10

interface range g0/1 - 2
switchport mode trunk
switchport trunk native vlan 99
switchport trunk allowed vlan 10,20,99
```

## VLAN de voz

```ios
interface GigabitEthernet0/3
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 100
```

## Direccionamiento del switch (SVI)

```ios
interface vlan 1
# ip add sw mask
ip address 192.168.10.1 255.255.255.0
no shutdown
exit

# Switch capa 2 (sin ip routing): gateway obligatorio
ip default-gateway 192.168.99.2

# Switch multicapa: habilita enrutar entre VLANs
ip routing

do copy running-config startup-config
```

```ios
interface vlan 10
# ip add sw mask
ip address 192.168.10.1 255.255.255.0
no shutdown

interface vlan 99
ip address 192.168.99.1 255.255.255.0
no shutdown
exit

# Switch capa 2 (sin ip routing): gateway obligatorio
ip default-gateway 192.168.99.2

# Switch multicapa: habilita enrutar entre VLANs
ip routing

do copy running-config startup-config
```

## Direccionamiento del router (interfaz física)

```ios
int g0/1
# ip add gw mask
ip address 192.168.10.1 255.255.255.0
no shutdown

int s0/0/0
ip address 192.168.20.1 255.255.255.252
no shutdown
```

## Subinterfaces (Router-on-a-Stick)

```ios
interface g0/1
no shutdown

interface g0/1.10
encapsulation dot1q 10
# ip address GW mask
ip address 192.168.10.1 255.255.255.0

interface g0/1.20
encapsulation dot1q 20
ip address 192.168.20.1 255.255.255.0
exit

# VLAN nativa
interface g0/1
ip address 192.168.99.1 255.255.255.0
```

Del lado del switch, hacia el router: puerto **trunk** con las VLANs permitidas.

## Verificación switching / direccionamiento

```ios
show vlan brief
show interfaces trunk
show ip interface brief
# router
show vlans
```

## Referencias del siguiente módulo

La **tabla de enrutamiento** (rutas conectadas, estáticas, OSPF, EIGRP y RIP),
las rutas estáticas y la distancia administrativa se cubren en
[Protocolos de Enrutamiento](../04-routing-protocols/), Módulo 4.
