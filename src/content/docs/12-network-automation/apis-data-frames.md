---
title: APIs y Formatos de Datos
description: "REST APIs, NETCONF/YANG, gNMI: interfaces programables para consultar y configurar dispositivos de red."
---

Las **APIs** (Application Programming Interfaces) permiten que software externo
consulte y configure dispositivos de red sin usar la CLI. Cada protocolo tiene
sus ventajas y casos de uso.

## REST API (REpresentational State Transfer)

API basada en **HTTP**. Es el estándar moderno para interacción con
dispositivos de red y plataformas.

### Métodos HTTP

| Método | Función | Equivalente CLI |
| :----- | :------ | :-------------- |
| **GET** | Consultar datos | `show` |
| **POST** | Crear recurso | `configure` + `write` |
| **PUT** | Actualizar recurso | Reemplazar configuración |
| **PATCH** | Modificar parcialmente | Cambiar un elemento |
| **DELETE** | Eliminar recurso | `no` + `write` |

### Ejemplo: REST API en Cisco DNA Center

```bash
# Autenticación
curl -k -X POST https://dna-center.local/api/system/v1/auth/token \
  -u admin:password

# Consultar dispositivos
curl -k -X GET https://dna-center.local/api/v1/network-device \
  -H "X-Auth-Token: <token>"

# Respuesta JSON
{
  "response": [
    {
      "hostname": "R1",
      "ipAddress": "192.168.99.1",
      "platform": "ISR 4331",
      "status": "Reachable"
    }
  ]
}
```

### REST API en IOS-XE

```ios
R1(config)# restconf                     # Habilitar RESTCONF
R1(config)# netconf-yang                 # Habilitar NETCONF
```

```bash
# Consultar hostname vía RESTCONF
curl -k -u admin:password \
  https://192.168.99.1/restconf/data/Cisco-IOS-XE-native:native/hostname

# Respuesta
{
  "Cisco-IOS-XE-native:hostname": "R1"
}
```

### Autenticación

| Método | Seguridad | Uso |
| :----- | :-------- | :-- |
| Basic Auth | Baja (texto plano) | Desarrollo/pruebas |
| Token (Bearer) | Media | APIs de plataformas |
| mTLS | Alta | Producción enterprise |
| OAuth 2.0 | Alta | APIs cloud |

## NETCONF (Network Configuration Protocol)

Protocolo **sobre SSH** diseñado específicamente para configurar dispositivos
de red. Usa modelos YANG.

### Capas NETCONF

```
┌─────────────────────────┐
│    Aplicación (Ansible) │
├─────────────────────────┤
│    NETCONF (operaciones)│  ← get, edit-config, copy-config
├─────────────────────────┤
│    SSH (transporte)      │
├─────────────────────────┤
│    TCP                   │
└─────────────────────────┘
```

### Operaciones NETCONF

| Operación | Función | Equivalente |
| :--------- | :------ | :---------- |
| `<get>` | Consultar configuración y estado | `show running-config` |
| `<get-config>` | Obtener configuración específica | `show running-config \| section` |
| `<edit-config>` | Modificar configuración | `configure` |
| `<copy-config>` | Copiar configuración completa | `copy running-config startup-config` |
| `<delete-config>` | Eliminar configuración | `erase startup-config` |
| `<lock>` | Bloquear configuración | `configure terminal` (exclusividad) |
| `<unlock>` | Liberar bloqueo | `end` |

### Ejemplo NETCONF (XML)

```xml
<!-- Solicitud: editar configuración -->
<edit-config>
  <target>
    <running/>
  </target>
  <config>
    <native xmlns="http://cisco.com/ns/yang/Cisco-IOS-XE-native">
      <hostname>R1-NUEVO</hostname>
    </native>
  </config>
</edit-config>

<!-- Respuesta: éxito -->
<rpc-reply>
  <ok/>
</rpc-reply>
```

### Habilitar NETCONF en IOS-XE

```ios
R1(config)# netconf-yang                  # Habilitar NETCONF sobre SSH
R1(config)# netconf-yang port 830         # Puerto (default: 830)
```

```bash
# Probar NETCONF desde Linux
ssh -p 830 admin@192.168.99.1 -s netconf
```

## gNMI (gRPC Network Management Interface)

Protocolo moderno basado en **gRPC** (no HTTP). Ofrece **streaming** en tiempo
real y es más eficiente que NETCONF para monitoreo.

| Característica | NETCONF | gNMI |
| :------------- | :------ | :--- |
| Transporte | SSH | gRPC (HTTP/2) |
| Formato | XML | JSON, ASCII, bytes |
| Streaming | No | **Sí** (suscripción en tiempo real) |
| Velocidad | Media | Alta |
| Uso | Configuración | Monitoreo + Configuración |

### Operaciones gNMI

| Operación | Función |
| :-------- | :------ |
| `Get` | Consultar datos (como `show`) |
| `Set` | Modificar configuración |
| `Subscribe` | Recibir actualizaciones en tiempo real |
| `Capabilities` | Consultar modelos soportados |

### Ejemplo gNMI

```bash
# Consultar estado de interfaz
gnmi_cli -address 192.168.99.1:6030 \
  -username admin -password password \
  -xpath /interfaces/interface[name=GigabitEthernet0/0]/state \
  -format json
```

## Comparación de APIs

| API | Transporte | Formato | Streaming | Escala | Uso principal |
| :-- | :--------- | :------ | :-------- | :---- | :------------ |
| REST | HTTP/HTTPS | JSON | No | Alta | APIs web, plataformas |
| NETCONF | SSH | XML | No | Alta | Configuración de dispositivos |
| gNMI | gRPC | JSON/ASCII | **Sí** | Muy alta | Monitoreo en tiempo real |
| CLI | SSH/Telnet | Texto | No | Baja | Uso manual |

## Práctica: REST API con curl

```bash
# 1. Obtener token de autenticación
TOKEN=$(curl -s -k -X POST https://dna-center/api/system/v1/auth/token \
  -u admin:password | jq -r '.token')

# 2. Listar dispositivos
curl -s -k -X GET https://dna-center/api/v1/network-device \
  -H "X-Auth-Token: $TOKEN" | jq '.response[] | {hostname, ipAddress}'

# 3. Obtener interfaces de un dispositivo
curl -s -k -X GET "https://dna-center/api/v1/network-device/<id>/interface" \
  -H "X-Auth-Token: $TOKEN" | jq '.response[] | {name, ipAddress}'
```
