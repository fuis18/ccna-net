---
title: Acceso Remoto Seguro (SSH vs. Telnet)
description: "Administración remota de dispositivos: comparativa Telnet vs SSH, requisitos y configuración completa de SSH en IOS."
---

Una vez que el dispositivo tiene dirección IP en una interfaz (o en una VLAN de
administración), se puede administrar por red con Telnet o SSH. La elección
correcta siempre es **SSH**, porque cifra la comunicación.

## Telnet vs. SSH

| Característica | Telnet                        | SSH                                  |
| :------------- | :---------------------------- | :----------------------------------- |
| Puerto         | 23                            | 22                                   |
| Cifrado        | Ninguno (texto plano)         | Sí (clave simétrica negociada)       |
| Autenticación  | Usuario/contraseña sin cifrar | Cifrada (y opcionalmente con claves) |
| Integridad     | No                            | Sí (MAC / HMAC)                      |
| Riesgo         | Credenciales e inspección     | Bajo                                 |
| Uso actual     | Evitar; legacy, laboratorio   | Estándar de administración remota    |

> Con **Telnet** cualquiera que capture el tráfico de red ve las contraseñas en
> claro. Por eso Cisco desaconseja su uso en equipos de producción.

## Requisitos para SSH en IOS

Antes de generar las claves de cifrado se necesitan tres cosas:

1. **Hostname** definido (no puede ser el default `Router`/`Switch`).
2. **`ip domain-name`**: dominio (ej. `empresa.local`) que completa el nombre
   de host para generar las claves.
3. **Clave RSA** generada con `crypto key generate rsa`.

Además hay que tener credenciales de acceso (usuario local o AAA) y habilitar
SSH en las líneas VTY.

## Configuración completa de SSH

```ios
Router> enable
Router# configure terminal
Router(config)# hostname R1-Oficina
R1-Oficina(config)# ip domain-name empresa.local
R1-Oficina(config)# crypto key generate rsa general-keys modulus 2048
The name for the keys will be: R1-Oficina.empresa.local
...
%SSH-5-ENABLED: SSH 2.0 has been enabled
R1-Oficina(config)# ip ssh version 2
R1-Oficina(config)# username admin secret ClaveFuerte!
R1-Oficina(config)# line vty 0 4
R1-Oficina(config-line)# transport input ssh
R1-Oficina(config-line)# login local
R1-Oficina(config-line)# exit
R1-Oficina(config)# end
```

Explicación paso a paso:

| Comando                        | Función                                          |
| :----------------------------- | :----------------------------------------------- |
| `ip domain-name empresa.local` | Dominio para el nombre completo del equipo       |
| `crypto key generate rsa`      | Genera las claves RSA; habilita SSH en el equipo |
| `ip ssh version 2`             | Fuerza SSHv2 (más seguro que v1)                 |
| `username admin secret ...`    | Crea un usuario local con contraseña             |
| `line vty 0 4`                 | Entra a las líneas de acceso remoto              |
| `transport input ssh`          | Solo acepta SSH (rechaza Telnet) en las VTY      |
| `login local`                  | Autentica contra los usuarios locales            |

> El parámetro `modulus` de la clave RSA debe ser de al menos 1024 bits
> (2048 recomendado). Si el equipo ya tiene claves, IOS pregunta si deseas
> reemplazarlas.

### ¿Por qué hace falta un dominio para generar la clave?

SSH no genera una clave RSA "genérica" del equipo: la asocia a un **nombre
completo** (FQDN — _Fully Qualified Domain Name_), que se arma uniendo el
`hostname` con el `ip domain-name`. En el ejemplo, `R1-Oficina` +
`empresa.local` da `R1-Oficina.empresa.local`, que es justamente el nombre que
IOS muestra al generar la clave (`The name for the keys will be:
R1-Oficina.empresa.local`). Por eso el dominio no es opcional ni cosmético:
sin él, IOS no tiene con qué nombre asociar la clave y `crypto key generate
rsa` no la genera.

Ese mismo FQDN es reutilizable después: si hay un servidor DNS que resuelve
`R1-Oficina.empresa.local` a la IP del equipo, te podés conectar por ese
nombre en vez de memorizar la IP.

## Verificar SSH

```ios
R1-Oficina# show ip ssh
SSH Enabled - version 2.0
Authentication timeout: 120 secs; Authentication retries: 3

R1-Oficina# show ip ssh connections
R1-Oficina# show ssh
```

## Conectarse a un dispositivo con SSH

Desde un equipo IOS (o cualquier cliente SSH), se usa el comando `ssh`:

```ios
R1-Oficina# ssh -l admin 192.168.1.2
Password:
R2-Sucursal>
```

Para conectarse desde un PC se usa un cliente SSH (PuTTY, Terminal, OpenSSH)
hacia la dirección IP de administración del equipo, o hacia su FQDN si hay DNS
que lo resuelva — la razón por la que el dominio importa, retomando la sección
anterior:

```ios
ssh admin@192.168.1.2               # por IP, siempre funciona
ssh admin@R1-Oficina.empresa.local  # por FQDN — requiere que DNS resuelva ese nombre
ssh -l admin R1-Oficina             # por hostname corto — el cliente debe asumir el dominio local
```

La sintaxis `-l usuario destino` y `usuario@destino` son equivalentes; cuál
usar depende del cliente SSH que tengas a mano.

## Configuración mínima con Telnet (solo laboratorio)

Telnet solo necesita contraseña en las líneas VTY. Se muestra por contraste,
pero **no se recomienda** en redes reales:

```ios
R1-Oficina(config)# line vty 0 4
R1-Oficina(config-line)# password cisco123
R1-Oficina(config-line)# login
R1-Oficina(config-line)# transport input telnet
```

## Preguntas tipo CCNA

1. **¿Por qué SSH reemplaza a Telnet?**
   Porque Telnet envía datos y credenciales en texto plano y SSH cifra toda la
   comunicación (puerto 22).

2. **¿Qué tres requisitos se necesitan antes de `crypto key generate rsa`?**
   Un **hostname** no default, un **`ip domain-name`** y accesos (líneas VTY)
   que permitan usar SSH.

3. **¿Qué comando limita las VTY a conexiones SSH únicamente?**
   `transport input ssh` en `line vty`.

4. **¿Para qué sirve `login local` en las líneas VTY?**
   Para que la autenticación use los **usuarios locales** definidos con
   `username ... secret ...` en lugar de una contraseña compartida.

5. **¿Por qué es obligatorio configurar `ip domain-name` antes de generar la clave RSA?**
   Porque la clave se asocia al nombre completo del equipo (FQDN =
   hostname + domain-name); sin dominio, IOS no puede armar ese nombre y no
   genera la clave.

## Resumen

- **SSH (puerto 22)** cifra la administración remota; **Telnet (puerto 23)** no.
- Para SSH se necesitan: hostname, `ip domain-name`, clave RSA y credenciales.
- El `ip domain-name` no es solo para las claves: junto al hostname forma el
  FQDN por el que también se puede conectar, si hay DNS.
- `transport input ssh` en las líneas VTY bloquea Telnet y solo permite SSH.
- `login local` autentica contra usuarios locales del equipo.
- Siempre usa `enable secret`, `service password-encryption` y SSH en producción.
