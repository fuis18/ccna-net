---
title: "Ejercicio: Switching y Seguridad"
description: "Ejercicio incremental 3: STP/RSTP, EtherChannel y seguridad de capa 2 sobre la red del edificio."
---

Tercera parte de la serie. La red del [ejercicio anterior](../03-network-configuration/exercise)
ya funciona; ahora la harás **redundante y segura en la capa de conmutación**.
Añade un segundo enlace entre switches para que la red sobreviva a fallas de
cable, y protege el acceso de capa 2 para que nadie pueda atacar desde un
puerto.

```mermaid
graph LR
    V[PC Ventas] --> SW1
    S[PC Sistemas] --> SW2
    SW1[SW1] ===|EtherChannel 4 enlaces| SW2[SW2]
    SW1 --- R1[R1]
```

## Requisitos

- Red funcional del [ejercicio anterior](../03-network-configuration/exercise):
  VLANs 10/20/99, trunks y router-on-a-stick con R1.

## Objetivos

1. Evitar bucles y acelerar la convergencia con **RSTP** (root primary/secondary
   y PortFast).
2. Aprovechar todos los enlaces SW1-SW2 con **EtherChannel (LACP)**.
3. Asegurar la capa 2: Port Security, DHCP Snooping, DAI y IP Source Guard.
4. Verificar redundancia simulando fallas.

## Pasos

### 1. STP / RSTP

En los tres switches usa `rapid-pvst`. SW1 será la **raíz primaria** y SW2 la
**secundaria**, y los puertos de hosts usan PortFast + BPDU guard:

```ios
SW1(config)# spanning-tree mode rapid-pvst
SW1(config)# spanning-tree vlan 10,20,99 root primary

SW2(config)# spanning-tree mode rapid-pvst
SW2(config)# spanning-tree vlan 10,20,99 root secondary

SW1(config)# interface range FastEthernet0/1 - 12
SW1(config-if-range)# switchport host
```

> `switchport host` = access + PortFast + BPDU guard en un solo comando.

### 2. EtherChannel entre SW1 y SW2

Sustituye el enlace único entre SW1 y SW2 por **4 enlaces** agrupados en un
Port-channel con LACP:

```ios
SW1(config)# interface range GigabitEthernet0/1 - 4
SW1(config-if-range)# channel-group 1 mode active
SW1(config-if-range)# exit
SW1(config)# interface Port-channel 1
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport trunk native vlan 99
SW1(config-if)# switchport trunk allowed vlan 10,20,99
```

En **SW2**, lo mismo con `mode passive`. Recuerda: la config de trunk va en el
Port-channel, no en cada puerto físico.

### 3. Seguridad de capa 2

En SW1 (y SW2 en sus puertos de PC):

```ios
# Port Security en los puertos de host
SW1(config)# interface range FastEthernet0/1 - 12
SW1(config-if-range)# switchport port-security
SW1(config-if-range)# switchport port-security maximum 2
SW1(config-if-range)# switchport port-security mac-address sticky
SW1(config-if-range)# switchport port-security violation restrict

# DHCP Snooping + DAI (el servidor DHCP estará en R1 por el trunk)
SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10,20
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip dhcp snooping trust
SW1(config)# interface range FastEthernet0/1 - 12
SW1(config-if-range)# ip dhcp snooping limit rate 10
SW1(config-if-range)# exit
SW1(config)# ip arp inspection vlan 10,20
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip arp inspection trust

# IP Source Guard en puertos de host
SW1(config)# interface range FastEthernet0/1 - 12
SW1(config-if-range)# ip verify source
```

> Marca como **trusted** solo el puerto hacia R1 (trunk). El resto queda
> untrusted: no puede enviar ofertas DHCP ni ARP falsos.

## Verificación

### Redundancia

```ios
SW1# show spanning-tree vlan 10        # root: SW1
SW2# show spanning-tree vlan 10        # root: SW1 (root port hacia SW1)
SW1# show etherchannel summary         # Po1(SU), Gi0/1-4 (P)
```

### Seguridad

```ios
SW1# show port-security interface FastEthernet0/1
SW1# show ip dhcp snooping binding
SW1# show ip arp inspection vlan 10
```

### Prueba de falla

1. Conecta una PC de Ventas y verifica que ping a la otra VLAN funcione.
2. Desconecta uno de los cables del EtherChannel: el tráfico sigue pasando por
   los 3 restantes sin cortarse.
3. Conecta un router doméstico con DHCP a un puerto de host: sus ofertas deben
   ser descartadas (DHCP Snooping).

## Comprobación final

| Pregunta                        | Respuesta esperada                      |
| :------------------------------ | :-------------------------------------- |
| ¿Quién es la raíz STP?          | SW1 (primary); SW2 secundario           |
| ¿Los 4 enlaces SW1-SW2 activos? | Sí, Po1 con Gi0/1-4 (P)                 |
| ¿Puerto con router doméstico?   | Se deshabilita/descarta (DHCP Snooping) |

## Resumen

- La red sobrevive a fallas de **enlaces** (EtherChannel) y de **switches**
  (STP).
- La capa 2 está protegida: Port Security, DHCP Snooping, DAI e IP Source Guard.
- Guarda la configuración de todos los equipos:
  `copy running-config startup-config`.

En el [Módulo 6: Routing y Redundancia](../06-routing-redundancy/) añadirás el
**gateway redundante** con HSRP a la misma red.
