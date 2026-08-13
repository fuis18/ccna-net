---
title: Direccionamiento IPv6
description: Estructura de IPv6, tipos de direcciones, notación, EUI-64 y SLAAC.
---

IPv6 usa direcciones de **128 bits** (frente a los 32 de IPv4), resolviendo el
agotamiento de direcciones y simplificando el enrutamiento y la autoconfiguración.

## Notación hexadecimal

Se escriben como **8 grupos de 4 dígitos hexadecimales** separados por dos puntos.

```
2001:0db8:0000:0000:0000:ff00:0042:8329
```

### Reglas de simplificación

1. **Ceros a la izquierda:** se pueden omitir en cada grupo.
2. **Doble dos puntos (`::`)**: representa uno o más grupos de ceros (solo **una vez**).

```
2001:0db8:0000:0000:0000:ff00:0042:8329
= 2001:db8::ff00:42:8329
```

`::` se usa una sola vez porque si se usara dos veces sería ambiguo.

## Prefijo IPv6

Igual que en IPv4, hay una porción de red (prefijo) y una de interfaz. Se indica
con CIDR:

```
2001:db8:abcd:0012::/64
|------ prefijo ------|..host|
```

El prefijo típico en redes locales de empresa es **/64**, que deja 64 bits para el
identificador de interfaz (IID).

## Tipos de direcciones IPv6

| Tipo | Descripción | Rango/forma |
| :--- | :---------- | :---------- |
| **Unicast global** | Pública, enrutable en internet | 2000::/3 |
| **Unicast link-local** | Solo en el enlace local, no enrutable | fe80::/10 |
| **Unicast único local** | Equivalente a las privadas | fc00::/7 |
| **Multicast** | Envía a un grupo de nodos | ff00::/8 |
| **Anycast** | Envía al nodo *más cercano* de un grupo | — |
| Loopback | Para sí mismo | ::1 |
| No especificada | Indica falta de dirección | :: |

> En IPv6 **no existe broadcast**. Se sustituye por multicast dirigido a todos los
> nodos (`ff02::1`) y a todos los routers (`ff02::2`).

### Link-local

Todo interfaz IPv6 genera automáticamente una dirección `fe80::/10`. Se usa para
comunicación local (IPv6 no usa ARP, usa **NDP** — Neighbor Discovery Protocol).
Los routers la usan como next-hop en las rutas IPv6.

## Identificadores de interfaz (IID)

Los últimos 64 bits se pueden generar de dos formas principales:

### EUI-64

Deriva el IID de la dirección MAC (48 bits) insertando `ff:fe` en el medio y
poniendo a 1 el bit U/L:

```
MAC:        00:1A:2B:3C:4D:5E
EUI-64:     021A:2BFF:FE3C:4D5E
```

### Deficiencia de privacidad / aleatorio

Equipos modernos (Windows, macOS, Android) usan el **Privacy Extensions**
(RFC 4941): generan IIDs aleatorios y temporales para evitar ser rastreados por la MAC.

## Autoconfiguración (SLAAC)

Con **SLAAC**, un host crea su dirección IPv6 sin DHCP:

1. Genera su link-local `fe80::` con EUI-64 o aleatorio.
2. Envía una **Solicitud de Router (RS)** al multicast `ff02::2`.
3. El router responde con un **Anuncio de Router (RA)** que incluye el prefijo y
   la información de gateway.
4. El host combina el prefijo con su IID y valida con **DAD** que no esté duplicada.

DHCPv6 es opcional para conseguir datos que SLAAC no da (DNS, por ejemplo), mediante
DHCPv6 sin estado (stateless) o con estado.

## Transición desde IPv4

- **Doble pila (dual-stack):** el equipo corre IPv4 e IPv6 a la vez (lo más común).
- **Túneles:** encapsulan IPv6 dentro de paquetes IPv4 en redes que aún no soportan IPv6.
- **Traducción (NAT64 / 464XLAT):** traducen entre direcciones IPv6 e IPv4.

## Ping en IPv6

Se usa `ping6` o `ping -6`; los ping a la propia interfaz usan `::1`. También
existe `ping6` contra direcciones link-local requiriendo el interfaz:

```
ping6 fe80::1%eth0
```

## Comparativa IPv4 vs IPv6

| Característica      | IPv4            | IPv6                 |
| :------------------ | :-------------- | :------------------- |
| Bits                | 32              | 128                  |
| Notación            | Decimal punteada | Hexadecimal (:)     |
| Broadcast           | Sí              | No (solo multicast)  |
| ARP                 | Sí              | No (usa NDP/ICMPv6)  |
| Configuración       | DHCP            | SLAAC, DHCPv6, estática |

## Preguntas tipo CCNA

1. **¿Qué simplificación se aplica a `2001:0db8:0000:0000:0000:ff00:0042:8329`?**
   Se quitan los ceros a la izquierda y los grupos de ceros con `::`:
   `2001:db8::ff00:42:8329`.

2. **¿Qué dirección genera todo interfaz IPv6 automáticamente?**
   Una **link-local** `fe80::/10`, usada para el enlace local (NDP, next-hop).

3. **¿Por qué en IPv6 no existe broadcast?**
   Porque se sustituye por **multicast** (`ff02::1` a todos los nodos,
   `ff02::2` a todos los routers).

4. **¿Cómo obtiene un host su IPv6 mediante SLAAC?**
   Envía una Solicitud de Router (RS), el router responde con un Anuncio de Router (RA)
   con el prefijo, y el host forma su dirección con su IID.

5. **¿Qué método deriva el IID a partir de la MAC?**
   **EUI-64**: inserta `ff:fe` en medio de los 48 bits de la MAC y activa el bit U/L.

## Resumen

- IPv6 = 128 bits en hexadecimal, `::` simplifica grupos de ceros.
- Prefijo típico /64; no hay broadcast, todo es unicast/multicast/anycast.
- Todo interfaz tiene una link-local `fe80::/10`.
- SLAAC permite autoconfigurarse a partir de los anuncios del router.