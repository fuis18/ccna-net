---
title: Configuración Básica de Dispositivo
description: "Configuración inicial de routers y switches: hostname, banners de advertencia, contraseñas de líneas y enable secret."
---

Antes de poner un equipo en producción hay que darle identidad y asegurar las
líneas de administración. Esta configuración básica protege el acceso por
consola y deja constancia de quién debe usar el dispositivo.

## Hostname

El `hostname` identifica al dispositivo en la red y aparece en el prompt.
Usa una convención de nombres clara (ej. `SW-Core-01`, `R1-Oficina`).

```ios
Router# configure terminal
Router(config)# hostname R1-Oficina
R1-Oficina(config)#
```

> El hostname no admite espacios; usa guiones. Se refleja de inmediato en el prompt.

## Banners de advertencia

Los **banners** son mensajes que se muestran al conectar o iniciar sesión.
Cisco recomienda una **advertencia de uso autorizado** (aviso legal de que el
acceso está restringido). Un banner de bienvenida ("Welcome") es una mala
práctica de seguridad, ya que invita a intrusos.

| Comando        | Cuándo se muestra                                     |
| :------------- | :---------------------------------------------------- |
| `banner motd`  | Antes del login, mensaje del día (Message of the Day) |
| `banner login` | Justo antes del prompt de autenticación               |
| `banner exec`  | Después de autenticarse, antes de la CLI              |

```ios
R1-Oficina(config)# banner motd #ACCESO AUTORIZADO SOLO PARA PERSONAL AUTORIZADO.#
```

El delimitador (en el ejemplo `#`) marca el inicio y fin del mensaje; puede ser
cualquier carácter que no aparezca en el texto. Ejemplos:

```ios
R1-Oficina(config)# banner exec #Configuracion en curso. No apagar el equipo.#
```

## Seguridad de las líneas de administración

Las **líneas** (lines) son los canales por donde entran las sesiones de
administración:

- **`line console 0`**: acceso físico por consola.
- **`line aux 0`**: puerto auxiliar (acceso por módem, poco usado hoy).
- **`line vty 0 4`**: accesos remotos por red (Telnet/SSH).
- **`line vty 0 15`**: switches modernos lo tienen.

> Estas cifras representan el número de conexiones remotas simultáneas
> (mediante Telnet o SSH) que el equipo Cisco permite administrar al mismo tiempo.

Cada línea se protege con contraseña en el submodo de línea:

```ios
R1-Oficina(config-line)# password cisco123
R1-Oficina(config-line)# login
R1-Oficina(config-line)# exit

R1-Oficina(config)# line vty 0 4
R1-Oficina(config-line)# password cisco123
R1-Oficina(config-line)# login
R1-Oficina(config-line)# exit
```

- **`password`** establece la contraseña de la línea.
- **`login`** activa la verificación de contraseña en esa línea.

> En dispositivos modernos y mejores prácticas se usa un **usuario local
> (`username` + `login local`)** o autenticación **AAA**, en lugar de una única
> contraseña compartida en la línea.

```ios
R1-Oficina(config)# username user secret ClaveSegura!
R1-Oficina(config)# line vty 0 4
R1-Oficina(config-line)# login local
R1-Oficina(config-line)# transport input ssh
```

### Niveles de privilegio en Cisco IOS

Cisco IOS maneja una escala de privilegios que va del 0 al 15:

- Nivel 0: Acceso extremadamente restringido (solo comandos como help, enable, disable, exit).
- Nivel 1 (default): Modo EXEC de usuario estándar (Router>).
- Niveles 2 al 14: Niveles personalizados que el administrador puede definir para
  roles específicos (por ejemplo, crear un nivel 5 solo para personal de Soporte Nivel 1
  que solo deba ejecutar ciertos comandos de monitoreo).
- Nivel 15: Modo EXEC privilegiado con control total (Router#).

## Contraseña del modo privilegiado

El comando `enable` protege el paso al modo privilegiado. Hay dos variantes:

| Comando           | Almacenamiento        | Seguridad   |
| :---------------- | :-------------------- | :---------- |
| `enable password` | Texto plano (visible) | Débil       |
| `enable secret`   | Hash MD5              | Recomendado |

Usa siempre **`enable secret`**; si ambos existen, `enable secret` tiene
prioridad.

```ios
R1-Oficina(config)# enable secret MiClaveSegura
```

### Proteger contraseñas en la configuración

El comando `service password-encryption` cifra de forma reversible (Vigenère /
tipo 7) las contraseñas de líneas que aparecerían en texto plano en el
`show running-config`. Protege contra miradas casuales, pero no es
criptográficamente fuerte.

```ios
R1-Oficina(config)# service password-encryption
```

> El `enable secret` ya se guarda como hash (MD5) y no necesita esta opción.

## Reloj y hora

Configurar fecha y hora correctas es importante para logs y certificados
(por ejemplo para SSH):

```ios
R1-Oficina# clock set 14:30:00 14 aug 2026
```

## Guardar la configuración

Los cambios van al **running-config** (RAM) y se pierden al reiniciar. Para
persistirlos hay que guardarlos:

```ios
R1-Oficina# copy running-config startup-config
Destination filename [startup-config]?
Building configuration...
[OK]
```

## Configuración inicial completa

```ios
Router# configure terminal
Router(config)# hostname R1-Oficina
R1-Oficina(config)# enable secret MiClaveSegura
R1-Oficina(config)# service password-encryption
R1-Oficina(config)# banner motd #Solo personal autorizado.#
R1-Oficina(config)# username admin privilege 15 secret ClaveFuerte!
R1-Oficina(config)# line console 0
R1-Oficina(config-line)# password cisco123
R1-Oficina(config-line)# login
R1-Oficina(config-line)# exit
R1-Oficina(config)# line vty 0 4
R1-Oficina(config-line)# password cisco123
R1-Oficina(config-line)# login local
R1-Oficina(config-line)# exit
R1-Oficina(config)# end
R1-Oficina# copy running-config startup-config
```

## Preguntas tipo CCNA

1. **¿Por qué es mala práctica un banner de "bienvenida"?**
   Porque parece una invitación; Cisco recomienda una **advertencia de uso
   autorizado** en `banner motd`.

2. **¿Qué diferencia hay entre `enable password` y `enable secret`?**
   `enable password` se guarda en texto plano; `enable secret` se guarda como
   hash MD5 y tiene prioridad si ambos existen.

3. **¿Qué hace `service password-encryption`?**
   Cifra las contraseñas de líneas y de usuario en la configuración (tipo 7,
   reversible), para que no aparezcan en texto plano.

4. **¿Cuál es el propósito de `login` en `line console 0`?**
   Activa la autenticación por contraseña en esa línea de administración.

5. **¿Qué comando persiste la configuración entre reinicios?**
   `copy running-config startup-config`.

## Resumen

- `hostname` da identidad al equipo y se refleja en el prompt.
- `banner motd` muestra la advertencia de acceso autorizado antes del login.
- Cada línea de administración (console y vty) se asegura con `password` +
  `login`, o mejor con usuario local (`login local`).
- `enable secret` protege el modo privilegiado con hash.
- `copy running-config startup-config` guarda los cambios en NVRAM.
