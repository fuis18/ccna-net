---
title: Modelo OSI y TCP/IP
description: "Las 7 capas del modelo OSI, el modelo TCP/IP de 4 capas, encapsulación y PDUs."
---

La comunicación entre dispositivos es compleja. Para simplificarla, se divide en capas.
Cada capa cumple una función concreta y solo se comunica con su capa igual en el otro
dispositivo (comunicación _peer-to-peer_).

## El modelo OSI (7 capas)

El modelo de referencia OSI, creado por la ISO, describe cómo debería fluir la
información, capa por capa, del emisor al receptor.

| Capa | Nombre       | Función principal                                           | PDU      | Equipos/protocolos   |
| :--- | :----------- | :---------------------------------------------------------- | :------- | :------------------- |
| 7    | Application  | Interfaz de usuario, servicios de red                       | Datos    | HTTP, DNS, SMTP, FTP |
| 6    | Presentation | Formato, cifrado, compresión de datos                       | Datos    | TLS, JPEG, ASCII     |
| 5    | Session      | Establece, administra y termina sesiones                    | Datos    | RPC, NetBIOS         |
| 4    | Transport    | Segmentación, control de flujo, confiabilidad               | Segmento | TCP, UDP             |
| 3    | Network      | Direccionamiento lógico y enrutamiento                      | Paquete  | IP, ICMP, routers    |
| 2    | Data Link    | Direccionamiento MAC, acceso al medio, detección de errores | Trama    | Ethernet, switches   |
| 1    | Physical     | Bits, señales eléctricas u ópticas, conectores              | Bit      | Cables, NICs, hubs   |

> **Truco para memorizar (de arriba a abajo):**
> "**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing".

## El modelo TCP/IP (4 capas)

TCP/IP es el modelo que realmente usa internet. Es práctico y agrupa varias capas del OSI.

| Capa TCP/IP  | Equivalente OSI | Protocolos principales                 |
| :----------- | :-------------- | :------------------------------------- |
| Aplicación   | 7, 6, 5         | HTTP, HTTPS, DNS, SMTP, FTP, DHCP, SSH |
| Transporte   | 4               | TCP, UDP                               |
| Internet     | 3               | IP, ICMP, ARP (a veces en capa 2)      |
| Acceso a red | 2, 1            | Ethernet, Wi-Fi, PPP                   |

### TCP vs UDP

| Característica                  | TCP                      | UDP                          |
| :------------------------------ | :----------------------- | :--------------------------- |
| Orientado a conexión            | Sí (handshake)           | No                           |
| Confiable                       | Sí (ACKs, retransmisión) | No (mejor esfuerzo)          |
| Segmentación y control de flujo | Sí                       | No                           |
| Usos                            | Web, correo, archivos    | VoIP, streaming, DNS, juegos |

## Encapsulación y desencapsulación

Al enviar datos, cada capa agrega su **cabecera** al dato recibido de la capa superior.
Ese proceso es la **encapsulación** (ocurre en el emisor). En el destino ocurre lo
contrario: **desencapsulación**, quitando cabeceras capa por capa.

> **PDU — Protocol Data Unit / Unidad de Datos de Protocolo**
> La unidad de datos de cada capa, incluyendo la cabecera que se añade al encapsular.

Cada uno de los nombres que recibe el dato al bajar de capa es su **PDU**:

1. Datos genéricos (capa 7-5): PDU = **datos**
2. **Segmento** (PDU de transporte): TCP/UDP agrega puertos de origen y destino.
3. **Paquete** (PDU de red): IP agrega direcciones IP origen y destino.
4. **Trama** (PDU de enlace de datos): Ethernet agrega direcciones MAC e _FCS_ (verificación de errores).
5. Se envían como bits (PDU de la capa física) por el medio físico.

```
TCP:  |TCP| datos                 -> Segmento (PDU de transporte)
IP:   |IP |TCP| datos             -> Paquete (PDU de red)
ETH:  |MAC|IP | TCP | datos |FCS| -> Trama (PDU de enlace de datos)
```

## Direcciones en cada capa

- **Capa 3 (IP):** dirección lógica, cambia el paquete de red a red — el enrutador la usa
  para decidir la ruta.
- **Capa 2 (MAC):** dirección física de 48 bits grabada en la NIC; solo tiene
  significado dentro de la misma red local (LAN).

El **protocolo ARP** traduce una IP de la misma subred a su dirección MAC:
para enviar a un host local, se necesita la MAC de destino.

## Preguntas tipo CCNA

1. **¿Cuántas capas tiene el modelo OSI y cuál es su PDU en la capa 4?**
   7 capas; en la capa de transporte la PDU es el **segmento**.

2. **¿Qué PDU encapsula una cabecera IP?**
   Al bajar de transporte a red, el segmento se convierte en **paquete**
   (se añaden las direcciones IP origen y destino).

3. **¿Qué protocolo usas para transferir un archivo sin riesgo de perder datos?**
   **TCP**, porque es orientado a conexión, confiable y con control de flujo.

4. **¿Qué dirección usa un switch para decidir el puerto de salida y qué capa opera?**
   La dirección **MAC** (capa 2, enlace de datos).

5. **¿Dónde se sitúa el modelo TCP/IP frente al OSI?**
   TCP/IP es el modelo práctico de 4 capas que agrupa la funcionalidad del OSI de 7 capas.

## Resumen

- OSI es el modelo de referencia (teórico): 7 capas.
- TCP/IP es el modelo de implementación (práctico): 4 capas.
- La encapsulación añade cabeceras al bajar por las capas.
- Cada capa tiene su PDU: datos, segmento, paquete, trama, bit.
