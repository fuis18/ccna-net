---
title: Redes Jerárquicas y Escalables
description: "Diseño de red en capas: Core, Distribution y Access; modelos colapsados; hardware de switching (ASICs, TCAM, CEF)."
---

Una red profesional no se diseña al azar. El **modelo jerárquico** divide la
red en capas con responsabilidades claras, facilitando la escalabilidad, el
mantenimiento y la resolución de problemas.

## Modelo jerárquico de tres capas

```mermaid
graph TB
    subgraph Core["Core Layer"]
        C1[Core Router/Switch]
    end
    subgraph Distribution["Distribution Layer"]
        D1[Distribution SW1]
        D2[Distribution SW2]
    end
    subgraph Access["Access Layer"]
        A1[Access SW1]
        A2[Access SW2]
        A3[Access SW3]
    end
    C1 --- D1
    C1 --- D2
    D1 --- A1
    D1 --- A2
    D2 --- A2
    D2 --- A3
```

### Core Layer (Núcleo)

La **columna vertebral** de alta velocidad. Conecta las capas de distribución
y mueve la mayor cantidad de tráfico a la mayor velocidad posible.

| Característica | Descripción |
| :------------- | :---------- |
| Velocidad | Máxima (10 Gbps+, 40 Gbps+) |
| Función | Transporte puro, switching rápido |
| **NO hace** | Filtrado,ACLs, QoS complejo, enrutamiento lento |
| Dispositivos | Routers de alta gama, Nexus, Catalyst 9500 |

> **Regla de oro**: el Core solo mueve paquetes. Si necesitas filtrar o
> procesar, no es Core.

### Distribution Layer (Distribución)

La capa de **resumen y políticas**. Agrega los enlaces de Access y aplica
políticas (QoS, ACLs, filtrado, enrutamiento entre VLANs).

| Característica | Descripción |
| :------------- | :---------- |
| Velocidad | Alta (1 Gbps – 10 Gbps) |
| Función | Resumen de rutas, políticas, L3 routing |
| **Hace** | Enrutamiento inter-VLAN, ACLs, QoS, DHCP relay |
| Dispositivos | Catalyst 3850/9300, routers con switching |

### Access Layer (Acceso)

Donde los **hosts se conectan** a la red. switches de acceso con puertos de
1 Gbps para PCs, teléfonos, APs, impresoras.

| Característica | Descripción |
| :------------- | :---------- |
| Velocidad | 100 Mbps – 1 Gbps por puerto |
| Función | Conexión de endpoints |
| **Hace** | VLANs, Port Security, BPDU Guard, PoE |
| Dispositivos | Catalyst 2960, 9200, puertos de acceso |

## Modelo colapsado (Core/Distribution)

En redes **pequeñas y medianas**, las capas Core y Distribution se combinan
en una sola. Es el caso más común en edificios de oficinas.

```mermaid
graph TB
    subgraph Core-Dist["Core/Distribution"]
        R1[Router/Core SW]
    end
    subgraph Access["Access Layer"]
        A1[SW1]
        A2[SW2]
        A3[SW3]
    end
    R1 --- A1
    R1 --- A2
    R1 --- A3
```

- Un solo dispositivo hace routing, QoS, ACLs y connectividad al ISP.
- Los switches de acceso se conectan directamente a este equipo.
- Es el escenario del **edificio de un piso** en los ejercicios de esta guía.

## Hardware de switching

### ASICs (Application-Specific Integrated Circuits)

Chips **diseñados exclusivamente** para switching. A diferencia de un router
que usa CPU general, un switch usa ASICs para procesar tramas a velocidad
cableada.

- **No ejecutan IOS** como los routers; usan firmware especializado.
- Velocidad de switching: millones de paquetes por segundo (pps).
- No son programables (a diferencia de switches SDN).

### TCAM (Ternary Content-Addressable Memory)

Memoria **especializada** que busca en paralelo múltiples entradas en un solo
ciclo de reloj. Se usa para:

| Tabla | Uso |
| :---- | :-- |
| MAC address table | Forwarding de tramas L2 |
| ACL CAM | Evaluación de ACLs |
| QoS CAM | Clasificación de tráfico |
| Routing CAM | Tabla de enrutamiento CEF |

- Un TCAM típico tiene **256K–1M entradas** de 160–320 bits.
- Si la tabla TCAM se llena, el dispositivo puede funcionar en **software
  fallback** (mucho más lento).

### CEF (Cisco Express Forwarding)

Mecanismo de **forwarding en hardware** que pre-calcula la tabla de
enrutamiento FIB (Forwarding Information Base) y la tabla adjacency.

```mermaid
graph LR
    A[CPU: Routing<br>calcula FIB] --> B[FIB<br>tabla de forwarding]
    A --> C[Adjacency<br>tabla de next-hop]
    B --> D[ASIC: hardware<br>forwarding]
    C --> D
```

- **FIB**: tabla de forwarding derivada de la tabla de routing (RIB).
- **Adjacency table**: next-hop MAC addresses pre-calculadas.
- **Sin CEF**: el router busca en la tabla de routing por cada paquete (lento).
- **Con CEF**: el ASIC busca en FIB/Adjacency y procesa a velocidad cableada.

```ios
R1(config)# ip cef           # Habilitar CEF (viene habilitado por defecto)
R1# show ip cef              # Ver tabla FIB
R1# show ip cef exact-route 10.0.0.1 10.0.0.2  # Ruta exacta de un paquete
```

## Diseñar una red escalable

### Principios clave

1. **Modularidad**: dividir en bloques funcionales (pisos, departamentos).
2. **Redundancia**: doble enlace entre capas (EtherChannel, STP).
3. **Resumen**: las rutas se resumen en Distribution, no en Access.
4. **Separación**: datos, voz y gestión en VLANs separadas.
5. **Documentación**: topología, IPs, cambios.

### Ejemplo: red de un edificio de 3 pisos

```mermaid
graph TB
    subgraph Piso3["Piso 3 - Oficinas"]
        SW6[SW6 - Acceso]
    end
    subgraph Piso2["Piso 2 - Oficinas"]
        SW4[SW4 - Acceso]
        SW5[SW5 - Acceso]
    end
    subgraph Piso1["Piso 1 - Recepción + IT"]
        SW1[SW1 - Acceso]
        SW2[SW2 - Acceso]
        SW3[SW3 - Acceso]
    end
    subgraph Core["Core/Distribution"]
        R1[R1 - Core]
        R2[R2 - Core]
    end
    R1 --- R2
    R1 --- SW1
    R1 --- SW4
    R2 --- SW2
    R2 --- SW5
    R1 --- SW6
    R2 --- SW3
```

- Cada piso es un **bloque de acceso** independiente.
- R1 y R2 son **Core/Distribution** con HSRP para redundancia.
- Las VLANs se mapean por función (10=datos, 20=voz, 30=WiFi, 99=gestión).

## Verificación de hardware

```ios
SW1# show version                              # Modelo, memoria, ASICs
SW1# show platform                             # Información del hardware
SW1# show mac address-table                     # Tabla MAC (CAM)
SW1# show interfaces counters                   # Contadores de tráfico
SW1# show processes cpu history                  # Uso de CPU历史
SW1# show tcam utilization                      # Uso de TCAM
```
