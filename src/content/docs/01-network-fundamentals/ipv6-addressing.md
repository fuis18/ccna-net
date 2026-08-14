---
title: Direccionamiento IPv6
description: Estructura de IPv6, tipos de direcciones, notación, EUI-64 y SLAAC.
---

IPv4 tiene un límite duro: ~4.300 millones de direcciones, y ya no alcanzan para todos
los dispositivos del mundo. IPv6 resuelve eso con direcciones de **128 bits** (frente
a los 32 de IPv4) — un espacio tan grande que ya no hace falta NAT para "estirar"
direcciones públicas, y de paso simplifica cosas que en IPv4 requerían protocolos
aparte (autoconfiguración sin DHCP, por ejemplo).

## Notación hexadecimal

Se escriben en **8 grupos de 4 dígitos hexadecimales** separados por dos puntos. Esta
es la forma en la que vas a ver una IPv6 en `ipconfig`, `ifconfig` o un `ping6` — vale
la pena poder leerla sin que se vea como ruido:

```
2001:0db8:0000:0000:0000:ff00:0042:8329
```

### Reglas de simplificación

Escribir 32 caracteres hexadecimales cada vez sería poco práctico, así que existen dos
reglas para acortar la dirección sin perder información:

1. **Ceros a la izquierda:** se pueden omitir en cada grupo.
2. **Doble dos puntos (`::`)**: reemplaza uno o más grupos de ceros consecutivos, pero
   **solo una vez** en la dirección — si se usara dos veces, no habría forma de saber
   cuántos ceros representa cada `::`.

```
2001:0db8:0000:0000:0000:ff00:0042:8329
= 2001:db8::ff00:42:8329
```

## Prefijo IPv6: por qué siempre es /64

Igual que en IPv4, hay una porción de red (prefijo) y una de host (identificador de
interfaz, IID). Se indica con CIDR:

```
2001:db8:abcd:0012::/64
|------ prefijo ------|..host|
```

**La diferencia con IPv4:** en una LAN de usuarios casi nunca vas a usar otro prefijo
que no sea `/64`. No es una convención arbitraria — es un requisito técnico: **SLAAC**
(la autoconfiguración de la sección más abajo) necesita exactamente 64 bits de host
para poder generar el identificador de interfaz de forma automática. Si subneteas una
LAN de usuarios con un prefijo más largo (`/80`, por ejemplo), SLAAC deja de
funcionar en esa red.

Esto cambia el problema de subnetting: en vez de repartir *hosts* como en IPv4, en
IPv6 se reparten **subredes /64 completas** — por ejemplo, un sitio con un bloque
`/48` puede repartir hasta 65.536 subredes `/64`, una por VLAN o por área, sin
preocuparse nunca de quedarse sin direcciones dentro de cada una.

## Tipos de direcciones IPv6

En IPv4 casi todo el tiempo usas un solo tipo de dirección por interfaz. En IPv6 un
mismo equipo tiene **varias direcciones a la vez**, cada una para un propósito
distinto — por eso conviene saber cuál usar en cada situación, más que memorizar la
tabla completa:

| Tipo | Para qué se usa | Rango/forma |
| :--- | :--------------- | :----------- |
| **Unicast global** | La dirección "pública", enrutable en internet — equivalente a una IP pública de IPv4 | 2000::/3 |
| **Unicast link-local** | Comunicarse con vecinos del mismo segmento (incluido el router) sin depender de ningún servidor | fe80::/10 |
| **Unicast único local (ULA)** | Direccionamiento interno que no debe salir a internet — equivalente a las privadas de IPv4 | fc00::/7 |
| **Multicast** | Enviar un mismo paquete a un grupo de nodos a la vez (reemplaza el broadcast) | ff00::/8 |
| **Anycast** | Enviar al nodo *más cercano* de un grupo — útil para DNS o balanceo de servidores redundantes | — |
| Loopback | Probar la propia interfaz, sin salir a la red | ::1 |
| No especificada | Un host la usa antes de tener dirección propia (por ejemplo, durante DAD) | :: |

> **Por qué no hay broadcast:** en IPv6 el broadcast se elimina a propósito — obligaba
> a todos los equipos de la red a procesar cada paquete aunque no fuera para ellos. En
> su lugar, multicast dirige el paquete solo a quien lo necesita: `ff02::1` llega a
> todos los nodos y `ff02::2` solo a los routers.

### Link-local: la dirección que siempre está ahí

Todo interfaz IPv6 genera automáticamente una dirección `fe80::/10`, incluso sin
router ni servidor DHCP en la red. **Para qué sirve en la práctica:** es la dirección
que usan los equipos para descubrirse entre sí en el mismo segmento (`NDP` —
Neighbor Discovery Protocol, el reemplazo de ARP en IPv6) y la que los routers anuncian
como *next-hop* en sus rutas. Por eso, al hacer ping a una link-local hay que indicar
la interfaz de salida — la dirección por sí sola no dice en qué red buscarla:

```
ping6 fe80::1%eth0
```

## Identificador de interfaz (IID): cómo se arma la mitad "host"

Los últimos 64 bits de una dirección IPv6 se pueden generar de dos formas. Cuál se usa
no es un detalle menor: tiene una implicación directa de privacidad.

### EUI-64: derivarlo de la MAC

Toma la MAC (48 bits), inserta `ff:fe` en el medio y activa el bit U/L:

```
MAC:        00:1A:2B:3C:4D:5E
EUI-64:     021A:2BFF:FE3C:4D5E
```

**El problema:** como la MAC no cambia, la dirección IPv6 tampoco — el equipo queda
identificable de forma permanente en cualquier red a la que se conecte, incluso si
cambia de red o de proveedor. Es rastreable.

### Privacy Extensions: IID aleatorio

Por eso los sistemas modernos (Windows, macOS, Android) usan **Privacy Extensions**
(RFC 4941) por defecto: generan un IID aleatorio y lo renuevan periódicamente, sin
relación con la MAC. Es la razón por la que, si miras la IPv6 de tu laptop hoy y
mañana, probablemente no coincidan — es el comportamiento esperado, no un error.

## Autoconfiguración (SLAAC): la razón de ser del /64

**Para qué sirve:** que un host obtenga una dirección IPv6 utilizable sin necesitar
un servidor DHCP en la red — el router solo necesita anunciar el prefijo. Esto es lo
que hace posible que dispositivos IoT o equipos nuevos se conecten y "simplemente
funcionen".

**Procedimiento:**

1. El host genera su link-local `fe80::` (con EUI-64 o con IID aleatorio).
2. Envía una **Solicitud de Router (RS)** al multicast de todos los routers `ff02::2`.
3. El router responde con un **Anuncio de Router (RA)** que incluye el prefijo `/64`
   de la red y la información de gateway.
4. El host combina ese prefijo con su IID para armar su dirección global, y valida con
   **DAD** (Duplicate Address Detection) que nadie más la esté usando.

**Cuándo no alcanza SLAAC:** SLAAC no entrega datos como el servidor DNS. Para eso
existe **DHCPv6**, que se puede combinar con SLAAC de dos formas: *stateless* (solo
entrega DNS y otros datos extra, la dirección la sigue armando SLAAC) o *con estado*
(DHCPv6 asigna la dirección completa, como en IPv4).

## Transición desde IPv4: por qué no es un salto de un día

Casi ninguna red migra de IPv4 a IPv6 de golpe — conviven durante años. Estas son las
tres formas de hacerlo convivir, cada una pensada para un momento distinto de la
migración:

- **Doble pila (dual-stack):** el equipo corre IPv4 e IPv6 a la vez y usa el que el
  destino soporte. Es el método más usado hoy porque no depende de que toda la red
  esté lista para IPv6.
- **Túneles:** encapsulan tráfico IPv6 dentro de paquetes IPv4, para cuando el ISP o
  un tramo de la red todavía no soporta IPv6 de forma nativa.
- **Traducción (NAT64 / 464XLAT):** traduce entre IPv6 e IPv4, típico en redes
  móviles que ya son IPv6-only pero todavía necesitan llegar a servidores que solo
  tienen IPv4.

## Comparativa IPv4 vs IPv6

| Característica | IPv4 | IPv6 |
| :--------------- | :----- | :----- |
| Bits | 32 | 128 |
| Notación | Decimal punteada | Hexadecimal (:) |
| Broadcast | Sí | No (solo multicast) |
| Resolución de vecinos | ARP | NDP / ICMPv6 |
| Configuración | DHCP | SLAAC, DHCPv6, estática |

## Preguntas tipo CCNA

1. **¿Qué simplificación se aplica a `2001:0db8:0000:0000:0000:ff00:0042:8329`?**
   Se quitan los ceros a la izquierda y los grupos de ceros con `::`:
   `2001:db8::ff00:42:8329`.

2. **¿Por qué una LAN de usuarios casi siempre usa /64?**
   Porque SLAAC necesita exactamente 64 bits de host para generar el identificador de
   interfaz; con un prefijo más largo, SLAAC deja de funcionar en esa red.

3. **¿Por qué en IPv6 no existe broadcast?**
   Porque obligaba a todos los equipos a procesar cada paquete; se sustituye por
   **multicast** dirigido (`ff02::1` a todos los nodos, `ff02::2` a todos los
   routers).

4. **¿Cómo obtiene un host su IPv6 mediante SLAAC?**
   Envía una Solicitud de Router (RS), el router responde con un Anuncio de Router
   (RA) con el prefijo, y el host arma su dirección combinando ese prefijo con su
   IID.

5. **¿Por qué los sistemas modernos no usan EUI-64 por defecto?**
   Porque el IID derivado de la MAC no cambia, y eso hace al equipo rastreable en
   cualquier red; usan IID aleatorios (Privacy Extensions) en su lugar.

## Resumen

- IPv6 = 128 bits en hexadecimal; `::` simplifica grupos de ceros (una sola vez).
- El prefijo de LAN es /64 porque SLAAC lo necesita para generar el IID.
- No hay broadcast: todo es unicast, multicast o anycast.
- Todo interfaz tiene una link-local `fe80::/10`, la base de NDP y del next-hop.
- SLAAC autoconfigura sin DHCP; DHCPv6 se suma solo para lo que SLAAC no entrega.
- EUI-64 deriva el IID de la MAC (rastreable); Privacy Extensions lo aleatoriza.
- La transición desde IPv4 se hace con dual-stack, túneles o traducción — no de golpe.
