---
title: Routing y Redundancia
description: "Routing y redundancia del plano de control: selection de ruta, métricas y distancia administrativa, OSPF avanzado y FHRP/HSRP para un gateway redundante."
---

Este módulo hace que el **routing** y el **gateway** de la red sean confiables:
por un lado, cómo el router elige la mejor ruta entre varias fuentes y diseña
OSPF más allá del área única; por otro, cómo garantizar que los hosts siempre
tengan un gateway disponible aunque un router falle.

## Temas del módulo

### Métricas y Distancia Administrativa

Cómo el router elige la mejor ruta cuando existen varias fuentes de información
de enrutamiento.

- [Métricas y Distancia Administrativa](./metrics-administrative-distance)

### OSPF avanzado (multi-área y punto a punto)

Diseños que escalan la red OSPF más allá del laboratorio: full-mesh punto a
punto sin DR/BDR y áreas con ABR resumiendo rutas.

- [OSPF avanzado](./ospf-advanced)

### First Hop Redundancy (FHRP / HSRP)

Proporciona un gateway por defecto redundante para los hosts, con HSRP, VRRP o
GLBP.

- [First Hop Redundancy (FHRP / HSRP)](./fhrp-hsrp)

## Repaso rápido

| Concepto          | Resumen                                            |
| :---------------- | :------------------------------------------------- |
| Distancia administrativa | Prioridad entre fuentes de enrutamiento     |
| HSRP              | IP virtual compartida para alta disponibilidad     |
| OSPF multi-área   | ABR resume entre áreas con LSA tipo 3 (`O IA`)    |

## Referencia rápida

- [Cheat Sheet (Referencia Técnica)](./cheat-sheet)

## Ejercicio

Aplica lo anterior a la red del módulo anterior con el
[Ejercicio: Gateway redundante (Parte 4)](./exercise).

Continúa con [el Módulo 7](../07-wireless-networks/) cuando el routing esté
resuelto y el gateway sea redundante.