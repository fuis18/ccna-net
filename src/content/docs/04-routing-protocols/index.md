---
title: Protocolos de Enrutamiento
description: "Conectar la red con otras redes: rutas estáticas y default, distancia administrativa y protocolos de enrutamiento dinámico OSPF, EIGRP y RIP."
---

Una vez que la LAN del edificio está configurada — segmentada con VLANs,
direccionada y enrutada entre VLANs por subinterfaces ([Módulo 3](../03-network-configuration/)) —
este módulo la conecta con el resto de la red: primero con rutas estáticas y la
ruta por defecto, y luego con protocolos de enrutamiento dinámico (OSPF, EIGRP
y RIP) que aprenden y mantienen las rutas de forma automática.

## Temas del módulo

### Rutas Estáticas y Default

Define rutas de forma manual y la ruta por defecto que captura el tráfico sin
destino específico en la tabla de enrutamiento.

- [Rutas Estáticas y Default](./static-default-routes)

### OSPF

Estado de enlace: LSA/LSDB, métrica de coste, determinación del Router ID,
elección de DR/BDR y configuración de un área única. Los diseños avanzados
(full-mesh punto a punto y multi-área) continúan en
[OSPF avanzado](../06-routing-redundancy/ospf-avanzado), Módulo 6.

- [OSPF (Open Shortest Path First)](./ospf)

### EIGRP y RIP

Vector de distancia: la métrica compuesta de EIGRP con respaldo DUAL y los
saltos de RIP, con comparativa final entre los tres protocolos.

- [EIGRP y RIP](./eigrp-rip)

### Redistribución

Qué pasa cuando dos protocolos conviven en la misma red: rutas externas
(`O E2`, `D EX`), traducción de métricas y configuración en el router que corre
OSPF y EIGRP a la vez.

- [Redistribución entre protocolos](./redistribution)

## Repaso rápido

| Concepto         | Resumen                                      |
| :--------------- | :------------------------------------------- |
| Ruta estática    | Ruta configurada manualmente                 |
| Ruta default     | Ruta `0.0.0.0/0` para tráfico sin coincidencia |
| OSPF / EIGRP / RIP | Protocolos dinámicos (AD 110 / 90 / 120)   |

## Referencia rápida

- [Cheat Sheet (Referencia Técnica)](./cheat-sheet)

## Ejercicio

Levanta la red completa del módulo: VLANs y router-on-a-stick, OSPF en un
dominio y EIGRP en el otro, con el
[Ejercicio: Routing entre Redes](./exercise), que termina en la
**redistribución** de rutas entre ambos protocolos en R2.

Continúa con [el Módulo 5: Switching y Seguridad](../05-switching-security/)
cuando la red enrute entre redes.
