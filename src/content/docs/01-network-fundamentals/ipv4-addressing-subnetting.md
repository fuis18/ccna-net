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
  trama por el conmutador. Ejemplo: una PC en `192.168.10.5` y una impresora de red
  en `192.168.10.7` pueden hablar directo porque ambas están en 192.168.10.0/24.
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

```
Máscara:    255   .   255   .   255   .    0
Significa: [FIJO] .  [FIJO] .  [FIJO] . [LIBRE]
```

Las 255 posibilidades están fijas como red o como host

Por ejemplo, en `192.168.10.0/24`:

- red `192.168.10.0`
- broadcast `192.168.10.255`,
- hosts utilizables `192.168.10.1 – .254`.

## 2. Escalando: cambiar la máscara (CIDR)

> Classless Inter-Domain Routing o Enrutamiento Interdominio Sin Clases

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

Si a la red 192.168.10.0/24 se conectaran decenas de equipos más para usar la impresora,
seguiría cabiendo sin cambiar de máscara: el problema, en ese caso, no sería de tamaño
sino de organización — todos esos equipos verían el mismo tráfico y los mismos recursos
compartidos, sin ningún aislamiento entre áreas. Eso es lo que resuelve el subnetting.

## 3.1. Dividir: subnetting

"¿Y si necesito **varias** redes (sedes, oficinas)?" Tomo una red grande y la parto en
subredes más pequeñas. Para eso **robo bits** de la porción de host y los convierto en
bits de red.

### Caso 1: separar áreas del mismo tamaño

**Situación:** la PC y la impresora conviven en `192.168.10.0/24` con el resto de la
oficina. Hay 4 áreas, cada una con hasta 60 equipos, y hace falta que no vean los
recursos de las demás.

**Razonamiento:** no se necesita más espacio (254 direcciones sobran, porque en total son 240),
se necesita **partir** el que ya existe en 4 pedazos iguales, uno por área. Cada pedazo debe
alcanzar para 60 equipos.

**Procedimiento:**

- Hosts necesarios: 60, más 2 reservados (red y broadcast) → 62.
- Bloque más próximo: la primera potencia de 2 que alcanza para 62 es **64** (2⁶).
- Ese bloque de 64 direcciones equivale a **6 bits de host** (2⁶ = 64).
- Prefijo → `32 - 6 = /26`.
- Máscara: el bit límite cae en el último octeto → `256 - 64 = 192` → `255.255.255.192`.
- Salto: la distancia entre el inicio de una subred y el de la siguiente es el mismo tamaño del bloque → `256 - 192 = 64`. Por eso las subredes arrancan en `.0`, `.64`, `.128`, `.192` — siempre saltando de 64 en 64 en el último octeto.

**Resultado:**

| Área           | Subred            | Rango de hosts        | Broadcast      |
| :------------- | :---------------- | :-------------------- | :------------- |
| PC + impresora | 192.168.10.0/26   | 192.168.10.1 – .62    | 192.168.10.63  |
| Área 2         | 192.168.10.64/26  | 192.168.10.65 – .126  | 192.168.10.127 |
| Área 3         | 192.168.10.128/26 | 192.168.10.129 – .190 | 192.168.10.191 |
| Área 4         | 192.168.10.192/26 | 192.168.10.193 – .254 | 192.168.10.255 |

Cada área queda en su propia subred, separada de las demás por el router: pueden
llegar a la impresora compartida, pero no ver el resto del tráfico o los recursos
de otra área. Nota: el salto entre subredes es siempre el mismo valor del bloque —
`64` — porque todas nacen del mismo prefijo `/26`.

### Caso 2: una subred solo para un enlace punto a punto

**Situación:** dos routers de la oficina se conectan entre sí por un enlace dedicado (wan). Ese enlace no tiene "usuarios", solo las dos interfaces de los routers en cada punta.

**Razonamiento:** hacen falta exactamente 2 direcciones utilizables. Una subred `/26` (62 hosts, 60 desperdiciadas) no tiene sentido para esto.

**Procedimiento:**

- Hosts necesarios: 2, más 2 reservados (red y broadcast) → 4.
- Bloque más próximo: la primera potencia de 2 que alcanza para 4 es **4** (2²).
- Ese bloque de 4 direcciones equivale a **2 bits de host** (2² = 4).
- Prefijo → `32 - 2 = /30`.
- Máscara: `256 - 4 = 252` → `255.255.255.252`.
- Salto: `256 - 252 = 4`. Cada enlace WAN nuevo empieza 4 direcciones después del anterior — `.0`, `.4`, `.8`, `.12`...

**Resultado:** `192.168.56.0/30`, con `192.168.56.1` y `.2` para cada router y `192.168.56.3` como broadcast. Este mismo patrón se repite cada vez que aparece un enlace WAN nuevo entre dos equipos: siempre `/30`.

### Caso 3: una sede completa, no solo un área de oficina

**Situación:** una sucursal nueva va a tener hasta 2000 dispositivos (PCs, teléfonos IP, impresoras, cámaras). Una subred `/26` (62 hosts) se queda muy corta.

**Razonamiento:** ahora el problema es al revés que en el Caso 1 — no sobra espacio, falta. Hay que cubrir 2000 hosts con un solo bloque.

**Procedimiento:**

- Hosts necesarios: 2000, más 2 reservados → 2002.
- Bloque más próximo: la primera potencia de 2 que alcanza para 2002 es **2048** (2¹¹).
- Ese bloque de 2048 direcciones equivale a **11 bits de host** (2¹¹ = 2048).
- Prefijo → `32 - 11 = /21`.
- Máscara: el bloque cae en el tercer octeto → `256 - 8 = 248` → `255.255.248.0`.
- Salto: se mide en el mismo octeto donde la máscara no es 255 ni 0 (el tercero) → `256 - 248 = 8`. Cada sucursal nueva de este tamaño arrancaría en `10.0.0.0`, `10.0.8.0`, `10.0.16.0`... el cuarto octeto se completa entero (0-255) antes de saltar al siguiente.

**Resultado:** `10.0.0.0/21`, con máscara `255.255.248.0` y 2046 direcciones utilizables (2048 - 2) para toda la sucursal, con margen para crecer un poco.

Estos tres casos son la base del subnetting: partir algo grande en pedazos iguales (Caso 1), reservar el mínimo indispensable (Caso 2), o cubrir una necesidad grande con una sola subred (Caso 3). El procedimiento es siempre el mismo: hosts necesarios → el bloque (potencia de 2) que los cubre → bits de host que representa ese bloque → `32 - esos bits` es el prefijo.

## 4. Medir: VLSM

**VLSM** (Variable Length Subnet Mask) da a cada subred el **tamaño justo** según lo que necesita, en lugar de subredes todas iguales. Se asignan primero las más grandes y se avanza con el salto de cada una.

Este caso aparece cuando las áreas no tienen el mismo tamaño: subnetting parejo (como el Caso 1 de la sección anterior, con subredes `/26` iguales) desperdicia direcciones en las áreas chicas y no alcanza en las grandes.

**Situación:** la empresa tiene tres sedes de tamaños distintos y un enlace WAN entre routers, todos dentro del mismo bloque `192.168.0.0`.

### El requisito (¿cuántos hosts necesita cada segmento?)

| Segmento   | Hosts necesarios |
| :--------- | :--------------- |
| Lan 1      | 6000             |
| Lan 2      | 2500             |
| Lan 3      | 1100             |
| Enlace Wan | 2                |

Para cada segmento se aplica el mismo procedimiento del Caso 3: hosts necesarios → el bloque (potencia de 2) que los cubre → bits de host de ese bloque → prefijo.

- Lan 1: 6000 + 2 = 6002 → bloque 8192 (2¹³) → 13 bits de host → **/19**.
- Lan 2: 2500 + 2 = 2502 → bloque 4096 (2¹²) → 12 bits de host → **/20**.
- Lan 3: 1100 + 2 = 1102 → bloque 2048 (2¹¹) → 11 bits de host → **/21**.
- Enlace Wan: igual que el Caso 2 → **/30**.

Se parte desde `192.168.0.0` y se avanza con el salto de cada subred asignada.

### La solución (las subredes asignadas)

| Segmento   | Subred asignada                   |
| :--------- | :-------------------------------- |
| Lan 1      | 192.168.0.0/19 (255.255.224.0)    |
| Lan 2      | 192.168.32.0/20 (255.255.240.0)   |
| Lan 3      | 192.168.48.0/21 (255.255.248.0)   |
| Enlace Wan | 192.168.56.0/30 (255.255.255.252) |

Para cada segmento elijo el prefijo más pequeño que lo cubra (2^h - 2 ≥ hosts). Con la
tabla de referencia es directo:

- 6000 → **/19** (8190),
- 2500 → **/20** (4094),
- 1100 → **/21** (2046)
- 2 → **/30** (2).

Parto desde `192.168.0.0` y avanzo con el salto de cada subred asignada.

Comprobación:

- Lan 1 (`/19`) cubre hasta `192.168.31.255`
- Lan 2 salta a `.32`, cubre hasta `.47.255`
- Lan 3 salta a `.48`, cubre hasta `.55.255`
- Wan toma `.56.0 – .56.3`.

En cada LAN las primeras direcciones se reservan para los dispositivos clave: **PC `.3`**, **gateway `.6`**, **switch `.8`**.

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
