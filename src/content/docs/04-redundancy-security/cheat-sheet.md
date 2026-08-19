---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Redundancia y Seguridad: STP/RSTP, EtherChannel, métricas y distancia administrativa, FHRP/HSRP y seguridad de capa 2."
---

## STP / RSTP

| Dato | Valor |
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

## Métricas y Distancia Administrativa

| Fuente | AD |
| :--- | :--- |
| Conectada | 0 |
| Estática | 1 |
| EIGRP | 90 |
| OSPF | 110 |
| RIP | 120 |
| Flotante (manual) | 150 |
| iBGP | 200 |

### Métricas por protocolo

| Protocolo | Métrica |
| :--- | :--- |
| OSPF | Coste = 100 000 / ancho de banda (10 Mbps=100, 100 Mbps=10, 1 Gbps=1) |
| EIGRP | Banda mínima + retardo, ×256 |
| RIP | Saltos (hops) |

```ios
interface GigabitEthernet0/1
 bandwidth 1000000        # ajusta coste OSPF
 delay 10                 # retardo EIGRP

router ospf 1
 auto-cost reference-bandwidth 10000   # para enlaces >= 1 Gbps
```

Selección de ruta: **prefijo más largo → menor AD → menor métrica**. `show ip route` muestra `[AD/métrica]`.

## FHRP / HSRP

| Protocolo | Estándar | Roles | Balanceo |
| :--- | :--- | :--- | :--- |
| HSRP | Cisco | Active / Standby | No |
| VRRP | RFC 3768 | Master / Backup | No |
| GLBP | Cisco | AVG / AVF | Sí |

```ios
interface GigabitEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 standby version 2
 standby 1 ip 192.168.1.254
 standby 1 priority 150
 standby 1 preempt
 standby 1 track GigabitEthernet0/1 30
```

| Comando | Función |
| :--- | :--- |
| `standby <g> ip <IP>` | IP virtual del grupo |
| `standby <g> priority <n>` | Mayor prioridad = Active (default 100) |
| `standby <g> preempt` | Recuperar el papel de Active |
| `standby <g> track <if> <decr>` | Reduce prioridad si cae el enlace |

```ios
show standby
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