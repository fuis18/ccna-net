---
title: Network Virtualization
description: "Virtualización de red: cloud computing, infraestructura virtual de red (VRF, VXLAN), y Software-Defined Networking (SDN)."
---

La virtualización de red separa la **red lógica** de la **física**, permitiendo
múltiples redes independientes sobre la misma infraestructura. Es la base del
cloud computing y del moderno data center.

## Temas del módulo

### Cloud Computing

Los modelos de servicio cloud (IaaS, PaaS, SaaS) y los modelos de despliegue
(Private, Public, Hybrid). Cómo la virtualización de red habilita el cloud.

- [Cloud Computing](./cloud-computing)

### Infraestructura Virtual de Red

VRF, túneles GRE, VXLAN: tecnologías que crean redes **overlay** sobre la
infraestructura física (underlay).

- [Infraestructura Virtual de Red](./virtual-network-infra)

### Software-Defined Networking (SDN)

Separación del plano de control y plano de datos. OpenFlow, Cisco ACI y el
futuro de la red programable.

- [Software-Defined Networking (SDN)](./sdn)

## Repaso rápido

| Concepto | Resumen |
| :------- | :------ |
| IaaS | Infraestructura como servicio (VMs, redes) |
| PaaS | Plataforma como servicio (apps, databases) |
| SaaS | Software como servicio (email, CRM) |
| VRF | Routing instances aisladas en un mismo router |
| GRE | Túnel point-to-point sobre IP |
| VXLAN | Overlay L2 sobre L3 (VNI, 24 bits) |
| SDN | Control centralizado, plano de datos programable |

## Ejercicio

Implementa VRF y un túnel GRE en la red del edificio con el
[Ejercicio: Virtualización de Red (Parte 9)](./exercise).
