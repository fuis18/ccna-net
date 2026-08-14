---
title: Routing
description: "Enrutamiento entre redes: rutas estáticas y default, OSPFv2, métricas, distancia administrativa y FHRP."
---

Este módulo cubre cómo los routers deciden por dónde enviar cada paquete: rutas
estáticas y default, el protocolo de enrutamiento dinámico OSPFv2, la selección
de mejor ruta y la redundancia del gateway con protocolos FHRP.

## Temas del módulo

### Rutas Estáticas y Default

Define rutas de forma manual y la ruta por defecto que captura el tráfico sin
destino específico en la tabla de enrutamiento.

- [Rutas Estáticas y Default](./static-default-routes)

### OSPFv2 (Área Única y Multi-área)

Protocolo de enrutamiento dinámico de estado de enlace que intercambia LSAs y
calcula la mejor ruta con el algoritmo SPF (Dijkstra).

- [OSPFv2 (Área Única y Multi-área)](./ospfv2)

### Métricas y Distancia Administrativa

Cómo el router elige la mejor ruta cuando existen varias fuentes de información
de enrutamiento.

- [Métricas y Distancia Administrativa](./metrics-administrative-distance)

### First Hop Redundancy (FHRP / HSRP)

Proporciona un gateway por defecto redundante para los hosts, con HSRP, VRRP o
GLBP.

- [First Hop Redundancy (FHRP / HSRP)](./fhrp-hsrp)

## Repaso rápido

| Concepto               | Resumen                                              |
| :--------------------- | :--------------------------------------------------- |
| Ruta estática          | Ruta configurada manualmente                         |
| Ruta default           | Ruta `0.0.0.0/0` para tráfico sin coincidencia       |
| OSPFv2                 | Enrutamiento dinámico de estado de enlace             |
| Distancia administrativa | Prioridad entre fuentes de enrutamiento            |
| HSRP                   | IP virtual compartida para alta disponibilidad       |

Continúa con [el Módulo 5](../05-wireless-networks/) cuando domines el enrutamiento.
