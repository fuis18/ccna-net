---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Configuración de Red: VLANs y trunks, direccionamiento, subinterfaces, rutas estáticas y protocolos OSPF/EIGRP/RIP."
---

## Tipos de VLAN

| VLAN | Descripción |
| :--- | :--- |
| Por defecto | VLAN 1, no se puede borrar ni renombrar |
| Datos | Tráfico de usuarios |
| Gestión | Administración (SSH, telnet) |
| Nativa | En trunk, tramas sin etiqueta (default VLAN 1) |
| Voz | Teléfonos IP (QoS) |

802.1Q: etiqueta de 4 bytes; VID de 12 bits → hasta **4094** VLANs.

## Configuración de VLANs

```ios
vlan 10
 name Ventas
 exit
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10

interface range GigabitEthernet0/1 - 24
 switchport mode access
 switchport access vlan 20
```

## Trunk 802.1Q

```ios
interface GigabitEthernet0/24
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,99
```

## VLAN de voz

```ios
interface GigabitEthernet0/5
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 100
```

## Direccionamiento del switch (SVI)

```ios
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
exit
interface vlan 99
 ip address 192.168.99.1 255.255.255.0
 no shutdown
exit

# Switch capa 2 (sin ip routing): gateway obligatorio
ip default-gateway 192.168.99.2

# Switch multicapa: habilita enrutar entre VLANs
ip routing
```

## Direccionamiento del router (interfaz física)

```ios
interface GigabitEthernet0/0
 ip address 192.168.10.1 255.255.255.0
 no shutdown
exit
interface GigabitEthernet0/1
 ip address 192.168.20.1 255.255.255.0
 no shutdown
```

## Subinterfaces (Router-on-a-Stick)

```ios
interface GigabitEthernet0/0.10
 encapsulation dot1q 10
 ip address 192.168.10.1 255.255.255.0
exit
interface GigabitEthernet0/0.20
 encapsulation dot1q 20
 ip address 192.168.20.1 255.255.255.0
exit

# VLAN nativa (opción A): se atiende en la interfaz física
interface GigabitEthernet0/0
 ip address 192.168.99.1 255.255.255.0
```

Del lado del switch, hacia el router: puerto **trunk** con las VLANs permitidas.

## Verificación switching / direccionamiento

```ios
show vlan brief
show interfaces trunk
show ip interface brief
show vlans          # en el router: qué subinterfaz atiende cada VLAN
```

## Rutas en la tabla

| Origen | Código | Cómo se aprende |
| :--- | :--- | :--- |
| Conectada | `C` (local `L`) | Interfaz con IP |
| Estática | `S` | `ip route` |
| Dinámica | `O`/`D`/`R` | Protocolo |

## Rutas estáticas

```ios
# Sintaxis
ip route <red-destino> <máscara> {<IP-siguiente-salto> | <interfaz>} [AD]

ip route 10.0.0.0 255.0.0.0 192.168.1.2

# Ruta por defecto
ip route 0.0.0.0 0.0.0.0 192.168.1.254

# Ruta flotante (respaldo, AD mayor)
ip route 10.0.0.0 255.0.0.0 192.168.2.2 150

# IPv6
ipv6 route 2001:db8:10::/64 2001:db8:1::2
ipv6 route ::/0 2001:db8:1::254
```

## Distancia Administrativa (AD)

| Fuente | AD |
| :--- | :--- |
| Conectada | 0 |
| Estática | 1 |
| EIGRP | 90 |
| OSPF | 110 |
| RIP | 120 |
| Flotante (manual) | 150 |
| iBGP | 200 |

Selección de ruta: **prefijo más largo → menor AD → menor métrica**.

## OSPFv2

```ios
router ospf 1
 router-id 1.1.1.1
 network 192.168.1.0 0.0.0.255 area 0
 passive-interface default
 no passive-interface GigabitEthernet0/1
 exit
interface GigabitEthernet0/1
 ip ospf 1 area 0
```

| Dato | Valor |
| :--- | :--- |
| Hello / Dead | 10 s / 40 s |
| AD | 110 |
| Métrica | Coste = 100 000 / ancho de banda |
| Multicast hello | 224.0.0.5 |
| Router ID | `router-id` > loopback más alta > IP física más alta |

Estados vecinos: Down → Init → 2-Way → ExStart → Exchange → Loading → **Full**.

### Multi-área (ABR)

```ios
interface GigabitEthernet0/0
 ip ospf 1 area 0
interface GigabitEthernet0/1
 ip ospf 1 area 1
```

### Tipos de LSA

| LSA | Tipo | Anuncia |
| :--- | :--- | :--- |
| 1 | Router | Redes del propio router |
| 2 | Network | Red multiacceso (DR) |
| 3 | Summary | Redes de otras áreas (ABR) |
| 4 | ASBR | Ubicación del ASBR |
| 5 | External | Rutas externas |

## EIGRP

```ios
router eigrp 100
 network 192.168.1.0 0.0.0.255
 no auto-summary
```

- AD **90**. Métrica = (10⁷ / banda mínima + retardo total) × 256.
- Código en la tabla: `D`. Vecinos: `show ip eigrp neighbors`.

## RIP

```ios
router rip
 version 2
 network 192.168.1.0
 no auto-summary
```

- AD **120**. Métrica = **saltos** (máx. 15; 16 = inalcanzable).
- Código en la tabla: `R`. Actualiza cada 30 s.

## Comparativa de protocolos

| Protocolo | Tipo | Métrica | AD |
| :--- | :--- | :--- | :- |
| OSPF | Estado de enlace | Coste (banda) | 110 |
| EIGRP | Híbrido (DUAL) | Banda + retardo ×256 | 90 |
| RIP | Vector de distancia | Saltos | 120 |

## Verificación routing

```ios
show ip route
show ip route static
show ip route ospf
show ip ospf neighbor
show ip eigrp neighbors
show ip protocols
```