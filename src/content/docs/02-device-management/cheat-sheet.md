---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Device Management: modos CLI, configuración básica, SSH y gestión de archivos IOS."
---

## Modos de CLI (prompts)

| Modo | Prompt | Entrar | Salir |
| :--- | :--- | :--- | :--- |
| Usuario | `Router>` | Inicial | `exit` |
| Privilegiado | `Router#` | `enable` | `disable` |
| Config global | `Router(config)#` | `configure terminal` | `end` / `Ctrl+Z` |
| Línea | `Router(config-line)#` | `line console 0` | `exit` |
| Interfaz | `Router(config-if)#` | `interface Gi0/0` | `exit` |

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
enable
configure terminal
hostname R1-Oficina
enable secret MiClaveSegura
service password-encryption
banner motd #Solo personal autorizado.#
username admin privilege 15 secret ClaveFuerte!
line console 0
 password cisco123
 login
 exit
line vty 0 4
 password cisco123
 login local
 transport input ssh
 exit
end
copy running-config startup-config
```

## Contraseñas

| Comando | Almacenamiento |
| :--- | :--- |
| `enable password` | Texto plano (débil) |
| `enable secret` | Hash MD5 (usar siempre, prioridad) |
| `service password-encryption` | Cifra líneas/usuarios (tipo 7, reversible) |

## Banners

| Comando | Cuándo se muestra |
| :--- | :--- |
| `banner motd #texto#` | Antes del login |
| `banner login #texto#` | Justo antes del prompt de autenticación |
| `banner exec #texto#` | Tras autenticarse, antes de la CLI |

## Líneas de administración

| Línea | Uso |
| :--- | :--- |
| `line console 0` | Consola física |
| `line aux 0` | Puerto auxiliar (módem) |
| `line vty 0 4` (o 0 15) | Acceso remoto (Telnet/SSH) |

Niveles de privilegio IOS: 0 (restringido), 1 (usuario, default), 2-14 (personalizados), 15 (privilegiado).

## SSH vs Telnet

| | Telnet | SSH |
| :--- | :--- | :--- |
| Puerto | 23 | 22 |
| Cifrado | No | Sí |
| Uso | Legacy/lab | Producción |

## Configuración SSH (template)

```ios
configure terminal
hostname R1-Oficina
ip domain-name empresa.local
crypto key generate rsa modulus 2048
ip ssh version 2
username admin secret ClaveFuerte!
line vty 0 4
 transport input ssh
 login local
 exit
end
```

```ios
show ip ssh            # verificación
show ip ssh connections
show ssh
ssh -l admin 192.168.1.2   # conectarse desde IOS
```

Requisitos previos SSH: hostname no default + `ip domain-name` + clave RSA (modulus ≥ 1024, 2048 recomendado).

## Verificación

| Comando | Muestra |
| :--- | :--- |
| `show running-config` | Config activa (RAM) |
| `show startup-config` | Config guardada (NVRAM) |
| `show version` | IOS, modelo, uptime, memoria |
| `show interfaces` | Estado de interfaces |
| `show ip interface brief` | Resumen IP de interfaces |
| `show clock` | Fecha y hora |
| `show flash` | Contenido y espacio de Flash |
| `show boot` | Imagen de arranque |

## Memorias

| Memoria | Contenido | Volatilidad |
| :--- | :--- | :--- |
| RAM | IOS en ejecución, running-config | Volátil |
| NVRAM | startup-config | Persistente |
| Flash | Imagen del IOS, backups | Persistente |
| ROM | Bootstrap, mini-IOS | Solo lectura |

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