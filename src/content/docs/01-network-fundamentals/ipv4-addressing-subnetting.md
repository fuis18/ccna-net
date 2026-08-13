---
title: Direccionamiento IPv4 y Subnetting
description: Estructura de IPv4, máscara de subred, CIDR, subnetting y VLSM con ejemplos paso a paso.
---

Sigue esta progresión para aprender IPv4 sin mezclar conceptos:

1. **Una dirección** → sus partes y la máscara de subred.
2. **Escalar** → cambiar la máscara para tener más hosts (CIDR).
3. **Dividir** → robar bits de host para tener varias subredes (subnetting).
4. **Medir** → dar a cada subred el tamaño justo (VLSM).

## 1. Una dirección IPv4

La dirección IPv4 es un número de **32 bits** que identifica de forma lógica a un host
dentro de una red. Se escribe en notación decimal punteada, en **4 octetos** de 8 bits
cada uno:

```
192.168.10.5  =  11000000.10101000.00001010.00000101
```

Cada octeto va de 0 a 255 (2^8 - 1).

### Partes de una dirección

Toda dirección tiene dos partes:

- **Red:** El conjunto de dispositivos que comparten una misma porción de red.
- **Host:** Su dirección identifica de forma única a cada dispositivo conectado.

**En la práctica:**

- **Porción de host → comunicación directa.** Dos dispositivos con la misma porción de
  red se comunican directamente (sin router): buscan la MAC de destino y envían la
  trama por el conmutador. Ejemplo: `192.168.10.5` puede hablar directo con
  `192.168.10.7` porque ambos están en `192.168.10.0/24`.
- **Porción de red → aislamiento.** Si las porciones de red difieren, son redes
  distintas y **no se comunican directamente**: cada una queda aislada de la otra. Para
  cruzar la frontera se necesita un **router** (la "puerta", que actúa como gateway).

```
PC-A 192.168.10.5  ──┬─────────────┬──  PC-B 192.168.10.7   (misma red → directo)
        |            switch        |
PC-C 192.168.20.5  ─┴──────┬──────┴──  ...                  (red distinta → aislada)
                          router  (delimita cada red)
```

### La máscara de subred

La **máscara de subred** indica cuántos bits son de **red**. Tiene **unos
consecutivos** a la izquierda y **ceros** a la derecha:

```
Dirección: 192.168.10.5
Máscara:   255.255.255.0
           11111111.11111111.11111111.00000000
           <--- 24 bits de red -->  <- 8 bits de host ->
```

En decimal, un octeto `255` son 8 bits de red y un `0` son 8 bits de host.

> En toda subred, la **primera** dirección es la de **red** (bits de host en cero) y
> la **última** es la de **broadcast** (bits de host en uno). Las **intermedias** son
> las direcciones de host utilizables.

Por ejemplo, en `192.168.10.0/24`:

- red `192.168.10.0`
- broadcast `192.168.10.255`,
- hosts utilizables `192.168.10.1 – .254`.

## 2. Escalando: cambiar la máscara (CIDR)

"¿Y si una sola red no alcanza?" La cantidad de hosts la decide la máscara. Si quieres
**más hosts**, usas una máscara con **menos bits de red** y más bits de host:

```
255.255.0.0       (/16)  ->  65.534 hosts
255.255.255.0     (/24)  ->  254 hosts
255.255.255.252   (/30)  ->  2 hosts
```

**CIDR** resume la máscara como `/n`, donde `n` es el número de bits en 1. La fórmula:

```
Hosts utilizables  =  2^(32 - n) - 2
```

Ejemplo `/24`: `2^(32-24) - 2 = 2^8 - 2 = 254`.

| Prefijo | Máscara         | Hosts útiles |
| :------ | :-------------- | :----------- |
| /16     | 255.255.0.0     | 65.534       |
| /24     | 255.255.255.0   | 254          |
| /25     | 255.255.255.128 | 126          |
| /26     | 255.255.255.192 | 62           |
| /30     | 255.255.255.252 | 2            |

## 3. Dividir: subnetting

"¿Y si necesito **varias** redes (sedes, oficinas)?" Tomo una red grande y la parto en
subredes más pequeñas. Para eso **robo bits** de la porción de host y los convierto en
bits de red.

```
Subredes creadas   = 2^n        (n = bits de host robados)
Hosts por subred   = 2^h - 2    (h = bits de host restantes)
Prefijo            = 32 - h
```

### Tabla de referencia rápida

Relaciona los **bits de host (h)** con los **hosts útiles**, la **máscara** y el
**paso/salto** entre subredes:

| h (bits de host) | Hosts útiles (2^h - 2) | Prefijo (32-h) | Máscara de subred | Paso/Salto |
| :--------------- | :--------------------- | :------------- | :---------------- | :--------- |
| 13               | 8190                   | /19            | 255.255.224.0     | 32         |
| 12               | 4094                   | /20            | 255.255.240.0     | 16         |
| 11               | 2046                   | /21            | 255.255.248.0     | 8          |
| 10               | 1022                   | /22            | 255.255.252.0     | 4          |
| 2                | 2                      | /30            | 255.255.255.252   | 4          |

El **paso/salto** es la distancia entre subredes consecutivas, medida en el octeto
donde la máscara no es ni 255 ni 0: `256 - valor de ese octeto`.

```
256 - 224 = 32   256 - 240 = 16   256 - 248 = 8   256 - 252 = 4
```

### Cómo se obtiene la máscara desde el prefijo

El prefijo indica cuántos bits **en 1** tiene la máscara; agrupándolos de 8 en 8 salen
los octetos en decimal:

```
/21  =  11111111.11111111.11111000.00000000  =  255.255.248.0
        (8)      (8)      (5 unos = 248)     (0)
```

- Octeto con **8 unos** → `255`; octeto con **0 unos** → `0`.
- Octeto parcial → `256 - 2^(bits de host de ese octeto)`.
- A mayor prefijo (más bits de red), **menos** hosts y **menor** el salto.

### Ejemplo: 192.168.10.0/24 → 4 subredes /26

Robo 2 bits de host (2^2 = 4 subredes), quedan 6 bits (2^6 - 2 = 62 hosts):

| Subred            | Rango de hosts        | Broadcast      |
| :---------------- | :-------------------- | :------------- |
| 192.168.10.0/26   | 192.168.10.1 – .62    | 192.168.10.63  |
| 192.168.10.64/26  | 192.168.10.65 – .126  | 192.168.10.127 |
| 192.168.10.128/26 | 192.168.10.129 – .190 | 192.168.10.191 |
| 192.168.10.192/26 | 192.168.10.193 – .254 | 192.168.10.255 |

El salto es `256 - 64 = 64` (último octeto de la máscara: 192).

## 4. Medir: VLSM

**VLSM** (Variable Length Subnet Mask) da a cada subred el **tamaño justo** según lo que
necesita, en lugar de subredes todas iguales. Se asignan primero las más grandes y se
sigue el paso/salto de la tabla.

### El requisito (¿cuántos hosts necesita cada segmento?)

| Segmento   | Hosts necesarios |
| :--------- | :--------------- |
| Lan 1      | 6000             |
| Lan 2      | 2500             |
| Lan 3      | 1100             |
| Enlace Wan | 2                |

Para cada segmento elijo el prefijo más pequeño que lo cubra (2^h - 2 ≥ hosts). Con la
tabla de referencia es directo: 6000 → **/19** (8190), 2500 → **/20** (4094),
1100 → **/21** (2046) y 2 → **/30** (2). Parto desde `192.168.0.0` y avanzo con el
salto de cada subred asignada.

### La solución (las subredes asignadas)

| Segmento   | Subred asignada                   |
| :--------- | :-------------------------------- |
| Lan 1      | 192.168.0.0/19 (255.255.224.0)    |
| Lan 2      | 192.168.32.0/20 (255.255.240.0)   |
| Lan 3      | 192.168.48.0/21 (255.255.248.0)   |
| Enlace Wan | 192.168.56.0/30 (255.255.255.252) |

Comprobación: Lan 1 (`/19`) cubre hasta `192.168.31.255` → Lan 2 salta a `.32`, cubre
hasta `.47.255` → Lan 3 salta a `.48`, cubre hasta `.55.255` → Wan toma `.56.0 – .56.3`.

En cada LAN las primeras direcciones se reservan para los dispositivos clave:
**PC `.3`**, **gateway `.6`**, **switch `.8`**.

## Repaso: otros conceptos IPv4

### Direcciones especiales

| Tipo       | Rango / dirección                         | Uso                                    |
| :--------- | :---------------------------------------- | :------------------------------------- |
| Red        | 192.168.1.**0** (primera IP)              | Identifica la subred                   |
| Broadcast  | 192.168.1.**255** (última IP)             | Envía a todos los hosts                |
| Loopback   | 127.0.0.0/8 (127.0.0.1)                   | Prueba de la propia interface          |
| Privadas   | 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 | Redes internas, no enrutan en internet |
| Link-local | 169.254.0.0/16                            | Auto-configuración (APIPA)             |

### Públicas vs privadas

Las direcciones **públicas** son únicas en internet y las asignan los ISP. Las
**privadas** se usan internamente y se traducen a públicas con **NAT** al salir.

### Clases (concepto clásico)

| Clase         | Rango                       | Máscara por defecto |
| :------------ | :-------------------------- | :------------------ |
| A             | 1.0.0.0 – 126.255.255.255   | /8                  |
| B             | 128.0.0.0 – 191.255.255.255 | /16                 |
| C             | 192.0.0.0 – 223.255.255.255 | /24                 |
| D (multicast) | 224.0.0.0 – 239.255.255.255 | —                   |
| E (reservada) | 240.0.0.0 – 255.255.255.255 | —                   |

## Preguntas tipo CCNA

1. **¿Cuántos hosts utilizables tiene Lan 1 (/19)?**
   2^13 - 2 = **8190**.

2. **¿Por qué Lan 3 usa /21 y no /22?**
   Porque /22 solo da 1022 hosts y necesita 1100 → con /21 quedan 2046.

3. **¿A qué subred pertenece 192.168.40.70/20?**
   El salto de /20 es 16 → está en la 3ª subred: **192.168.32.0/20**.

4. **¿Cuál es el broadcast de la subred de Lan 2?**
   Lan 2 es 192.168.32.0/20, cubre hasta `.47.255` → broadcast **192.168.47.255**.

5. **¿Dónde comenzaría un 4º enlace WAN de 2 hosts?**
   Tras 192.168.56.0/30, el salto /30 es 4 → **192.168.56.4/30**.

## Resumen

- IPv4 = 32 bits; una máscara con unos consecutivos reparte red y host.
- **Escala:** más hosts → prefijo más pequeño (CIDR); `2^(32-n) - 2`.
- **Divide:** roba bits → `2^n` subredes, `2^h - 2` hosts, salto `256 - octeto`.
- **Mide (VLSM):** subred del tamaño justo, asignando primero la más grande.
- Primera IP = red, última = broadcast, intermedias = hosts utilizables.
