---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de QoS y Network Design: algoritmos de encolamiento, métricas, capas jerárquicas y documentación."
---

## Algoritmos de encolamiento

| Algoritmo | Colas | Tipo | Garantía | Uso |
| :-------- | :---- | :--- | :------- | :-- |
| FIFO | 1 | Por defecto | Ninguna | Enlaces sin congestión |
| PQ | 4 fijas | Prioridad estricta | Prioridad | Evitar en producción |
| CQ | 16 fijas | Round-robin | Cuota por cola | Legacy |
| WFQ | Automáticas | Peso por flujo | Equitativo | Enlaces serial (default) |
| CBWFQ | Manuales | Clases definidas | Ancho de banda | Producción estándar |
| LLQ | Manual + prioridad | Estricta + CBWFQ | Baja latencia | VoIP/Video |

## Marcado QoS

| Capa | Campo | Bits | Alcance |
| :--- | :---- | :--- | :------ |
| L2 (Ethernet) | CoS (802.1p) | 3 | Solo dentro de VLAN |
| L3 (IP) | DSCP (ToS) | 6 | End-to-end |
| L3 (IP) | IP Precedence | 3 | Legacy (pre-DSCP) |

### Valores DSCP comunes

| DSCP | Nombre | Tráfico |
| :--- | :----- | :------ |
| 0 | BE | Best Effort (default) |
| 8 | CS1 | Control de red |
| 24 | CS3 | Señalización VoIP |
| 34 | AF31 | Video streaming |
| 46 | EF | VoIP (tiempo real) |
| 48 | CS6 | Protocolos de enrutamiento |

## Métricas de calidad

| Métrica | Valor ideal VoIP | Se mide con |
| :------ | :--------------- | :---------- |
| Delay (latencia) | < 150 ms | `ping` (RTT/2) |
| Jitter | < 30 ms | `ping -t` |
| Packet Loss | < 1% | `ping`, `show interfaces` |
| Bandwidth | Suficiente para todas las clases | `show interfaces rate` |

## Modelos QoS

| Modelo | Escala | Estado | Garantía |
| :----- | :----- | :----- | :------- |
| Best-Effort | ∞ | Sin estado | Ninguna |
| IntServ | Baja | Por flujo (RSVP) | Absoluta |
| DiffServ | Alta | Por clase | Por clase |

## MQC (Modular QoS CLI)

```
class-map match-any <nombre>
  match dscp <valor>
  match access-group <n>
  exit

policy-map <nombre>
  class <nombre>
    priority <kbps>              ← cola estricta (LLQ)
    bandwidth <kbps|percent %>  ← garantía (CBWFQ)
    exit
  class class-default
    bandwidth percent <n>
    exit

interface <iface>
  service-policy output <policy-map>
```

## Capas jerárquicas

| Capa | Función | Dispositivo | Velocidad |
| :--- | :------ | :---------- | :-------- |
| Core | Transporte puro | Nexus, C9500 | 10G+ |
| Distribution | Políticas, routing | C3850, C9300 | 1G–10G |
| Access | Conexión de hosts | C2960, C9200 | 100M–1G |

## Hardware de switching

| Componente | Función |
| :--------- | :------ |
| ASIC | Chip de switching en hardware |
| TCAM | Búsqueda paralela de tablas (MAC, ACL, QoS) |
| CEF/FIB | Tabla de forwarding pre-calculada |
| Adjacency | Next-hop MAC pre-calculado |

## Comandos QoS y Design

```ios
show policy-map                    # Ver políticas QoS
show policy-map interface <iface>  # Contadores y drops por clase
show class-map                     # Ver clases
show mls qos                       # Estado QoS (switches)
show mls qos interface <iface>     # Confianza QoS por interfaz
show tcam utilization              # Uso de TCAM
show platform                      # Información del hardware
show processes cpu history         # Uso de CPU
show ip cef                        # Tabla FIB/CEF
show cdp neighbors                 # Topología CDP
show lldp neighbors                # Topología LLDP
```
