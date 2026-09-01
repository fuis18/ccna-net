---
title: Software-Defined Networking (SDN)
description: "SDN: separación del plano de control y datos, OpenFlow, Cisco ACI, overlay vs underlay y red programable."
---

**SDN** (Software-Defined Networking) separa el **plano de control** (decisiones
de enrutamiento) del **plano de datos** (forwarding de paquetes) y lo
centraliza en un controlador. Esto convierte la red en una plataforma
programable.

## Plano de control vs plano de datos

### Tradicional (sin SDN)

Cada dispositivo **toma sus propias decisiones** de forwarding. El control y
los datos están **acoplados** en el mismo hardware.

```mermaid
graph TB
    R1[Router 1] -->|decide + forward| R2[Router 2]
    R2 -->|decide + forward| R3[Router 3]
```

- Cada router ejecuta protocolos de enrutamiento (OSPF, BGP).
- No hay vista global de la red.
- Los cambios se hacen dispositivo por dispositivo.

### SDN

Un **controlador centralizado** toma las decisiones. Los dispositivos solo
**forwarding** según las instrucciones del controlador.

```mermaid
graph TB
    CTRL[Controlador SDN<br>Control Plane]
    CTRL -->|OpenFlow / API| SW1[Switch 1<br>Forwarding Plane]
    CTRL -->|OpenFlow / API| SW2[Switch 2<br>Forwarding Plane]
    CTRL -->|OpenFlow / API| SW3[Switch 3<br>Forwarding Plane]
    SW1 --- SW2
    SW2 --- SW3
```

- El controlador tiene **visibilidad global** de la red.
- Los switches se configuran **programáticamente**.
- La red se puede adaptar dinámicamente a cambios de tráfico.

## Arquitectura SDN

```mermaid
graph TB
    subgraph Apps["Aplicaciones SDN"]
        A1[Optimización de tráfico]
        A2[Seguridad]
        A3[Carga balanceada]
    end
    subgraph Controller["Controlador SDN"]
        C1[API Norte - REST]
        C2[Control Logic]
        C3[API Sur - OpenFlow]
    end
    subgraph Infrastructure["Infraestructura"]
        S1[Switch 1]
        S2[Switch 2]
        S3[Switch 3]
    end
    Apps --> C1
    C1 --> C2
    C2 --> C3
    C3 --> S1
    C3 --> S2
    C3 --> S3
```

### Capas SDN

| Capa | Función | Ejemplo |
| :--- | :------ | :------ |
| **Application** | Apps de red (seguridad, QoS, monitoring) | Cisco APIC-EM |
| **Control** | Controlador centralizado con vista global | OpenDaylight, ONOS |
| **Infrastructure** | Dispositivos con plano de datos programable | Switches OpenFlow |

### APIs

| API | Dirección | Función |
| :-- | :-------- | :------ |
| **Norte** (Northbound) | App → Controlador | REST API para aplicaciones |
| **Sur** (Southbound) | Controlador → Dispositivos | OpenFlow, NETCONF, gNMI |

## OpenFlow

Protocolo **estándar** de SDN para comunicar el controlador con los switches.
Define cómo el controlador puede **leer, modificar y enviar** tablas de
forwarding en los switches.

### Flujo OpenFlow

```mermaid
graph LR
    Paquete[Paquete entrante] --> T1[Tabla 1<br>Match fields]
    T1 -->|Match| A1[Acción: forward]
    T1 -->|No match| T2[Tabla 2<br>Next table]
    T2 -->|No match| Controller[Enviar al<br>Controlador]
```

### Campos de match

| Campo | Ejemplo |
| :---- | :------ |
| Ingress port | Puerto de entrada |
| Source MAC | MAC del remitente |
| Destination MAC | MAC del destino |
| EtherType | IPv4, IPv6, ARP |
| VLAN ID | 10, 20, 30 |
| Source IP | 192.168.10.10 |
| Destination IP | 10.0.0.1 |
| IP Protocol | TCP, UDP, ICMP |
| TCP/UDP Port | 80, 443, 5060 |

### Acciones OpenFlow

| Acción | Descripción |
| :----- | :---------- |
| Forward | Enviar a un puerto específico |
| Drop | Descartar el paquete |
| Modify field | Cambiar VLAN tag, DSCP, etc. |
| Send to controller | Enviar al controlador para decisión |

## Cisco ACI (Application Centric Infrastructure)

La implementación de SDN de **Cisco** para data centers. Usa el **APIC**
(Application Policy Infrastructure Controller) como controlador central.

### Componentes ACI

| Componente | Función |
| :--------- | :------ |
| **APIC** | Controlador central (maneja políticas) |
| **Spine** | Switches de backbone (alto rendimiento) |
| **Leaf** | Switches de acceso (conectan VMs/servidores) |
| **Fabric** | Red completa Spine-Leaf con ACI |

```mermaid
graph TB
    subgraph APIC["APIC Controller"]
        C1[Policy Engine]
    end
    subgraph Fabric["ACI Fabric"]
        SP1[Spine 1]
        SP2[Spine 2]
        LEAF1[Leaf 1]
        LEAF2[Leaf 2]
    end
    C1 --- SP1
    C1 --- SP2
    SP1 --- LEAF1
    SP1 --- LEAF2
    SP2 --- LEAF1
    SP2 --- LEAF2
```

### Modelo de datos en ACI

ACI usa un **modelo de datos** declarativo: defines el **estado deseado** y el
controlador ejecuta los cambios necesarios.

- **Tenant**: división lógica (multi-tenant).
- **Application Profile**: agrupación de EPGs por aplicación.
- **EPG** (Endpoint Group): grupo de endpoints con la misma política.
- **Contract**: reglas de comunicación entre EPGs.

## Overlay vs Underlay

| Concepto | Underlay | Overlay |
| :------- | :------- | :------ |
| Qué es | Red física IP | Red virtual construida sobre el underlay |
| Capa | L2/L3 real | L2/L3 virtual |
| Ejemplo | OSPF entre switches | VXLAN entre VTEPs |
| Propósito | Transporte | Segmentación, extensión |

```mermaid
graph TB
    subgraph Overlay["Overlay: Red virtual VXLAN"]
        VM1[VM A] --- VM2[VM B]
    end
    subgraph Underlay["Underlay: Red física OSPF"]
        SW1[SW1] --- SW2[SW2]
        SW2 --- SW3[SW3]
    end
    SW1 -.->|VTEP| SW3
```

- **Underlay** transporta paquetes IP normales.
- **Overlay** crea dominios L2 virtuales sobre el underlay.
- Los protocolos overlay (VXLAN, GRE) encapsulan tramas L2 dentro de paquetes L3.

## Beneficios de SDN

| Beneficio | Descripción |
| :-------- | :---------- |
| Centralización | Un solo punto de gestión y visibilidad |
| Programabilidad | APIs para automatizar y personalizar |
| Agilidad | Cambios en minutos, no horas |
| Visibilidad | Vista global de la red en tiempo real |
| Segmentación | Políticas basadas en aplicación, no en IP |

## Verificación

```ios
R1# show ip ospf neighbor                  # Underlay routing
R1# show interface nve 1                   # VXLAN (NVE interface)
SW1# show vxlan vni                       # VNIs activos
SW1# show nve peers                       # VTEPs vecinos
```
