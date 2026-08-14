---
title: Seguridad de Capa 2
description: "Seguridad de capa 2: Port Security, DHCP Snooping, Dynamic ARP Inspection, IP Source Guard y mitigación de ataques de conmutación."
---

El switch es el primer punto de contacto con la red. Si no se asegura, un
atacante conectado a un puerto puede interceptar tráfico, agotar la tabla MAC o
envenenar ARP. La seguridad de capa 2 mitiga estas amenazas.

## Ataques típicos de capa 2

| Ataque                | Qué hace                                           |
| :-------------------- | :------------------------------------------------- |
| **MAC flooding**      | Inunda la tabla MAC con direcciones falsas y obliga al switch a inundar todo |
| **DHCP starvation**   | Agota el pool DHCP para lanzar luego un **DHCP rogue** (servidor falso) |
| **ARP spoofing**      | Responde a los ARP con la MAC del atacante (man-in-the-middle) |
| **VLAN hopping**      | Aprovecha trunks o el DTP para acceder a VLANs ajenas |
| **Switch no autorizado** | Conecta un switch extra para acceder al backbone |

## Port Security

**Port Security** limita cuántas **direcciones MAC** puede tener un puerto y qué
MACs están permitidas.

```ios
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2
SW1(config-if)# switchport port-security mac-address sticky
SW1(config-if)# switchport port-security violation restrict
```
| Comando                                   | Función                                      |
| :---------------------------------------- | :------------------------------------------- |
| `switchport port-security`                | Activa Port Security en el puerto            |
| `switchport port-security maximum <n>`    | Máximo de MACs permitidas (por defecto 1)    |
| `switchport port-security mac-address sticky` | Aprende la MAC del host conectado y la guarda |
| `switchport port-security violation <m> ` | Modo de acción ante una violación            |

### Modos de violación

| Modo       | Qué ocurre cuando excede el máximo            |
| :--------- | :-------------------------------------------- |
| `protect`  | Descarta tramas de MACs no permitidas, sin aviso |
| `restrict` | Descarta tramas y registra el evento (SNMP/log) |
| `shutdown` | **Deshabilita el puerto** (errdisable); requiere re-habilitarlo |

```SW1# show port-security interface GigabitEthernet0/1
Security Port MaxSecurityAddr CurrentAddr SecurityViolation Security Action
                (Macs)         (Macs)        (Count)         (Mode)
-----------------------------------------------------------------------
    Gi0/1      2              1              0               Restrict
```

> El puerto pasa a estado **errdisable** en modo `shutdown`. Para recuperarlo:
> `shutdown` + `no shutdown`, o `errdisable recovery cause psecure-violation`.

## DHCP Snooping

**DHCP Snooping** filtra los mensajes DHCP para impedir servidores falsos y
**starvation**:

- Los puertos **trusted** pueden enviar ofertas DHCP (normalmente los que van
  hacia el servidor o el trunk).
- Los puertos **untrusted** (hacia los clientes) solo pueden enviar *discover*;
  las ofertas/ACK que llegan desde ellos se descartan.

```ios
SW1(config)# ip dhcp snooping vlan 10,20
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip dhcp snooping trust
SW1(config)# interface range Gi0/1 - 23
SW1(config-if-range)# ip dhcp snooping limit rate 10
```
| Comando                              | Función                                 |
| :----------------------------------- | :-------------------------------------- |
| `ip dhcp snooping`                   | Activa DHCP Snooping globalmente        |
| `ip dhcp snooping vlan <lista>`      | Aplica el filtrado a las VLANs          |
| `ip dhcp snooping trust`             | Marca un puerto como confiable (servidor/trunk) |
| `ip dhcp snooping limit rate <n>`    | Limita paquetes DHCP/seg para evitar starvation |

## Dynamic ARP Inspection (DAI)

**DAI** valida cada mensaje **ARP** contra la base de datos de DHCP Snooping
(IP↔MAC correctas) y descarta los ARP falsos (spoofing).

```ios
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip arp inspection trust
```

- Los puertos **untrusted** (clientes) se verifican contra el binding DHCP.
- Los **trusted** (servidores, trunk) no se validan.
- Puede completarse con ARP ACLs si no hay DHCP.

## IP Source Guard

**IP Source Guard** combina DHCP Snooping para permitir solo el tráfico cuya
**IP** corresponda al binding DHCP del puerto, impidiendo que un host use una IP
ajena (spoofing de IP).

```ios
SW1(config-if)# ip verify source
```
## Protección de puertos y del switch

- **Desactivar puertos sin usar**: `interface range ... shutdown`. Evita que se
  conecten equipos no autorizados.
- **Desactivar DTP** en puertos de acceso: `switchport nonegotiate` impide que
  un host negocie un trunk (**VLAN hopping**).
- **Trunks manuales**: no usar `dynamic auto/desirable`; configurar trunks a mano
  y restringir `allowed vlan`.
- **BPDU guard** y **PortFast** en puertos de hosts (ver [STP](./spanning-tree-protocol)).
- **Storm control**: limita el tráfico broadcast/multicast/unicast por puerto.

```ios
SW1(config-if-range)# shutdown

SW1(config)# interface Gi0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport nonegotiate

SW1(config)# interface Gi0/1
SW1(config-if)# storm-control broadcast level 20
```

## Verificación

```ios
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs:
10,20
...
SW1# show ip arp inspection vlan 10
```

## Preguntas tipo CCNA

1. **¿Qué ataque agota la tabla MAC y cómo lo mitiga Port Security?**
   **MAC flooding**. Port Security limita el número de **MACs por puerto** y
   reacciona ante violaciones (`protect`, `restrict`, `shutdown`).

2. **¿Qué hace DHCP Snooping?**
   Filtra DHCP en puertos **untrusted**, permitiendo solo los mensajes de
   clientes y bloqueando servidores DHCP falsos.

3. **¿Qué protege Dynamic ARP Inspection (DAI)?**
   **ARP spoofing**: valida los mensajes ARP contra el binding de DHCP Snooping
   en puertos untrusted.

4. **¿En qué modo de violación el puerto queda errdisable?**
   En modo **`shutdown`**; hay que re-habilitarlo manualmente o con
   `errdisable recovery`.

5. **¿Cómo se evita el VLAN hopping en un puerto de acceso?**
   Con **`switchport nonegotiate`** (o `switchport mode access` + `no switchport
   trunk allowed vlan`), impidiendo que el host negocie un trunk con DTP.

## Resumen

- **Port Security**: limita MACs por puerto (`protect`/`restrict`/`shutdown`).
- **DHCP Snooping**: bloquea servidores DHCP falsos (puertos trusted/untrusted).
- **DAI**: valida ARP contra DHCP Snooping y evita ARP spoofing.
- **IP Source Guard**: impide usar una IP ajena (`ip verify source`).
- **Buenas prácticas**: puertos sin usar apagados, trunks manuales, `nonegotiate`,
  PortFast + BPDU guard y storm control.