---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Routing y Redundancia: OSPF avanzado, métricas y distancia administrativa, y FHRP/HSRP."
---

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

## OSPF avanzado

### Multi-área

| LSA | Tipo | Anuncia |
| :--- | :--- | :--- |
| 1 | Router LSA | Las redes del propio router |
| 2 | Network LSA | La red multiacceso (la anuncia el DR) |
| 3 | Summary LSA | Redes de otras áreas — la genera el ABR |
| 4 | ASBR LSA | Ubicación del ASBR |
| 5 | External LSA | Rutas externas (redistribución) |

- El **área 0** (backbone) es el único tránsito entre áreas — nunca conexión directa área-a-área.
- Rutas inter-área se identifican como **`O IA`** en `show ip route`.
- El **ABR** (Area Border Router) resume entre áreas con LSA tipo 3.

### Punto a punto

```ios
interface GigabitEthernet0/1
 ip ospf network point-to-point   # sin elección de DR/BDR
```

Adyacencias en enlaces punto a punto llegan a `FULL/ -` sin pasar por `2-Way`.

```ios
show ip ospf neighbor      # estado FULL/ - en enlaces p2p
show ip route ospf         # O intra-área, O IA inter-área
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

```ios
show standby
```