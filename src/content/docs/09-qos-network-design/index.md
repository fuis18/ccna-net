---
title: QoS & Network Design
description: "Quality of Service y diseño de red jerárquico: algoritmos de encolamiento, métricas de transmisión, capas jerárquicas y documentación."
---

Este módulo cubre dos áreas fundamentales para construir una red profesional:
cómo garantizar la **calidad de servicio** (QoS) del tráfico y cómo **diseñar
la red** de forma jerárquica, escalable y documentada.

## Temas del módulo

### Algoritmos de Encolamiento (Queuing)

Cuando la congestión ocurre, los dispositivos deciden qué paquetes van primero.
Aprende FIFO, PQ, CQ, WFQ, CBWFQ y LLQ, y cómo clasificar tráfico con
DSCP/CoS.

- [Algoritmos de Encolamiento](./queuing-algorithms)

### Calidad de Transmisión en Red (QoS)

Bandwidth, delay, jitter y packet loss: las métricas que definen la experiencia
del usuario. Modelos Best-Effort, IntServ y DiffServ, y configuración de QoS
en switches y routers Cisco.

- [Calidad de Transmisión en Red](./network-transmission-quality)

### Redes Jerárquicas y Escalables

Core, Distribution y Access: las capas de una red profesional, por qué importan
y cómo se diseñan. Hardware de switching (ASICs, TCAM, CEF) y cómo escalar
sin romper la arquitectura.

- [Redes Jerárquicas y Escalables](./hierarchy-scalable-networks)

### Documentación de Red

La red sin documentación es una caja negra. Topology diagrams, tablas de
direccionamiento, gestión de cambios y baselines operacionales.

- [Documentación de Red](./network-documentation)

## Repaso rápido

| Concepto | Resumen |
| :------- | :------ |
| FIFO | Encolamiento por defecto, sin prioridades |
| WFQ | Pesos por flujo, equitativo |
| CBWFQ | Clases definidas por el administrador |
| LLQ | CBWFQ + cola estricta para tiempo real |
| DSCP/CoS | Marcar paquetes para clasificación QoS |
| Core | Troncal de alta velocidad |
| Distribution | Resumen y políticas entre capas |
| Access | Conexión directa de hosts |

## Ejercicio

Aplica QoS y documentación a la red del edificio con el
[Ejercicio: QoS y Diseño de Red (Parte 7)](./exercise).
