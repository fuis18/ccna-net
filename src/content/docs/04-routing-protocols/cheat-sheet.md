---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Protocolos de Enrutamiento: rutas estáticas y default, distancia administrativa, protocolos OSPF/EIGRP/RIP y redistribución."
---

## Rutas en la tabla

| Origen        | Código                   | Cómo se aprende                |
| :------------ | :----------------------- | :----------------------------- |
| Conectada     | `C` (local `L`)          | Interfaz con IP                |
| Estática      | `S`                      | `ip route`                     |
| Dinámica      | `O`/`D`/`R`              | Protocolo                      |
| Redistribuida | `O E2` / `O E1` / `D EX` | Traducida desde otro protocolo |

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
| EIGRP (interna)   | 90  |
| OSPF              | 110 |
| RIP               | 120 |
| EIGRP (externa)   | 170 |
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
exit

do copy running-config startup-config
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

## Redistribución

Traduce rutas de un protocolo a otro en un router que corre ambos procesos.

```ios
# rutas EIGRP → OSPF (externas, sin métrica: quedan O E2 con métrica 20)
router ospf 1
redistribute eigrp 100 subnets

# rutas OSPF → EIGRP (la métrica es obligatoria: banda, retardo, conf, carga, MTU)
router eigrp 100
no auto-summary
redistribute ospf 1 metric 10000 100 255 1 1500
```

| Código | Significado                            | AD  |
| :----- | :------------------------------------- | :-- |
| `O E2` | Externa a OSPF, métrica fija (semilla) | 110 |
| `O E1` | Externa a OSPF, suma el coste interno  | 110 |
| `D EX` | Externa a EIGRP                        | 170 |

- `subnets` es obligatorio en OSPF para no perder las subredes (sin él solo
  redistribuye la clase mayor).
- Dos routers que se redistribuyen **mutuamente** pueden generar bucles: hay
  que filtrar con `route-map` o etiquetas.

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

show ip route ospf      # rutas O E2 / O E1 (redistribuidas)
show ip route eigrp     # rutas D / D EX
show ip protocols       # qué proceso corre cada router (redistribución incluida)
```

## Referencias

La teoría de traducir rutas entre protocolos está en
[Redistribución entre protocolos](./redistribution). Las **VLANs,
direccionamiento y subinterfaces** sobre las que se enrutan estas
rutas se describen en [Configuración de Red](../03-network-configuration/),
Módulo 3. La **redundancia del plano de conmutación** continúa en
[Switching y Seguridad](../05-switching-security/), Módulo 5, y la **selección
de ruta y OSPF avanzado** (multi-área y punto a punto) en
[Routing y Redundancia](../06-routing-redundancy/), Módulo 6.
