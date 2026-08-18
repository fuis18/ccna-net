---
title: Seguridad de Capa 2
description: "Seguridad de capa 2: Port Security, DHCP Snooping, Dynamic ARP Inspection, IP Source Guard y mitigación de ataques de conmutación."
---

El switch es el primer punto de contacto con la red. Si un puerto queda abierto
sin controles, cualquiera que lo conecte puede inundar la tabla MAC, levantar
un servidor DHCP falso o hacerse pasar por otro host en la LAN. Ninguno de
estos ataques cruza un router — todos ocurren dentro del mismo segmento de
capa 2 — así que la defensa también tiene que vivir ahí, en el switch.

| Ataque                      | Qué hace                                                                                                                             |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **MAC flooding**            | Inunda la tabla MAC con direcciones falsas hasta que el switch, sin espacio, empieza a repetir todo el tráfico por todos los puertos |
| **DHCP starvation / rogue** | Agota el pool DHCP legítimo y luego ofrece direcciones desde un servidor falso                                                       |
| **ARP spoofing**            | Responde ARP con su propia MAC para interceptar tráfico ajeno (man-in-the-middle)                                                    |
| **VLAN hopping**            | Aprovecha DTP o un trunk mal restringido para alcanzar VLANs que no le corresponden                                                  |
| **Switch no autorizado**    | Conecta un switch extra a un puerto libre para ganar acceso al backbone                                                              |

## Port Security

El **MAC flooding**: es una herramienta que genera MACs
falsas para desbordar la tabla del switch, que ante la falta de espacio deja
de aprender direcciones nuevas y empieza a inundar (_flood_) todo el tráfico
por todos los puertos, exactamente lo que un atacante necesita para
esnifar tráfico ajeno.

**Port Security** cierra esta puerta limitando cuántas direcciones MAC puede
aprender un puerto y qué hacer si aparece una de más:

```ios
SW1(config-if)# switchport mode access
SW1(config-if)# switchport port-security
SW1(config-if)# switchport port-security maximum 2
SW1(config-if)# switchport port-security mac-address sticky
SW1(config-if)# switchport port-security violation restrict
```

| Comando                                       | Función                                       |
| :-------------------------------------------- | :-------------------------------------------- |
| `switchport port-security`                    | Activa Port Security en el puerto             |
| `switchport port-security maximum <n>`        | Máximo de MACs permitidas (por defecto 1)     |
| `switchport port-security mac-address sticky` | Aprende la MAC del host conectado y la guarda |
| `switchport port-security violation <modo>`   | Acción ante una violación                     |

El modo de violación decide qué tan agresiva es la respuesta:

| Modo       | Qué ocurre al exceder el máximo                           |
| :--------- | :-------------------------------------------------------- |
| `protect`  | Descarta tramas de MACs no permitidas, sin registrar nada |
| `restrict` | Descarta tramas y además genera un log/SNMP con el evento |
| `shutdown` | Deja el puerto en **errdisable**, completamente apagado   |

```ios
SW1# show port-security interface GigabitEthernet0/1
Security Port MaxSecurityAddr CurrentAddr SecurityViolation Security Action
                (Macs)         (Macs)        (Count)         (Mode)
-----------------------------------------------------------------------
    Gi0/1      2              1              0               Restrict
```

Con `maximum 2` y modo `restrict`, en cuanto aparece una tercera MAC en ese
puerto, el switch descarta su tráfico y lo registra — el flooding deja de
tener efecto porque nunca hay espacio real para las MACs falsas. Si en su
lugar se hubiera usado `shutdown`, el puerto pasaría a errdisable, y para
recuperarlo hace falta `shutdown` + `no shutdown`, o dejarlo automatizado con
`errdisable recovery cause psecure-violation`.

## DHCP Snooping

Semanas después, en otro piso, varios usuarios reportan que no pueden salir a
internet y que su IP no corresponde a ningún rango conocido de la empresa. Un
compañero conectó un router doméstico a un puerto de pared para tener su
propio Wi-Fi, sin saber que ese router también reparte direcciones IP por
DHCP.
Ocurre cuando se conecta otro router con su propio DHCP activo, respondiendo en la misma VLAN, y algunas computadoras terminan tomando la configuración del router falso — con su propio gateway, que no lleva a ningún lado real.

**DHCP Snooping** resuelve esto tratando los puertos de forma asimétrica:

- Los puertos **trusted** pueden enviar respuestas DHCP (oferta, ACK) — se
  marcan así solo los que van hacia el servidor DHCP legítimo o hacia otro
  switch por trunk.
- Los puertos **untrusted** (el resto, hacia los clientes) solo pueden enviar
  _discover_/_request_; cualquier oferta o ACK que llegue desde uno de ellos
  se descarta de inmediato, sin importar de dónde venga.

```ios
SW1(config)# ip dhcp snooping
SW1(config)# ip dhcp snooping vlan 10,20
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip dhcp snooping trust
SW1(config)# interface range Gi0/1 - 23
SW1(config-if-range)# ip dhcp snooping limit rate 10
```

| Comando                           | Función                                                |
| :-------------------------------- | :----------------------------------------------------- |
| `ip dhcp snooping`                | Activa DHCP Snooping globalmente                       |
| `ip dhcp snooping vlan <lista>`   | Aplica el filtrado a esas VLANs                        |
| `ip dhcp snooping trust`          | Marca un puerto como confiable (servidor/trunk)        |
| `ip dhcp snooping limit rate <n>` | Limita paquetes DHCP/seg por puerto (evita starvation) |

Con esto, el puerto donde está el router doméstico queda untrusted por
defecto: sus ofertas DHCP se descartan y los clientes vuelven a recibir
dirección solo del servidor legítimo, conectado al puerto Gi0/24 marcado como
trusted.

## Dynamic ARP Inspection (DAI)

DHCP Snooping, además de bloquear servidores falsos, va guardando una tabla
de bindings — qué IP le corresponde a qué MAC y en qué puerto, según lo que
realmente entregó el servidor DHCP legítimo. Esa tabla es la base para
resolver otro problema: un usuario reporta que, de vez en cuando, su tráfico
tarda más de lo normal y `arp -a` en su equipo muestra que la MAC del gateway
cambió sin motivo. Es **ARP spoofing**: otro host en la misma VLAN está
respondiendo con su propia MAC cuando alguien pregunta por la IP del gateway,
para interceptar el tráfico antes de reenviarlo (man-in-the-middle).

**DAI** usa la tabla de bindings de DHCP Snooping para validar cada mensaje
ARP que llega por un puerto untrusted: si la IP y la MAC del mensaje no
coinciden con lo que el binding dice que debería ser, lo descarta.

```ios
SW1(config)# ip arp inspection vlan 10,20
SW1(config)# interface GigabitEthernet0/24
SW1(config-if)# ip arp inspection trust
```

Los puertos trusted (servidores, enlaces entre switches) no se validan; el
resto sí, contra el binding DHCP. Sin DHCP Snooping activo no hay tabla que
consultar, así que DAI depende de tenerlo configurado primero — o, en su
defecto, de ARP ACLs manuales para las IPs estáticas que DHCP Snooping no
puede ver.

## IP Source Guard

Con DAI en marcha, el spoofing de ARP queda cubierto, pero un host todavía
podría cambiarse manualmente a una IP que no le corresponde — la de un
servidor, por ejemplo — para saltarse una ACL que filtra por dirección IP.
**IP Source Guard** cierra esa variante reutilizando otra vez el binding de
DHCP Snooping, pero esta vez para filtrar el tráfico IP saliente del puerto,
no solo el ARP:

```ios
SW1(config-if)# ip verify source
```

Si la IP de origen de un paquete no coincide con la que el binding DHCP
asignó a ese puerto, se descarta antes de reenviarlo.

## Endurecimiento adicional del switch

El resto de controles no depende de un ataque específico detectado, sino de
reducir la superficie disponible antes de que algo pase:

```ios
SW1(config)# interface range Gi0/10 - 23
SW1(config-if-range)# shutdown

SW1(config)# interface Gi0/24
SW1(config-if)# switchport mode trunk
SW1(config-if)# switchport nonegotiate

SW1(config)# interface Gi0/1
SW1(config-if)# storm-control broadcast level 20
```

- **Puertos sin usar, apagados** (`shutdown`): un puerto libre en una sala de
  juntas o un pasillo es la forma más simple de conectar un switch o un
  laptop no autorizado.
- **`switchport nonegotiate`** en puertos de acceso: desactiva DTP para que
  un host no pueda negociar un trunk consigo mismo y alcanzar VLANs ajenas
  (VLAN hopping).
- **Trunks configurados a mano**, sin `dynamic auto/desirable`, y con
  `switchport trunk allowed vlan` restringido a lo estrictamente necesario.
- **BPDU guard** y **PortFast** en puertos de host, para que no puedan
  participar en STP (ver [STP](./spanning-tree-protocol)).
- **Storm control**, para limitar el tráfico broadcast/multicast/unicast por
  puerto y contener el impacto de un flooding que logre pasar los demás
  controles.

## Verificación

```ios
SW1# show ip dhcp snooping
Switch DHCP snooping is enabled
DHCP snooping is configured on following VLANs:
10,20

SW1# show ip dhcp snooping binding
MacAddress          IpAddress    Lease(sec)  Type       VLAN  Interface
00:1A:2B:3C:4D:5E   10.0.10.15   86400       dhcp-snoop  10   GigabitEthernet0/3

SW1# show ip arp inspection vlan 10
```

`show ip dhcp snooping binding` es el punto de partida para diagnosticar
tanto DAI como IP Source Guard, porque ambos dependen de esa tabla: si un
binding no aparece ahí, ese host va a fallar la validación aunque su tráfico
sea legítimo.

## Resumen

- **Port Security** contiene el MAC flooding limitando cuántas MACs puede
  aprender un puerto (`protect` / `restrict` / `shutdown`).
- **DHCP Snooping** bloquea servidores DHCP falsos distinguiendo puertos
  trusted (hacia el servidor real) de untrusted (hacia los clientes), y
  construye la tabla de bindings IP-MAC-puerto.
- **DAI** reutiliza esa tabla para descartar ARP spoofing en puertos
  untrusted.
- **IP Source Guard** reutiliza la misma tabla para impedir que un host
  falsifique su propia IP de origen.
- El resto — puertos sin usar apagados, `nonegotiate`, trunks manuales,
  BPDU guard/PortFast y storm control — reduce la superficie de ataque antes
  de que cualquiera de los anteriores tenga que entrar en acción.
