---
title: Device Management
description: "Administración de dispositivos de red: acceso por consola, modos de CLI, configuración básica, acceso remoto seguro y gestión del sistema operativo IOS."
---

Este módulo cubre la puesta en marcha y administración de routers y switches Cisco:
cómo acceder por primera vez a un dispositivo, moverse por los modos de la CLI,
asegurar las líneas de administración y gestionar los archivos del sistema
operativo IOS.

## Temas del módulo

### Acceso Inicial y Modos de CLI

El primer contacto con un equipo de red se hace normalmente por el puerto de
consola. Aprende a conectar un cable rollover, emular un terminal y moverte por
los modos de la CLI de IOS (usuario, privilegiado y configuración).

- [Acceso Inicial y Modos de CLI](./cli-modes)

### Configuración Básica de Dispositivo

Todo equipo necesita un nombre, banners de advertencia y contraseñas que protejan
las líneas de administración. Conoce los comandos esenciales de configuración
inicial y cómo guardarlos.

- [Configuración Básica de Dispositivo (Hostname, Banners, Secret)](./basic-configuration)

### Acceso Remoto Seguro (SSH vs. Telnet)

Administrar el equipo desde el escritorio requiere un acceso remoto. Compara
Telnet y SSH, por qué SSH es la opción segura y los pasos para habilitarlo.

- [Acceso Remoto Seguro (SSH vs. Telnet)](./secure-remote-access)

### Gestión de Archivos y Sistema Operativo (IOS / Running-Config)

El IOS y las configuraciones viven en distintas memorias del dispositivo.
Aprende dónde se guardan el running-config y el startup-config, cómo respaldarlos
y cómo gestionar el archivo de imagen del sistema operativo.

- [Gestión de Archivos y Sistema Operativo (IOS / Running-Config)](./ios-file-management)

## Repaso rápido

| Concepto          | Resumen                                              |
| :---------------- | :--------------------------------------------------- |
| Consola           | Acceso inicial vía puerto console y cable rollover   |
| Modo usuario      | Prompt `>`, comandos limitados, solo consulta        |
| Modo privilegiado | Prompt `#`, acceso a `show`, `copy`, `debug`, etc.   |
| Modo configuración| Prompt `(config)#`, cambios al running-config        |
| `enable secret`   | Protege el paso a modo privilegiado (hash MD5)       |
| SSH               | Acceso remoto cifrado, puerto 22, reemplaza a Telnet |
| running-config    | Configuración activa, vive en RAM (se pierde al reiniciar) |
| startup-config    | Configuración guardada, vive en NVRAM (persistente)  |

## Ejercicio

Ponlo en práctica con el [Ejercicio: Puesta en Marcha del Edificio (Parte 1)](./ejercicio),
la primera parte de la configuración incremental del edificio.

Continúa con [el Módulo 3](../03-network-configuration/) cuando domines la
administración de dispositivos.
