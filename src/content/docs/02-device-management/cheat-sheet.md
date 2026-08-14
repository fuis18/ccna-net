---
title: Referencia Técnica
description: "Referencia técnica de Device Management: modos CLI, configuración básica, SSH y gestión de archivos IOS."
---

## Modos de CLI (prompts)

| Modo          | Prompt                 | Entrar               | Salir            |
| :------------ | :--------------------- | :------------------- | :--------------- |
| Usuario       | `Router>`              | Inicial              | `exit`           |
| Privilegiado  | `Router#`              | `enable`             | `disable`        |
| Config global | `Router(config)#`      | `configure terminal` | `end` / `Ctrl+Z` |
| Línea         | `Router(config-line)#` | `line console 0`     | `exit`           |
| Interfaz      | `Router(config-if)#`   | `interface Gi0/0`    | `exit`           |

## Atajos de CLI

```ios
?          # ayuda contextual
Tab        # autocompletar
en / conf t / sh run   # abreviaturas
Ctrl+Z o end           # al modo privilegiado
Ctrl+Shift+6           # interrumpe comando en ejecución
show history           # historial de la sesión
```

## Configuración básica inicial (template)

```ios
# Basic Config
enable
configure terminal
hostname R-Oficina

enable secret MiClaveSegura
service password-encryption
banner motd #Solo personal autorizado.#

line console 0
 password cisco123
 login
 exit
line vty 0 4
 password cisco123
 login
 exit
end

copy running-config startup-config
```

## Configuración SSH (template)

```ios
#  SSH Config
configure terminal

ip domain-name empresa.local
crypto key generate rsa general-keys modulus 2048
ip ssh version 2

username admin secret privilege 15 ClaveFuerte!
line vty 0 4
 transport input ssh
 login local
 exit
end

copy running-config startup-config
```

### Verificación

```ios
show ip ssh
show ip ssh connections
show ssh

# conectarse desde PC
ssh -l admin 192.168.1.2
telnet 192.168.0.1
```

## Verificación

| Comando                   | Muestra                      |
| :------------------------ | :--------------------------- |
| `show running-config`     | Config activa (RAM)          |
| `show startup-config`     | Config guardada (NVRAM)      |
| `show version`            | IOS, modelo, uptime, memoria |
| `show interfaces`         | Estado de interfaces         |
| `show ip interface brief` | Resumen IP de interfaces     |
| `show clock`              | Fecha y hora                 |
| `show flash`              | Contenido y espacio de Flash |
| `show boot`               | Imagen de arranque           |

## Gestión de configuración

```ios
copy running-config startup-config   # guardar (save) / wr / write memory
copy startup-config running-config   # fusiona la guardada en RAM (NO es undo)
erase startup-config                 # borrar config guardada
reload                               # reiniciar (aplica estado limpio)
```

## Respaldos (TFTP)

```ios
copy running-config tftp://192.168.1.10   # respaldar config
copy tftp://192.168.1.10 startup-config   # restaurar config
copy flash tftp://192.168.1.10            # respaldar IOS
copy tftp flash                           # actualizar/instalar IOS

boot system flash:c2900-universalk9-mz.SPA.152-4.M1.bin   # imagen de arranque
```

> Antes de actualizar IOS: comprobar espacio en `show flash`, guardar config, aplicar con `reload`.
