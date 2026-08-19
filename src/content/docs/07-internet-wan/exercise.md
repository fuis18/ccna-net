---
title: "Ejercicio: Conexión al ISP"
description: "Ejercicio incremental 6: configuración detallada del enlace WAN hacia el ISP (encapsulación, autenticación PPP, verificación de salida a internet)."
---

Última parte de la serie. La red del edificio ya tiene VLANs, routing,
redundancia, seguridad, WLAN y servicios IP (DHCP, NAT, ACLs). Lo que falta es
**formalizar y verificar la frontera con el ISP**: la configuración detallada
del enlace WAN de R1 — encapsulación, autenticación y confirmación de que
realmente hay salida a internet.

```mermaid
graph LR
    LAN[Red del edificio] --> R1[R1]
    R1 -->|"Serial0/0/0 10.0.0.1/30"| ISP[Router del ISP 10.0.0.2]
    ISP --> I[(Internet)]
```

## Requisitos

- Red completa del [ejercicio anterior](../06-ip-services/ejercicio): VLANs,
  routing, NAT/PAT y ACLs funcionando.
- En la Parte 2 ya se puso la IP del enlace WAN (`10.0.0.1/30`) y la ruta por
  defecto; ahora vas a configurar el enlace **en detalle**.
- El equipo del ISP (10.0.0.2) está listo del otro lado.

## Objetivos

1. Revisar el estado actual del enlace WAN de R1.
2. Configurar la encapsulación correcta (HDLC o PPP) y, con PPP, la
   autenticación CHAP.
3. Verificar la tabla de enrutamiento y las traducciones NAT.
4. Confirmar la salida a internet de extremo a extremo.

## Pasos

### 1. Estado actual del enlace

```ios
R1# show running-config interface Serial0/0/0
R1# show interfaces Serial0/0/0
R1# show ip interface brief
```

Deberías ver la IP `10.0.0.1/30` ya asignada y la interfaz en `up/up`. La
encapsulación, salvo que se haya cambiado, es **HDLC** (la de Cisco).

### 2. Encapsulación y autenticación

Si el equipo del ISP es de **Cisco**, HDLC es suficiente. Si es de **otro
fabricante**, hay que usar **PPP** — la encapsulación estándar — y, si el
proveedor lo exige, autenticación con **CHAP**:

```ios
R1(config)# username ISP password ClaveWan!
R1(config)# interface Serial0/0/0
R1(config-if)# encapsulation ppp
R1(config-if)# ppp authentication chap
R1(config-if)# end
```

| Comando                    | Función                                      |
| :------------------------- | :------------------------------------------- |
| `encapsulation ppp`        | Cambia HDLC (Cisco) a PPP (estándar)         |
| `ppp authentication chap`  | El ISP y R1 se autentican mutuamente         |
| `username <peer> password` | Clave compartida para CHAP (igual en el ISP) |

> El nombre de usuario del `username` debe coincidir con el **hostname** que el
> ISP tiene en su propio router, y la contraseña debe ser la misma en ambos
> lados; si no, la negociación PPP/CHAP falla y el enlace se queda `down`.

### 3. Verificación del enlace y las rutas

```ios
R1# show interfaces Serial0/0/0
R1# show ip route
R1# show ip nat translations
```

- `Serial0/0/0` en `up/up` y encapsulación `PPP`.
- `S* 0.0.0.0/0` hacia 10.0.0.2 (ruta por defecto de la Parte 2).
- En `show ip nat translations`, tu IP pública 200.200.200.1 traducida.

### 4. Salida a internet

```bash
R1# ping 8.8.8.8
PC-Ventas# ping 8.8.8.8
```

Si desde la PC responde, el flujo completo funciona: host → VLAN → router →
**enlace WAN** → ISP → internet (con NAT/PAT de la Parte 5).

### 5. (Opcional) IP por DHCP en fibra

Si en vez de una línea dedicada el contrato es de fibra/cable y el ISP entrega
la IP por DHCP:

```ios
R1(config)# interface GigabitEthernet0/1
R1(config-if)# description Enlace WAN hacia el ISP
R1(config-if)# ip address dhcp
R1(config-if)# no shutdown
R1(config-if)# end
R1# show ip dhcp lease
```

## Comprobación final

| Pregunta                         | Respuesta esperada            |
| :------------------------------- | :---------------------------- |
| ¿Encapsulación del enlace?       | HDLC (Cisco) o PPP (estándar) |
| ¿CHAP autentica con el ISP?      | Sí, con la clave compartida   |
| ¿Interfaz WAN en up/up?          | Sí, con 10.0.0.1/30           |
| ¿Ruta por defecto al ISP?        | `S* 0.0.0.0/0` via 10.0.0.2   |
| ¿Salida a internet desde una PC? | Sí, `ping 8.8.8.8` responde   |

## Resumen

- El enlace WAN quedó configurado **en detalle**: encapsulación HDLC o PPP, y
  autenticación CHAP cuando el proveedor la exige.
- La ruta por defecto (Parte 2) y el NAT/PAT (Parte 5) completan el camino a
  internet.
- El `ping 8.8.8.8` de extremo a extremo confirma el edificio completo.

Guarda la configuración final:

```ios
R1# copy running-config startup-config
```

Con esto, el edificio de un piso queda **completo y conectado a internet**:
identificado, segmentado, enrutado, redundante, seguro, inalámbrico, con
servicios IP autónomos y con su frontera WAN hacia el ISP verificada.
