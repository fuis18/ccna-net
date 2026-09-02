---
title: Métricas y Distancia Administrativa
description: "Selección de la mejor ruta: distancia administrativa entre fuentes, métricas por protocolo y verificación con show ip route."
---

Cuando existen **varias rutas hacia el mismo destino**, el router decide en dos
pasos: primero entre **fuentes** (distancia administrativa) y luego dentro de la
misma fuente (métrica). Este tema explica ambos conceptos.

## El orden de selección de ruta

1. **Prefijo más largo**: la ruta más específica coincide primero (ej. la
   `/32` gana a la `/24`).
2. **Distancia administrativa (AD)**: si hay varias fuentes, gana la de **AD
   menor**.
3. **Métrica**: si hay varias rutas de la misma fuente, gana la de **métrica
   menor**.

```R1# show ip route
S       10.0.0.0/8 [1/0] via 192.168.1.2
O       10.0.0.0/8 [110/2] via 192.168.1.3
```

En el ejemplo, la ruta **estática** (`S`, AD 1) gana a la **OSPF** (`O`, AD 110),
aunque el coste OSPF sea menor, porque la AD se evalúa primero.

## Distancia administrativa

La **AD** es un valor de fiabilidad de la **fuente** de la ruta: cuanto más
baja, más confiable.

| Fuente de ruta                  | AD por defecto    |
| :------------------------------ | :---------------- |
| Conectada (directa)             | 0                 |
| Estática                        | 1                 |
| eBGP                            | 20                |
| EIGRP                           | 90                |
| OSPF                            | 110               |
| RIP                             | 120               |
| Ruta estática flotante (manual) | 150 (configurada) |
| iBGP                            | 200               |

> Valor clave para el examen: **conectada 0, estática 1, eBGP 20, EIGRP 90,
> OSPF 110, RIP 120, iBGP 200**.

### Ejemplo: ruta flotante

Una ruta estática con **AD 150** solo aparece si la ruta principal (AD menor)
desaparece:

```ios
R1(config)# ip route 10.0.0.0 255.0.0.0 192.168.2.2 150
```

## Métrica por protocolo

La **métrica** compara rutas **dentro del mismo protocolo**. Cada protocolo usa
la suya:

| Protocolo | Métrica                                              | Menor valor = mejor |
| :-------- | :--------------------------------------------------- | :------------------ |
| OSPF      | **Coste** (banda de referencia / ancho de banda)     | Sí                  |
| EIGRP     | **Métrica compuesta** (banda + retardo, por defecto) | Sí                  |
| RIP       | **Número de saltos** (hops)                          | Sí                  |
| Estática  | 0                                                    | —                   |

## Metricas de OSPF y EIGRP en detalle

### OSPF: coste

$$
\text{coste} = \frac{100\,000 \text{ Kbps}}{\text{ancho de banda del enlace}}
$$

| Enlace   | Coste |
| :------- | :---- |
| 10 Mbps  | 100   |
| 100 Mbps | 10    |
| 1 Gbps   | 1     |

### EIGRP: métrica compuesta

Por defecto solo usa banda y retardo:

$$
\text{métrica} = \left( \frac{10^7}{\text{banda mínima}} + \text{retardo total} \right) \times 256
$$

## Modificar la métrica y la AD

```ios
R1(config-if)# bandwidth 1000000          # ajusta la banda (influye en el coste OSPF)
R1(config-if)# delay 10                   # retardo para EIGRP

R1(config)# ip route 10.0.0.0 255.0.0.0 192.168.1.2 200   # AD personalizada

R1(config)# router ospf 1
R1(config-router)# auto-cost reference-bandwidth 10000     # referencia para enlaces ≥1 Gbps
```

## Verificación

```R1# show ip route
Codes: C - connected, S - static, O - OSPF, E - EIGRP, R - RIP ...
       [AD/métrica] via <siguiente-salto>

S       10.0.0.0/8 [1/0] via 192.168.1.2
O       10.1.0.0/16 [110/3] via 192.168.1.3, 00:00:12, GigabitEthernet0/1
```

- `[1/0]` → AD 1, métrica 0 (estática).
- `[110/3]` → AD 110, coste 3 (OSPF).

```R1# show ip protocols
Routing Protocol is "ospf 1"
  ...
  Routing for Networks:
    192.168.1.0/24
  Routing Information Sources:
    Gateway        Distance      Last Update
    2.2.2.2             110      00:00:12
```

## Preguntas tipo CCNA

1. **¿Qué valor se evalúa primero: AD o métrica?**
   La **distancia administrativa** (entre fuentes); luego la **métrica**
   (dentro de la misma fuente).

2. **¿Cuál es la AD de OSPF y la de EIGRP?**
   OSPF **110**, EIGRP **90** (menor = más confiable).

3. **¿Una ruta estática gana a una OSPF aunque la OSPF tenga mejor métrica?**
   Sí: la estática tiene AD **1** frente a **110**, y la AD se evalúa primero.

4. **¿Qué métrica usa RIP y qué usa OSPF?**
   RIP usa **saltos (hops)**; OSPF usa el **coste** basado en ancho de banda.

5. **¿Cómo se crea una ruta estática de respaldo?**
   Con una **AD mayor** (ej. 150) en el `ip route`: solo aparece si la ruta
   principal falla.

## Resumen

- Selección: **prefijo más largo → menor AD → menor métrica**.
- **AD** = fiabilidad de la fuente (0 conectada, 1 estática, 110 OSPF, 120 RIP).
- **Métrica** = comparación dentro del mismo protocolo (coste OSPF, hops RIP).
- `show ip route` muestra `[AD/métrica]` por ruta; `show ip protocols` muestra
  el origen.
