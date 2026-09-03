---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Switching y Seguridad: STP/RSTP, EtherChannel y seguridad de capa 2."
---

## STP / RSTP

| Dato                       | Valor                                        |
| :------------------------- | :------------------------------------------- |
| Prioridad root por defecto | 32768 (pasos de 4096)                        |
| Bridge ID                  | Prioridad + MAC (menor gana)                 |
| Convergencia STP           | 30-50 s                                      |
| Convergencia RSTP          | 1-2 s                                        |
| Estados STP                | Blocking → Listening → Learning → Forwarding |
| Estados RSTP               | Discarding, Learning, Forwarding             |

### Roles de puerto

| Rol               | Descripción                                         |
| :---------------- | :-------------------------------------------------- |
| Root port         | Mejor camino hacia la raíz (uno por switch no raíz) |
| Designated port   | Mejor puerto del segmento                           |
| Blocked/Alternate | Respaldo, no reenvía                                |

### PVST / Rapid PVST

```ios
# SW1
spanning-tree mode rapid-pvst
spanning-tree vlan 10,30 root primary
spanning-tree vlan 20 root secondary

# access + PortFast + BPDU guard
int range f0/1 - 24
switchport host

# SW2
spanning-tree mode pvst
spanning-tree vlan 10,30 root secondary
spanning-tree vlan 20 root primary

int range f0/1 - 24
switchport host
```

### Multiple Spanning Tree (MST)

```ios
# Configuración de región - Identical
spanning-tree mode mst
spanning-tree mst configuration
name REGION1
revision 1
instance 1 vlan 10,30
instance 2 vlan 20
exit

# SW1
spanning-tree mst 1 root primary

# access + PortFast + BPDU guard
int range f0/1 - 24
switchport host

# SW1
spanning-tree mst 2 root secondary
int range f0/1 - 24
switchport host
```

### Verificación

```ios
show spanning-tree vlan 10
show spanning-tree mst 1
show spanning-tree summary
```

## EtherChannel

| Protocolo | Estándar          | Modos compatibles                            |
| :-------- | :---------------- | :------------------------------------------- |
| LACP      | IEEE 802.3ad      | `active`+`active` o `active`+`passive`       |
| PAgP      | Propietario Cisco | `desirable`+`desirable` o `desirable`+`auto` |
| on        | —                 | Forzado (ambos lados)                        |

Requisitos: misma velocidad, dúplex, VLAN y config de trunk en todos los puertos.

```ios
int range f0/1 - 4
channel-group 1 mode active
exit

int Port-channel 1
switchport mode trunk
switchport trunk native vlan 99
sw trunk allowed vlan 10,20,99
exit
```

```ios
int range f0/1 - 4
channel-group 1 mode passive
exit

int Port-channel 1
switchport mode trunk
switchport trunk native vlan 99
sw trunk allowed vlan 10,20,99
exit
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

| Ataque                  | Mitigación                                |
| :---------------------- | :---------------------------------------- |
| MAC flooding            | Port Security                             |
| DHCP starvation / rogue | DHCP Snooping                             |
| ARP spoofing            | DAI                                       |
| VLAN hopping            | `switchport nonegotiate`, trunks manuales |
| Switch no autorizado    | PortFast + BPDU guard, puertos apagados   |

### Port Security

```ios
interface range f0/1 - 24
switchport mode access
sw port-security
sw port-security maximum 2
sw port-security mac-address sticky
sw port-security violation restrict
```

Modos de violación: `protect` (descarta), `restrict` (descarta + log), `shutdown` (errdisable).

Recuperar errdisable: `shutdown` + `no shutdown`, o `errdisable recovery cause psecure-violation`.

### DHCP Snooping + DAI + IP Source Guard

```ios
# DHCP Snooping
ip dhcp snooping
ip dhcp snooping vlan 10,20
int g0/1
ip dhcp snooping trust
int range f0/1 - 12
ip dhcp snooping limit rate 10
exit

# Dynamic ARP Inspection (DAI)
ip arp inspection vlan 10,20
int g0/1
ip arp inspection trust
exit

# IP Source Guard (IPSG)
int range f0/1 - 12
ip verify source
exit
```

### Buenas prácticas

```ios
int range f0/10 - 24
shutdown

interface g0/1
switchport mode trunk
switchport nonegotiate

int range f0/1 - 24
storm-control broadcast level 20
```

```ios
show ip dhcp snooping
show ip arp inspection vlan 10
show port-security interface g0/1
```
