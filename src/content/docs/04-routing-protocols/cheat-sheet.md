---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Protocolos de Enrutamiento: rutas estáticas y default, distancia administrativa y protocolos OSPF/EIGRP/RIP."
---

## Rutas en la tabla

| Origen    | Código          | Cómo se aprende |
| :-------- | :-------------- | :-------------- |
| Conectada | `C` (local `L`) | Interfaz con IP |
| Estática  | `S`             | `ip route`      |
| Dinámica  | `O`/`D`/`R`     | Protocolo       |

## Rutas estáticas

```ios
# Ethernet
# ip route <destination> <mask> <hop>
ip route 10.0.0.0 255.0.0.0 192.168.2.2

# Punto a punto
ip route 10.0.0.0 255.0.0.0 Serial0/0/1

# Cualquier otra ruta no declarada
ip route 0.0.0.0 0.0.0.0 192.168.1.254
ip route 0.0.0.0 0.0.0.0 Serial0/0/0

# Ruta flotante (respaldo)
ip route 10.0.0.0 255.0.0.0 192.168.2.2 150

# IPv6
ipv6 route 2001:db8:10::/64 2001:db8:1::2
ipv6 route ::/0 2001:db8:1::254
```

## Distancia Administrativa (AD)

| Fuente            | AD  |
| :---------------- | :-- |
| Conectada         | 0   |
| Estática          | 1   |
| EIGRP             | 90  |
| OSPF              | 110 |
| RIP               | 120 |
| Flotante (manual) | 150 |
| iBGP              | 200 |

Selección de ruta: **prefijo más largo → menor AD → menor métrica**.

## OSPFv2

```ios
router ospf 1
router-id 1.1.1.1
passive-interface default
no passive-interface s0/0/0
exit

interface g0/1
ip ospf 1 area 0

interface g0/2
ip ospf 1 area 1

int g0/1.10
ip ospf 1 area 0

int g0/1.20
ip ospf 1 area 0

int g0/1.99
ip ospf 1 area 0
```

| Dato            | Valor                                                |
| :-------------- | :--------------------------------------------------- |
| Hello / Dead    | 10 s / 40 s                                          |
| Métrica         | Coste = 100 000 / ancho de banda                     |
| Multicast hello | 224.0.0.5                                            |
| Router ID       | `router-id` > loopback más alta > IP física más alta |

Estados vecinos: Down → Init → 2-Way → ExStart → Exchange → Loading → **Full**.

### Tipos de LSA

| LSA | Tipo     | Anuncia                    |
| :-- | :------- | :------------------------- |
| 1   | Router   | Redes del propio router    |
| 2   | Network  | Red multiacceso (DR)       |
| 3   | Summary  | Redes de otras áreas (ABR) |
| 4   | ASBR     | Ubicación del ASBR         |
| 5   | External | Rutas externas             |

## EIGRP

```ios
router eigrp 100
eigrp router-id 1.1.1.1
passive-interface default
no passive-interface s0/0/0
no passive-interface s0/0/1

network 192.168.1.0 0.0.0.255

no auto-summary
```

- AD **90**. Métrica = (10⁷ / banda mínima + retardo total) × 256.
- Código en la tabla: `D`. Vecinos: `show ip eigrp neighbors`.

## RIP

```ios
router rip
 version 2
 network 192.168.1.0
 no auto-summary
```

- AD **120**. Métrica = **saltos** (máx. 15; 16 = inalcanzable).
- Código en la tabla: `R`. Actualiza cada 30 s.

## Comparativa de protocolos

| Protocolo | Tipo                | Métrica              | AD  |
| :-------- | :------------------ | :------------------- | :-- |
| OSPF      | Estado de enlace    | Coste (banda)        | 110 |
| EIGRP     | Híbrido (DUAL)      | Banda + retardo ×256 | 90  |
| RIP       | Vector de distancia | Saltos               | 120 |

## Verificación routing

```ios
show ip route
show ip route static
show ip protocols

show ip route ospf
show ip ospf neighbor
show ip ospf database

show ip route eigrp
show ip eigrp neighbors

show ip route rip
```

## Referencias

Las **VLANs, direccionamiento y subinterfaces** sobre las que se enrutan estas
rutas se describen en [Configuración de Red](../03-network-configuration/),
Módulo 3. La **redundancia y OSPF avanzado** (multi-área y punto a punto)
continúan en [Redundancia y Seguridad](../05-redundancy-security/), Módulo 5.
