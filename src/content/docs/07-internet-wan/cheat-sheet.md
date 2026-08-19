---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Conexión a Internet y Enlaces WAN: tipos de enlace, encapsulaciones HDLC/PPP, interfaz de borde, DHCP e IP estática."
---

## Tipos de enlace al ISP

| Tipo | Interfaz | Notas |
| :--- | :--- | :--- |
| Línea dedicada | `Serial` | Punto a punto; HDLC (Cisco) o PPP (estándar) |
| DSL / Cable | `Dialer`/`GigabitEthernet` | ADSL/PPPoE o HFC |
| Fibra (FTTH) | `GigabitEthernet` | Alta velocidad, IP por DHCP estática |
| Metro Ethernet | `GigabitEthernet` | IP + `no shutdown`, como una LAN |

## Encapsulaciones seriales

| Encapsulación | Estándar | Características |
| :--- | :--- | :--- |
| HDLC | Propietaria Cisco | Por defecto; sin autenticación |
| PPP | RFC 1661 | Autenticación PAP/CHAP, compresión, multilink |

```ios
interface Serial0/0/0
 ip address 10.0.0.1 255.255.255.252
 encapsulation ppp
 ppp authentication chap
 no shutdown
```

## Configuración de la interfaz de borde

```ios
# IP estática (/30 hacia el ISP)
interface GigabitEthernet0/1
 description Enlace WAN hacia el ISP
 ip address 200.200.200.1 255.255.255.252
 no shutdown

# IP por DHCP (fibra/cable)
interface GigabitEthernet0/1
 ip address dhcp
```

## Ruta por defecto y salida

```ios
ip route 0.0.0.0 0.0.0.0 10.0.0.2      # ruta por defecto hacia el ISP
```

- Enlace hacia el ISP: subred **/30** (2 hosts: tu router y el del proveedor).
- Con IPs privadas internas, hace falta **NAT/PAT** en el borde (ver Módulo 6).

## Verificación

```ios
show ip interface brief
show interfaces Serial0/0/0
show ip route
show ip dhcp lease       # si la IP llegó por DHCP
ping 8.8.8.8
```

- Interfaz WAN en `up/up` con su IP.
- `S* 0.0.0.0/0` = ruta por defecto hacia el ISP.
- `ping 8.8.8.8` confirma la salida a internet (con NAT ya aplicado).