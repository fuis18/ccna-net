---
title: Network Management & Troubleshooting
description: "Gestión y diagnóstico de red: CDP/LLDP, SNMP, Syslog y metodología de troubleshooting con herramientas Cisco."
---

Este módulo cubre cómo **monitorear** la red de forma proactiva y cómo
**diagnosticar** problemas cuando algo falla. Un administrador de red no solo
configura dispositivos: también los vigila, registra eventos y resuelve
problemas de forma metódica.

## Temas del módulo

### Descubrimiento de Dispositivos (CDP / LLDP)

Dos protocolos que permiten a los switches y routers **descubrir automáticamente**
qué dispositivos están conectados, en qué puerto y con qué IP.

- [Descubrimiento de Dispositivos (CDP / LLDP)](./cdp-lldp)

### Monitoreo: SNMP y Syslog

**SNMP** permite consultar y configurar dispositivos remotamente. **Syslog**
registra eventos y errores en un servidor centralizado. Juntos forman la base
del monitoreo de red.

- [Monitoreo: SNMP y Syslog](./snmp-syslog)

### Metodología de Troubleshooting

Cuando la red falla, no se improvisa. Aprende el **proceso metódico** de
diagnóstico por capas OSI y las **herramientas** de Cisco para encontrar y
resolver problemas.

- [Metodología de Troubleshooting](./troubleshooting-process)

## Repaso rápido

| Concepto | Resumen |
| :------- | :------ |
| CDP | Protocolo Cisco, descubre vecinos en capa 2 |
| LLDP | Estándar IEEE 802.1AB, multi-vendor |
| SNMP | Consulta/configura dispositivos vía MIBs y OIDs |
| Syslog | Registro centralizado de eventos (Levels 0–7) |
| Troubleshooting | Proceso metódico: definir, recopilar, analizar, resolver |

## Ejercicio

Monitorea y diagnostica problemas en la red del edificio con el
[Ejercicio: Gestión y Diagnóstico (Parte 7)](./exercise).
