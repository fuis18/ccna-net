---
title: Referencia Técnica
description: "Referencia técnica de Network Fundamentals: tablas y comandos esenciales de OSI, TCP/IP, IPv4, subnetting e IPv6."
---

## Modelo OSI (7 capas)

| Capa | Nombre       | PDU      | Protocolos / equipos |
| :--- | :----------- | :------- | :------------------- |
| 7    | Application  | Datos    | HTTP, DNS, SMTP, FTP |
| 6    | Presentation | Datos    | TLS, JPEG, ASCII     |
| 5    | Session      | Datos    | RPC, NetBIOS         |
| 4    | Transport    | Segmento | TCP, UDP             |
| 3    | Network      | Paquete  | IP, ICMP, routers    |
| 2    | Data Link    | Trama    | Ethernet, switches   |
| 1    | Physical     | Bit      | Cables, NICs, hubs   |

## Modelo TCP/IP (4 capas)

| Capa TCP/IP  | Equivalente OSI | Protocolos                             |
| :----------- | :-------------- | :------------------------------------- |
| Aplicación   | 7, 6, 5         | HTTP, HTTPS, DNS, SMTP, FTP, DHCP, SSH |
| Transporte   | 4               | TCP, UDP                               |
| Internet     | 3               | IP, ICMP, ARP                          |
| Acceso a red | 2, 1            | Ethernet, Wi-Fi, PPP                   |

## TCP vs UDP

|                  TCP                  |                     UDP                      |
| :-----------------------------------: | :------------------------------------------: |
| Verifica que no se pierda la conexión | Brinda la información rapida y continuamente |

## Puertos conocidos

| Puerto    | Protocolo              |
| :-------- | :--------------------- |
| 20/21     | FTP                    |
| 22        | SSH                    |
| 23        | Telnet                 |
| 25        | SMTP                   |
| 53        | DNS                    |
| 67/68     | DHCP                   |
| 80        | HTTP                   |
| 110       | POP3                   |
| 123       | NTP                    |
| 143       | IMAP                   |
| 443       | HTTPS                  |
| 5246/5247 | CAPWAP (control/datos) |

## Subnetting

### Fórmulas

Hosts necesarios para H hosts utilizables (red + broadcast incluidos):

$$N = H + 2$$

Bits de host necesarios:

$$2^h \geq H + 2$$

Prefijo resultante:

$$/P = 32 - h$$

Máscara de un octeto:

$$\text{máscara} = 256 - \text{tamaño del bloque}$$

Salto entre subredes:

$$\text{salto} = 256 - \text{octeto}$$

|     Octecto     |     Hexteto     |    Triocteto    |      Dword      |
| :-------------: | :-------------: | :-------------: | :-------------: |
| 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 | 0 0 0 0 0 0 0 0 |

## Direcciones especiales IPv4

| Tipo                | Rango / dirección                         |
| :------------------ | :---------------------------------------- |
| Privadas (RFC 1918) | 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 |
| Loopback            | 127.0.0.0/8 (127.0.0.1)                   |
| Link-local (APIPA)  | 169.254.0.0/16                            |
| Multicast           | 224.0.0.0 – 239.255.255.255               |

### Clases clásicas

| Clase         | Rango                       | Máscara default |
| :------------ | :-------------------------- | :-------------- |
| A             | 1.0.0.0 – 126.255.255.255   | /8              |
| B             | 128.0.0.0 – 191.255.255.255 | /16             |
| C             | 192.0.0.0 – 223.255.255.255 | /24             |
| D (multicast) | 224.0.0.0 – 239.255.255.255 | —               |
| E (reservada) | 240.0.0.0 – 255.255.255.255 | —               |

## IPv6

| Tipo              | Rango / forma | Uso                                                     |
| :---------------- | :------------ | :------------------------------------------------------ |
| Unicast global    | 2000::/3      | Pública, enrutable en internet                          |
| Link-local        | fe80::/10     | Vecinos del mismo segmento (NDP, next-hop)              |
| Único local (ULA) | fc00::/7      | Interna, no sale a internet                             |
| Multicast         | ff00::/8      | Reemplaza el broadcast (ff02::1 nodos, ff02::2 routers) |
| Loopback          | ::1           | Prueba de interfaz                                      |
| No especificada   | ::            | Antes de tener dirección propia                         |

### Reglas de notación

```text
- Ceros a la izquierda: se omiten (2001:0db8 -> 2001:db8)
- "::" reemplaza grupos de ceros (solo UNA vez)
- 2001:0db8:0000:0000:0000:ff00:0042:8329 = 2001:db8::ff00:42:8329
```

### Datos clave

```text
- LAN de usuarios casi siempre /64 (SLAAC necesita 64 bits de host)
- No hay broadcast: multicast
- Vecinos: NDP (ICMPv6) en lugar de ARP
- Configuración: SLAAC, DHCPv6 o estática
- EUI-64: inserta ff:fe en la MAC; Privacy Extensions lo aleatoriza
- Transición: dual-stack, túneles, NAT64
```

## IPv4 vs IPv6

| Característica | IPv4             | IPv6                    |
| :------------- | :--------------- | :---------------------- |
| Bits           | 32               | 128                     |
| Notación       | Decimal punteada | Hexadecimal (:)         |
| Broadcast      | Sí               | No (solo multicast)     |
| Vecinos        | ARP              | NDP / ICMPv6            |
| Configuración  | DHCP             | SLAAC, DHCPv6, estática |

