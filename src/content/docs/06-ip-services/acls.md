---
title: Listas de Control de Acceso (ACLs)
description: "ACLs estándar y extendidas: filtrado de tráfico, wildcards, configuración, aplicación en interfaces y verificación."
---

Una **ACL** (Access Control List) es una lista ordenada de permisos/denegaciones
(`permit`/`deny`) que filtra paquetes por IP, protocolo o puerto. Se aplican en
las interfaces para controlar el tráfico que entra o sale.

## Tipos de ACL

| Tipo      | Filtra                            | Números                |
| :-------- | :-------------------------------- | :--------------------- |
| **Estándar** | Solo **IP de origen**           | 1-99, 1300-1999        |
| **Extendida** | IP origen/destino, protocolo, **puerto** | 100-199, 2000-2699 |

- **Estándar**: simplista, se aplica lo más **cerca del destino** (no distingue
  a dónde va el tráfico).
- **Extendida**: más precisa, se aplica lo más **cerca del origen** (para no
  gastar ancho de banda enviando tráfico que será denegado).

### Wildcard mask

Las ACL usan **wildcards** (inversa de la máscara):

| Máscara subnet | Wildcard   |
| :------------- | :--------- |
| 255.255.255.0  | 0.0.0.255  |
| 255.255.255.128| 0.0.0.127  |
| 255.255.0.0    | 0.0.255.0  |

- **0** = el bit debe **coincidir**; **1** = el bit es **irrelevante**.
- `0.0.0.0` = coincide solo con esa IP (`host`). `255.255.255.255` =
  cualquiera (`any`).

```
permit 192.168.1.0 0.0.0.255   = cualquier host de 192.168.1.0/24
permit host 192.168.1.10       = solo la IP 192.168.1.10
permit any                     = todo el tráfico
```

## Reglas fundamentales

1. Las ACL se evalúan **en orden**: la primera coincidencia decide (no se siguen
   evaluando).
2. Hay un **deny all implícito** al final: si no coincide ninguna entrada, se
   deniega.
3. Por eso, si el objetivo es permitir solo ciertos flujos, hay que incluir
   **al menos un `permit`** (el resto queda denegado).
4. En una interfaz solo puede haber **una ACL por protocolo por dirección**.

## ACL estándar

Filtra por **IP de origen**. Configuración:

```ios
R1(config)# access-list 10 deny any

R1(config)# interface GigabitEthernet0/1
R1(config-if)# ip access-group 10 in
```
- `access-list <n> permit|deny <IP> <wildcard>` define la regla.
- `ip access-group <n> in|out` aplica la ACL a la interfaz (sentido).

## ACL extendida

Filtra por origen, destino, protocolo y puerto:

```ios
R1(config)# access-list 100 deny ip any any

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip access-group 100 out
```

| Partes del comando                    | Significado                         |
| :------------------------------------ | :---------------------------------- |
| `access-list 100 permit tcp`          | Permite TCP                         |
| `192.168.1.0 0.0.0.255`               | IPs de origen                       |
| `host 10.0.0.10`                      | Destino (una IP concreta)           |
| `eq 80`                               | Puerto destino 80 (HTTP)            |
| `deny ip any any`                     | Deniega todo lo demás               |

Otros operadores de puerto: `eq` (igual), `neq` (distinto), `gt` (mayor),
`lt` (menor), `range 1000 2000`.

## ACL con nombre (named ACL)

Más legible que las numéricas:

```ios
R1(config-ext-nacl)# deny tcp any any eq 80
R1(config-ext-nacl)# deny tcp any any eq 443
R1(config-ext-nacl)# permit ip any any

R1(config)# interface GigabitEthernet0/0
R1(config-if)# ip access-group BLOQUEAR-WEB in
```
> Con las **named ACL** se pueden **editar** reglas sin borrar toda la lista;
> en las numéricas, para cambiar hay que borrar y reescribir.

## ACL para SSH (restringir administración)

Solo permite administración remota desde una subred de operaciones:

```ios
R1(config)# line vty 0 4
R1(config-line)# access-class 15 in
```

> Para líneas **VTY** la ACL se aplica con **`access-class`**, no con
> `ip access-group`.

## Verificación

```ios
Extended IP access list BLOQUEAR-WEB
    10 deny tcp any any eq www (34 matches)
    20 deny tcp any any eq 443 (12 matches)
    30 permit ip any any (1203 matches)

R1# show ip interface GigabitEthernet0/0
  Outgoing access list is 100
  Inbound access list is not set
```

- Los **matches** muestran cuántos paquetes coincidieron con cada regla; útil
  para depurar.

## Preguntas tipo CCNA

1. **¿Qué diferencia hay entre una ACL estándar y una extendida?**
   La estándar filtra solo por **IP de origen**; la extendida por **origen,
   destino, protocolo y puerto**.

2. **¿Dónde se coloca una ACL estándar y una extendida?**
   La estándar **cerca del destino**; la extendida **cerca del origen**.

3. **¿Qué hace el deny all implícito?**
   Deniega todo paquete que no coincida con ninguna regla; por eso casi siempre
   se necesita al menos un `permit`.

4. **¿Qué comando aplica una ACL a una interfaz?**
   `ip access-group <lista> in|out` en el modo interfaz.

5. **¿Cómo se restringe el acceso VTY (SSH/Telnet) con una ACL?**
   Con **`access-class`** dentro de `line vty` referenciando la ACL.

## Resumen

- **ACL estándar** (1-99): solo IP origen. **Extendida** (100-199): origen,
  destino, protocolo y puerto.
- Orden de evaluación **secuencial** y **deny all implícito** final.
- Se aplican con **`ip access-group`** (interfaces) y **`access-class`** (VTY).
- **Wildcards** (`0.0.0.255`) definen rangos; `host` y `any` son atajos.
- Verifica con `show ip access-lists` y los contadores de matches.