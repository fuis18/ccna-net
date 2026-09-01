---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Wireless: arquitectura AP/WLC, CAPWAP, bandas y canales, WLANs, SSIDs y seguridad WPA2/WPA3."
---

## Arquitectura inalámbrica

| Tipo | Características |
| :--- | :--- |
| AP autónomo | Independiente, redes pequeñas, sin controlador |
| AP ligero + WLC | Centralizado, redes medianas/grandes |
| Split-MAC | Parte del MAC en el AP, parte en el WLC |

## CAPWAP

```text
Control: UDP 5246
Datos:   UDP 5247
```

Descubrimiento del WLC: broadcast, DNS (`CISCO-CAPWAP-CONTROLLER`) o manual.

## Modos del AP ligero

| Modo | Uso |
| :--- | :--- |
| Local | Default: tráfico de clientes al WLC |
| FlexConnect | Conmutación local en sucursales |
| Monitor | Sensores (IDS, rogues) |
| Sniffer | Captura de tramas |
| Rogue Detector | Detecta APs no autorizados |

## Bandas y canales

| Banda | Canales | Notas |
| :--- | :--- | :--- |
| 2.4 GHz | 1-13; no solapados: **1, 6, 11** | Más alcance, más interferencia |
| 5 GHz | Muchos no solapados | Menos interferencia, más velocidad |

- Ancho de canal: 20/40/80 MHz.
- RRM (WLC) asigna canales y potencia automáticamente.

## SSID / BSSID

```text
SSID   = nombre de la red visible para el cliente
BSSID  = MAC de la radio del AP (identifica un AP concreto)
```

## Configuración WLAN en WLC

```bash
(Cisco Controller) > config wlan create 1 "Oficina" SSID-Oficina
(Cisco Controller) > config wlan ssid SSID-Oficina 1
(Cisco Controller) > config wlan security wpa akm psk set-key ascii ClaveFuerte! 1
(Cisco Controller) > config wlan security wpa encryption aes 1
(Cisco Controller) > config wlan interface 1 vlan-10
(Cisco Controller) > config wlan enable 1
```

## Configuración AP autónomo (CLI)

```ios
configure terminal
dot11 ssid Oficina
 authentication open
 wpa-psk ascii ClaveFuerte!
 guest-mode
 exit
interface Dot11Radio0
 ssid Oficina
 channel 6
 station-role root
```

## Seguridad WLAN

| Estándar | Cifrado | Notas |
| :--- | :--- | :--- |
| WEP | RC4 | Roto, no usar |
| WPA | TKIP | Transitorio |
| WPA2 | AES-CCMP | 802.11i, estándar |
| WPA3 | AES-GCMP | SAE en Personal, 192-bit Empresarial |

### Personal vs Empresarial

| | Personal (PSK) | Empresarial (802.1X) |
| :--- | :--- | :--- |
| Credenciales | Clave compartida | Usuario/contraseña por persona |
| RADIUS | No | Sí |
| Seguridad | Buena | Mayor |

### Configuración Empresarial (802.1X) en WLC

```bash
(Cisco Controller) > config wlan security radius server 192.168.1.50 shared-secret MiSecreto 1
(Cisco Controller) > config wlan security wpa akm dot1x enable 1
```

## Asociación del cliente

```text
Beacon/Probe → autenticación 802.11 → asociación (BSSID) → IP por DHCP → (802.1X: RADIUS)
```

## Ataques inalámbricos

| Ataque | Mitigación |
| :--- | :--- |
| Evil twin | WPA3, detectar rogues |
| Rogue AP | WIDS/WIPS |
| Crack PSK | Claves fuertes, 802.1X |
| Deauthentication | 802.1X, WIDS |

## Verificación

```bash
(Cisco Controller) > show wlan summary
(Cisco Controller) > show client summary
(Cisco Controller) > show ap summary
```

Estado AP: **Joined** (asociado) / **Disjoined** (sin controlador).