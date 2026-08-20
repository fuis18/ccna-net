---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de IP Services: NAT/PAT, DHCP/DNS/NTP y ACLs."
---

## Direcciones privadas (RFC 1918)

| Clase | Rango |
| :--- | :--- |
| A | 10.0.0.0 – 10.255.255.255 |
| B | 172.16.0.0 – 172.31.255.255 |
| C | 192.168.0.0 – 192.168.255.255 |

## NAT / PAT

| Tipo | Relación | Uso |
| :--- | :--- | :--- |
| Estático | 1 privada ↔ 1 pública fija | Servidores accesibles desde fuera |
| Dinámico | Pool, primera libre | Sin sobrecarga |
| PAT (overload) | Muchas privadas → 1 pública + puertos | Salida a internet |

### Terminología

```text
Inside local   = IP privada del host interno
Inside global  = IP pública que representa al host
Outside local  = IP del host externo vista desde dentro
Outside global = IP real del host externo
```

### NAT estático

```ios
ip nat inside source static 192.168.1.100 200.200.200.2

interface GigabitEthernet0/0
 ip nat inside
interface GigabitEthernet0/1
 ip nat outside
```

### PAT (overload)

```ios
access-list 1 permit 192.168.1.0 0.0.0.255
ip nat pool PUBLICA 200.200.200.1 200.200.200.1 netmask 255.255.255.0
ip nat inside source list 1 pool PUBLICA overload

interface GigabitEthernet0/0
 ip nat inside
interface GigabitEthernet0/1
 ip nat outside
```

> `overload` activa el PAT. Verificación: `show ip nat translations`, `show ip nat statistics`. Debug: `debug ip nat`.

## Conexión al ISP (Enlaces WAN)

| Tipo de enlace | Interfaz | Notas |
| :--- | :--- | :--- |
| Línea dedicada | `Serial` | Encapsulación HDLC (Cisco) o PPP (estándar) |
| Fibra / Metro Ethernet | `GigabitEthernet` | IP + `no shutdown`, como una LAN |

```ios
# Línea dedicada (serial)
interface Serial0/0/0
 ip address 10.0.0.1 255.255.255.252
 encapsulation ppp
 no shutdown

# IP por DHCP del ISP (fibra/cable)
interface GigabitEthernet0/1
 ip address dhcp

# Ruta por defecto hacia el ISP
ip route 0.0.0.0 0.0.0.0 10.0.0.2
```

- Enlace hacia el ISP: subred **/30** (2 hosts).
- Salida a internet = ruta por defecto + **NAT/PAT** (ver arriba).

## DHCP

```text
Puertos: 67 servidor / 68 cliente
Proceso: Discover → Offer → Request → Ack (DORA)
```

```ios
ip dhcp excluded-address 192.168.1.1 192.168.1.10
ip dhcp pool LAN-Oficina
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 8.8.8.8
 lease 7

# Relay (servidor en otra subred)
interface GigabitEthernet0/0
 ip helper-address 10.0.0.5
```

```ios
show ip dhcp binding
show ip dhcp pool LAN-Oficina
```

## DNS

```ios
ip name-server 8.8.8.8
ip domain lookup          # no ip domain lookup desactiva la resolución
ip domain name empresa.local   # dominio por defecto (para SSH)
```

```text
Puerto: 53 (UDP)
```

## NTP

```text
Puerto: 123 (UDP)
Stratum: distancia a la fuente atómica (menor = más preciso)
```

```ios
ntp server 192.168.1.250
ntp update-calendar
```

```ios
show ntp status          # Clock is synchronized, stratum 3...
show ntp associations    # * = servidor de referencia
```

## ACLs

| Tipo | Filtra | Números |
| :--- | :--- | :--- |
| Estándar | Solo IP origen | 1-99, 1300-1999 |
| Extendida | Origen, destino, protocolo, puerto | 100-199, 2000-2699 |

Reglas: orden secuencial, primera coincidencia decide, **deny all implícito** final, una ACL por protocolo por dirección por interfaz.

Estándar → cerca del destino. Extendida → cerca del origen.

### Wildcards

```text
0 = debe coincidir | 1 = irrelevante
255.255.255.0 -> 0.0.0.255
255.255.255.128 -> 0.0.0.127
255.255.0.0   -> 0.0.255.0
0.0.0.0       = host <ip>
255.255.255.255 = any
```

### ACL estándar

```ios
access-list 10 permit 192.168.1.0 0.0.0.255
access-list 10 deny any
interface GigabitEthernet0/1
 ip access-group 10 in
```

### ACL extendida

```ios
access-list 100 permit tcp 192.168.1.0 0.0.0.255 host 10.0.0.10 eq 80
access-list 100 deny ip any any
interface GigabitEthernet0/0
 ip access-group 100 out
```

Operadores: `eq`, `neq`, `gt`, `lt`, `range 1000 2000`.

### Named ACL

```ios
ip access-list extended BLOQUEAR-WEB
 deny tcp any any eq 80
 deny tcp any any eq 443
 permit ip any any
interface GigabitEthernet0/0
 ip access-group BLOQUEAR-WEB in
```

### Restringir VTY (SSH/Telnet)

```ios
access-list 15 permit 10.0.0.0 0.0.0.255
line vty 0 4
 access-class 15 in
```

> Para VTY se usa **`access-class`**, no `ip access-group`.

```ios
show ip access-lists
show ip interface GigabitEthernet0/0
```