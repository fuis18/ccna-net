---
title: Network Automation
description: "Automatización de red: APIs, formatos de datos, herramientas de configuración (Ansible, Terraform), IBN y Cisco DNA Center."
---

La automatización de red reemplaza la configuración **manual** (CLI por CLI)
por scripts, APIs y herramientas que ejecutan cambios a escala. En una red
moderna, automatizar no es opcional — es una necesidad.

## Temas del módulo

### Panorama de Automatización

Por qué automatizar, push vs pull, formatos de datos (JSON, YAML, XML) y
modelos de datos YANG.

- [Panorama de Automatización](./automation-overview)

### APIs y Formatos de Datos

REST APIs, NETCONF/YANG, gNMI: cómo los dispositivos exponen interfaces
programables para consultar y configurar.

- [APIs y Formatos de Datos](./apis-data-frames)

### Herramientas de Gestión de Configuración

Ansible, Terraform, Puppet, Chef: herramientas para gestionar configuraciones
de forma declarativa, versionada y automatizada.

- [Herramientas de Gestión de Configuración](./config-management-tools)

### Intent-Based Networking (IBN) y Cisco DNA Center

IBN traduce la **intención** del administrador en configuración ejecutable.
Cisco DNA Center es la plataforma que implementa IBN para campus y branch.

- [Intent-Based Networking y Cisco DNA Center](./ibn-dna-center)

## Repaso rápido

| Concepto | Resumen |
| :------- | :------ |
| Push | El servidor envía configuración al dispositivo |
| Pull | El dispositivo solicita su configuración |
| JSON | Formato ligero, nativo de APIs REST |
| YAML | Formato legible para humanos, usado en playbooks |
| YANG | Modelo de datos para NETCONF |
| REST API | API HTTP estándar para configurar dispositivos |
| NETCONF | Protocolo de configuración sobre SSH |
| Ansible | Herramienta push basada en playbooks YAML |
| IBN | Red basada en intención, no en comandos |

## Ejercicio

Automatiza la configuración de la red del edificio con Ansible y explora
Cisco DNA Center con el
[Ejercicio: Automatización de Red (Parte 10)](./exercise).
