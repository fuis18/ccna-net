---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Switching: VLANs y trunks, STP/RSTP, EtherChannel y seguridad de capa 2."
---

## Tipos de VLAN

| VLAN | Descripción |
| :--- | :--- |
| Por defecto | VLAN 1, no se puede borrar ni renombrar |
| Datos | Tráfico de usuarios |
| Gestión | Administración (SSH, telnet) |
| Nativa | En trunk, tramas sin etiqueta (default VLAN 1) |
| Voz | Teléfonos IP (QoS) |

802.1Q: etiqueta de 4 bytes; VID de 12 bits → hasta **4094** VLANs.

## Configuración de VLANs

```ios
vlan 10
 name Ventas
 exit
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10

interface range GigabitEthernet0/1 - 24
 switchport mode access
 switchport access vlan 20
```

## Trunk 802.1Q

```ios
interface GigabitEthernet0/24
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
```

## VLAN de voz

```ios
interface GigabitEthernet0/5
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 100
```

## Verificación switching

```ios
show vlan brief
show interfaces trunk
show interfaces status
show mac address-table
```

## STP / RSTP

| Datos | Valor |
| :--- | :--- |
| Prioridad root por defecto | 32768 (pasos de 4096) |
| Bridge ID | Prioridad + MAC (menor gana) |
| Convergencia STP | 30-50 s |
| Convergencia RSTP | 1-2 s |
| Estados STP | Blocking → Listening → Learning → Forwarding |
| Estados RSTP | Discarding, Learning, Forwarding |

### Roles de puerto

| Rol | Descripción |
| :--- | :--- |
| Root port | Mejor camino hacia la raíz (uno por switch no raíz) |
| Designated port | Mejor puerto del segmento |
| Blocked/Alternate | Respaldo, no reenvía |

```ios
spanning-tree mode rapid-pvst
spanning-tree vlan 10,20 root primary
spanning-tree vlan 30 priority 24576

interface GigabitEthernet0/1
 spanning-tree portfast
 spanning-tree bpduguard enable

interface range Gi0/1 - 24
 switchport host        # access + PortFast + BPDU guard
```

```ios
show spanning-tree vlan 10
```

## EtherChannel

| Protocolo | Estándar | Modos compatibles |
| :--- | :--- | :--- |
| LACP | IEEE 802.3ad | `active`+`active` o `active`+`passive` |
| PAgP | Propietario Cisco | `desirable`+`desirable` o `desirable`+`auto` |
| on | — | Forzado (ambos lados) |

Requisitos: misma velocidad, dúplex, VLAN y config de trunk en todos los puertos.

```ios
interface range GigabitEthernet0/1 - 4
 channel-group 1 mode active
 exit
interface Port-channel 1
 switchport mode trunk
 switchport trunk allowed vlan 10,20
```

Balanceo:

```bash
port-channel load-balance src-dst-ip    # default
```

```ios
show etherchannel summary      # (SU)=up, (P)=bundled
show etherchannel load-balance
```

## Seguridad de capa 2

| Ataque | Mitigación |
| :--- | :--- |
| MAC flooding | Port Security |
| DHCP starvation / rogue | DHCP Snooping |
| ARP spoofing | DAI |
| VLAN hopping | `switchport nonegotiate`, trunks manuales |
| Switch no autorizado | PortFast + BPDU guard, puertos apagados |

### Port Security

```ios
interface GigabitEthernet0/1
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security mac-address sticky
 switchport port-security violation restrict
```

Modos de violación: `protect` (descarta), `restrict` (descarta + log), `shutdown` (errdisable).

Recuperar errdisable: `shutdown` + `no shutdown`, o `errdisable recovery cause psecure-violation`.

### DHCP Snooping + DAI + IP Source Guard

```ios
ip dhcp snooping
ip dhcp snooping vlan 10,20
interface GigabitEthernet0/24
 ip dhcp snooping trust
interface range Gi0/1 - 23
 ip dhcp snooping limit rate 10

ip arp inspection vlan 10,20
interface GigabitEthernet0/24
 ip arp inspection trust

interface GigabitEthernet0/1
 ip verify source
```

### Buenas prácticas

```ios
interface range Gi0/1 - 24
 shutdown

interface Gi0/24
 switchport mode trunk
 switchport nonegotiate

interface Gi0/1
 storm-control broadcast level 20
```

```ios
show ip dhcp snooping
show ip arp inspection vlan 10
show port-security interface Gi0/1
```