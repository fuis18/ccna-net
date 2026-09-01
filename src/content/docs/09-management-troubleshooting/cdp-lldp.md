---
title: Descubrimiento de Dispositivos (CDP / LLDP)
description: "CDP y LLDP: protocolos de descubrimiento de vecinos, configuración en IOS, worldview y Troubleshooting de topología."
---

Antes de diagnosticar un problema, necesitas saber **qué está conectado a qué**.
Los protocolos de descubrimiento responden esa pregunta automáticamente.

## CDP (Cisco Discovery Protocol)

Protocolo **propio de Cisco** que funciona en capa 2. Todos los dispositivos
Cisco lo envían por defecto cada 60 segundos.

### Qué información envía CDP

| Campo | Ejemplo |
| :---- | :------ |
| Device ID | R1.lab.local |
| Platform | Cisco ISR 4331 |
| Interface | GigabitEthernet0/0 |
| IP address | 192.168.10.1 |
| Holdtime | 180 segundos |
| Native VLAN | 1 |
| Duplex | Full |

### Configuración de CDP

```ios
R1(config)# cdp run                    # Habilitar globalmente (default: ON)
R1(config)# cdp timer 60               # Intervalo de envío (default: 60s)
R1(config)# cdp holdtime 180           # Tiempo antes de borrar vecino (default: 180s)

R1(config)# interface GigabitEthernet0/0
R1(config-if)# cdp enable              # Habilitar en interfaz (default: ON)
```

### Verificación de CDP

```ios
R1# show cdp
R1# show cdp neighbors
R1# show cdp neighbors detail
R1# show cdp interface GigabitEthernet0/0
R1# show cdp entry R1
```

### Ejemplo de salida

```
Capability Codes: R - Router, T - Trans Bridge, B - Source Route Bridge
                  S - Switch, H - Host, I - IGMP, c - CVLAN

Device-ID        Local Intf     Holdtme    Platform  Capabilities
SW1              Gi0/0          175        2960      S
SW2              Gi0/1          175        2960      S
```

> **CDP solo ve dispositivos Cisco**. Si hay switches HP, Juniper o APs de
> otro fabricante, CDP no los descubre.

## LLDP (Link Layer Discovery Protocol)

Estándar **IEEE 802.1AB** — funciona con cualquier fabricante. Es el
equivalente multi-vendor de CDP.

### Configuración de LLDP

```ios
R1(config)# lldp run                    # Habilitar globalmente
R1(config)# lldp timer 30               # Intervalo de envío (default: 30s)
R1(config)# lldp holdtime 120           # Tiempo antes de borrar (default: 120s)
R1(config)# lldp reinit 2               # Retraso al reiniciar interfaz

R1(config)# interface GigabitEthernet0/0
R1(config-if)# lldp enable              # Habilitar en interfaz
```

### Verificación de LLDP

```ios
R1# show lldp
R1# show lldp neighbors
R1# show lldp neighbors detail
R1# show lldp interface GigabitEthernet0/0
```

### Ejemplo de salida

```
Local Intf    Device ID           Hold Time  Capability  Port ID
Gi0/0         SW1                 120        B,R         Gi0/1
Gi0/1         SW2                 120        B,R         Gi0/1
```

## CDP vs LLDP

| Característica | CDP | LLDP |
| :------------- | :-- | :--- |
| Estándar | Propio Cisco | IEEE 802.1AB |
| Capa | 2 | 2 |
| Intervalo default | 60s | 30s |
| Holdtime default | 180s | 120s |
| Multi-vendor | No | Sí |
| Seguridad | Baja (info visible) | Baja (info visible) |
| Habilitado por defecto | Sí | No siempre |

### Cuál usar

- **En redes Cisco puro**: CDP es suficiente y automático.
- **En ambientes multi-vendor**: LLDP es obligatorio.
- **Producción**: habilita **ambos** para máxima cobertura de descubrimiento.

## Seguridad: deshabilitar en puertos de acceso

En puertos conectados a usuarios finales, CDP/LLDP revela información del
dispositivo. Es recomendable deshabilitarlos en puertos de acceso:

```ios
SW1(config)# interface FastEthernet0/1
SW1(config-if)# no cdp enable
SW1(config-if)# no lldp enable
```

Mantener CDP/LLDP habilitado solo en **troncales** y puertos de enlace entre
dispositivos de red.

## Troubleshooting de topología

### Problema común: vecino no aparece

1. Verificar que CDP/LLDP está habilitado en **ambos lados**.
2. Verificar que la interfaz está `up/up`.
3. Verificar que no está bloqueado por una ACL o VLAN incorrecta.
4. Usar `show cdp neighbors` y comparar con la topología documentada.

### Ejemplo: verificar conectividad

```ios
SW1# show cdp neighbors
SW1# show ip interface brief
SW1# show interfaces status
SW1# show vlan brief
```
