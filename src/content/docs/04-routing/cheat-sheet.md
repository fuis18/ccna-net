---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Routing: rutas estáticas y default, distancia administrativa, OSPF y FHRP/HSRP."
---

## Rutas en la tabla

| Origen | Código | Cómo se aprende |
| :--- | :--- | :--- |
| Conectada | `C` (local `L`) | Interfaz con IP |
| Estática | `S` | `ip route` |
| Dinámica | `O`/`D`/`R` | Protocolo |

## Rutas estáticas

```ios
# Sintaxis
ip route <red-destino> <máscara> {<IP-siguiente-salto> | <interfaz>} [AD]

ip route 10.0.0.0 255.0.0.0 192.168.1.2
ip route 10.1.0.0 255.255.0.0 GigabitEthernet0/1

# Ruta por defecto
ip route 0.0.0.0 0.0.0.0 192.168.1.254

# Ruta flotante (respaldo)
ip route 10.0.0.0 255.0.0.0 192.168.1.2
ip route 10.0.0.0 255.0.0.0 192.168.2.2 150
```

```ios
# IPv6
ipv6 unicast-routing
ipv6 route 2001:db8:10::/64 2001:db8:1::2
ipv6 route ::/0 2001:db8:1::254
```

## Distancia Administrativa (AD)

| Fuente | AD |
| :--- | :--- |
| Conectada | 0 |
| Estática | 1 |
| eBGP | 20 |
| EIGRP | 90 |
| OSPF | 110 |
| RIP | 120 |
| Flotante (manual) | 150 |
| iBGP | 200 |

Selección de ruta: **prefijo más largo → menor AD → menor métrica**.

## Métricas por protocolo

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

## OSPFv2

```ios
router ospf 1
 router-id 1.1.1.1
 network 192.168.1.0 0.0.0.255 area 0
 passive-interface default
 no passive-interface GigabitEthernet0/1
 exit
interface GigabitEthernet0/1
 ip ospf 1 area 0
```

### Multi-área (ABR)

```ios
interface GigabitEthernet0/0
 ip ospf 1 area 0
interface GigabitEthernet0/1
 ip ospf 1 area 1
```

### Datos OSPF

| Parámetro | Default |
| :--- | :--- |
| Hello / Dead | 10 s / 40 s |
| AD | 110 |
| Multicast hello | 224.0.0.5 |
| Router ID | `router-id` > loopback más alta > IP física más alta |

Estados vecinos: Down → Init → 2-Way → ExStart → Exchange → Loading → **Full**.

### Tipos de LSA

| LSA | Tipo | Anuncia |
| :--- | :--- | :--- |
| 1 | Router | Redes del propio router |
| 2 | Network | Red multiacceso (DR) |
| 3 | Summary | Redes de otras áreas (ABR) |
| 4 | ASBR | Ubicación del ASBR |
| 5 | External | Rutas externas |

```ios
show ip ospf neighbor
show ip route ospf
show ip ospf interface GigabitEthernet0/1
show ip protocols
```

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

VRRP:

```ios
interface GigabitEthernet0/0
 vrrp 1 ip 192.168.1.254
 vrrp 1 priority 150
 vrrp 1 preempt
```

```ios
show standby
```