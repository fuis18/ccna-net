---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Network Management & Troubleshooting: CDP/LLDP, SNMP, Syslog y herramientas de diagnóstico."
---

## CDP / LLDP

| Característica | CDP | LLDP |
| :------------- | :-- | :--- |
| Estándar | Propio Cisco | IEEE 802.1AB |
| Intervalo | 60s | 30s |
| Holdtime | 180s | 120s |
| Multi-vendor | No | Sí |

### Comandos CDP

```ios
cdp run                              # Habilitar globalmente
cdp timer <segundos>                 # Intervalo de envío
cdp holdtime <segundos>              # Tiempo antes de borrar vecino
show cdp neighbors                   # Lista de vecinos
show cdp neighbors detail            # Detalle (IP, platform, puerto)
show cdp interface <iface>           # Estado CDP en interfaz
```

### Comandos LLDP

```ios
lldp run                             # Habilitar globalmente
lldp timer <segundos>                # Intervalo de envío
lldp holdtime <segundos>             # Tiempo antes de borrar vecino
show lldp neighbors                  # Lista de vecinos
show lldp neighbors detail           # Detalle LLDP
show lldp interface <iface>          # Estado LLDP en interfaz
```

## SNMP

### Versiones

| Versión | Seguridad | Autenticación | Cifrado |
| :------ | :-------- | :------------ | :------ |
| v1 | Ninguna | Community (texto plano) | No |
| v2c | Ninguna | Community (texto plano) | No |
| v3 | **Alta** | USM (hash) | DES/AES |

### Comandos SNMP

```ios
snmp-server community <string> RO              # Solo lectura
snmp-server community <string> RW              # Lectura/escritura
snmp-server host <ip> version 2c <community>   # IP del NMS
snmp-server enable traps                       # Habilitar traps
snmp-server contact <texto>                    # Contacto
snmp-server location <texto>                   # Ubicación
show snmp                                      # Estado SNMP
show snmp user                                 # Usuarios SNMP
show snmp group                                # Grupos SNMP
```

## Syslog

### Niveles de severidad

| Nivel | Nombre | Descripción |
| :---- | :----- | :---------- |
| 0 | Emergencies | Sistema inoperativo |
| 1 | Alerts | Acción inmediata |
| 2 | Critical | Condiciones críticas |
| 3 | Errors | Errores |
| 4 | Warnings | Advertencias |
| 5 | Notifications | Eventos significativos |
| 6 | Informational | Información general |
| 7 | Debugging | Debug |

### Comandos Syslog

```ios
logging host <ip>                        # Servidor syslog
logging trap <nivel>                     # Severidad mínima
logging buffered <bytes>                 # Buffer local
logging source-interface <iface>         # IP de origen
service timestamps log datetime msec     # Timestamps precisos
show logging                             # Ver logs
show logging history                     # Historial
clear logging                            # Limpiar buffer
```

## Troubleshooting: 6 pasos

1. **Definir** el problema
2. **Recopilar** información
3. **Analizar** la información
4. **Eliminar** posibilidades
5. **Implementar** la solución
6. **Verificar** y documentar

## Herramientas por capa OSI

| Capa | Herramienta | Comando |
| :--- | :---------- | :------ |
| 1 (Física) | LED, cable | `show interfaces status` |
| 2 (Enlace) | MAC table, STP | `show mac address-table`, `show spanning-tree` |
| 3 (Red) | IP, routing | `show ip route`, `ping`, `traceroute` |
| 4 (Transporte) | Puertos, ACLs | `show access-lists`, `test ip port` |
| 5–7 (App) | CPU, memoria | `show processes cpu`, `show memory` |

## Comandos show esenciales

```ios
show interfaces                     # Estado y errores de interfaces
show ip route                       # Tabla de routing
show vlan brief                     # VLANs y puertos
show mac address-table              # Tabla MAC
show arp                            # Tabla ARP
show cdp neighbors                  # Vecinos CDP
show running-config                 # Configuración activa
show log                            # Mensajes de logging
show processes cpu                  # Uso de CPU
show memory                         # Uso de memoria
debug ip packet                     # Debug de paquetes (¡con cuidado!)
undebug all                         # Apagar todos los debugs
```
