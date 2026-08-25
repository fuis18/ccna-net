---
title: EIGRP y RIP
description: "EIGRP y RIP: métrica compuesta con DUAL y métrica por saltos, configuración, verificación y comparativa final con OSPF."
---

**OSPF** tiene su propio documento — [OSPF](./ospf) — porque es el protocolo
con más detalle del CCNA. Aquí van los otros dos: **EIGRP** (híbrido de Cisco)
y **RIP** (vector de distancia clásico), más simples que OSPF pero con sus
propios detalles de métrica y configuración.

## Estado de enlace vs. vector de distancia

| Aspecto       | OSPF (estado de enlace)   | EIGRP / RIP (vector de distancia) |
| :------------ | :------------------------ | :-------------------------------- |
| Conocimiento  | Topología completa (LSDB) | Solo "hacia dónde"                |
| Cálculo       | Algoritmo SPF             | Actualización hop a hop           |
| Convergencia  | Rápida                    | Variable                          |
| Escalabilidad | Grandes redes (áreas)     | Redes pequeñas/medianas           |

---

## EIGRP

**EIGRP** (Enhanced Interior Gateway Routing Protocol) es un protocolo **híbrido**
de Cisco: combina la velocidad de OSPF con la simplicidad de un vector de
distancia. Usa el algoritmo **DUAL**, que guarda rutas de respaldo
(_feasible successors_) para converger casi al instante.

### La métrica compuesta

Por defecto solo usa **banda mínima** y **retardo total**:

$$
\text{métrica} = \left( \frac{10^7}{\text{banda mínima}} + \text{retardo total} \right) \times 256
$$

Menor métrica = mejor ruta. El resto de factores (carga, confiabilidad) existe
pero queda desactivado por defecto.

### Configuración

```ios
R1(config)# router eigrp 100
R1(config-router)# network 192.168.1.0 0.0.0.255
R1(config-router)# network 10.0.0.0
R1(config-router)# no auto-summary
```

| Comando                    | Función                                      |
| :------------------------- | :------------------------------------------- |
| `router eigrp <as>`        | Inicia EIGRP (el número es el AS local)      |
| `network <red> [wildcard]` | Anuncia redes (wildcard opcional en EIGRP)   |
| `no auto-summary`          | No resume redes en su clase (imprescindible) |
| `passive-interface <if>`   | No envía hellos por esa interfaz             |

EIGRP también elige Router ID (loopback más alta > IP más alta) y usa hellos,
pero los intervalos van **por interfaz** (por defecto 5 s en LAN). No necesita
configurar áreas.

### Verificación EIGRP

```ios
R1# show ip eigrp neighbors
IP-EIGRP neighbors for process 100
Address       Interface      Hold Uptime   SRTT   RTO  Q  Seq
192.168.1.2   Gi0/1            13 00:04:15    1  200  0  12

R1# show ip route eigrp
D       10.0.0.0/8 [90/3328] via 192.168.1.2, 00:04:15, GigabitEthernet0/1
```

- `D` = ruta EIGRP (DUAL), `[90/3328]` = AD 90 / métrica compuesta 3328.

---

## RIP

**RIP** (Routing Information Protocol) es el protocolo de enrutamiento más
antiguo y simple: un **vector de distancia** puro cuya métrica es el **número
de saltos** (hops). Sirve sobre todo como concepto y para redes muy pequeñas.

### Configuración

```ios
R1(config)# router rip
R1(config-router)# version 2
R1(config-router)# network 192.168.1.0
R1(config-router)# no auto-summary
```

| Comando                  | Función                                   |
| :----------------------- | :---------------------------------------- |
| `router rip`             | Inicia el proceso RIP                     |
| `version 2`              | Usa RIPv2 (subredes y autenticación)      |
| `network <red>`          | Anuncia la red **en clase**               |
| `no auto-summary`        | No resume a la clase de la red            |
| `passive-interface <if>` | No envía actualizaciones por esa interfaz |

> `network` en RIP recibe la red **en clase** (sin wildcard): `network 10.0.0.0`
> anuncia las interfaces que caigan en esa clase, no una subred concreta.

### Verificación RIP

```ios
R1# show ip route rip
R       10.0.0.0/8 [120/1] via 192.168.1.2, 00:00:09, GigabitEthernet0/1
```

- `R` = ruta RIP, `[120/1]` = AD 120 / 1 salto.
- RIP actualiza cada **30 s** y descarta rutas a más de **15 saltos**
  (infinito = 16).

---

## Comparativa final

| Protocolo | Tipo                | Métrica              | AD  | Convergencia | Configuración               |
| :-------- | :------------------ | :------------------- | :-- | :----------- | :-------------------------- |
| OSPF      | Estado de enlace    | Coste (banda)        | 110 | Rápida       | `router ospf <pid>` + áreas |
| EIGRP     | Híbrido (DUAL)      | Banda + retardo ×256 | 90  | Muy rápida   | `router eigrp <as>`         |
| RIP       | Vector de distancia | Saltos (hops)        | 120 | Lenta        | `router rip` + `version 2`  |

Recordatorio de la selección de ruta: **prefijo más largo → menor AD → menor
métrica** (ver [Métricas y Distancia Administrativa](../04-redundancy-security/metrics-administrative-distance)).

## Preguntas tipo CCNA

1. **¿Cuál es la métrica de EIGRP y la de RIP?**
   EIGRP usa la **métrica compuesta** (banda mínima + retardo, ×256); RIP usa
   el **número de saltos** (máximo 15).

2. **¿Qué ventaja da el algoritmo DUAL a EIGRP?**
   Guarda rutas de respaldo (**feasible successors**) listas, así que converge
   casi al instante ante una falla.

3. **¿Cuál es la distancia administrativa de OSPF, EIGRP y RIP?**
   OSPF **110**, EIGRP **90**, RIP **120** (menor = más confiable).

4. **¿Qué comando inicia cada protocolo?**
   `router ospf <pid>`, `router eigrp <as>` y `router rip` (con `version 2`).

5. **¿Por qué es imprescindible `no auto-summary`?**
   Sin él, ambos protocolos resumen las redes a su **clase** y rompen el
   subnetting (rutas discontinuas que no se anuncian bien).

## Resumen

- Los protocolos **dinámicos** aprenden y mantienen las rutas solos; los
  estáticos hay que escribirlos a mano.
- **EIGRP** (híbrido): métrica compuesta (banda + retardo ×256), AD 90,
  respaldo automático con DUAL; no usa áreas.
- **RIP** (vector de distancia): saltos como métrica, AD 120, máximo 15 saltos;
  actualiza cada 30 s.
- Selección de ruta: **prefijo más largo → menor AD → menor métrica**.
- Se verifica con `show ip route`, `show ip eigrp neighbors` y
  `show ip route rip` según protocolo.
