---
title: Cheat Sheet (Referencia Técnica)
description: "Referencia técnica de Network Automation: APIs, formatos de datos, herramientas de configuración, IBN y Cisco DNA Center."
---

## Push vs Pull

| Método | Quién inicia | Protocolo | Herramienta |
| :----- | :----------- | :-------- | :---------- |
| Push | Servidor envía | SSH, NETCONF, REST | Ansible, Puppet |
| Pull | Dispositivo pide | TFTP, HTTP | ZTP, config backup |

## Formatos de datos

| Formato | Legibilidad | Comentario | Uso principal |
| :------ | :---------- | :--------- | :------------ |
| JSON | Media | No | APIs REST |
| YAML | Alta | Sí (`#`) | Ansible, config |
| XML | Baja | Sí (`<!-- -->`) | NETCONF |

## APIs de red

| API | Transporte | Formato | Streaming | Uso |
| :-- | :--------- | :------ | :-------- | :-- |
| REST | HTTP/S | JSON | No | APIs de plataformas |
| NETCONF | SSH | XML | No | Configuración de dispositivos |
| gNMI | gRPC | JSON | **Sí** | Monitoreo tiempo real |
| CLI | SSH | Texto | No | Uso manual |

### Métodos HTTP REST

| Método | Función | CLI |
| :----- | :------ | :-- |
| GET | Consultar | `show` |
| POST | Crear | `configure` |
| PUT | Actualizar | Reemplazar config |
| DELETE | Eliminar | `no` |

## NETCONF operaciones

| Operación | Función |
| :-------- | :------ |
| `<get>` | Consultar datos |
| `<get-config>` | Obtener configuración |
| `<edit-config>` | Modificar configuración |
| `<copy-config>` | Copiar config a startup |
| `<lock>` | Bloquear config |
| `<unlock>` | Liberar bloqueo |

## Ansible

| Comando | Función |
| :------ | :------ |
| `ansible-playbook -i inv.yml playbook.yml` | Ejecutar playbook |
| `--check` | Dry run |
| `--diff` | Mostrar cambios |
| `--limit host` | Limitar a un host |
| `--tags tag` | Ejecutar solo tareas con tag |

### Módulos de red Ansible

| Módulo | Función |
| :----- | :------ |
| `ios_config` | Configuración IOS |
| `ios_vlans` | VLANs |
| `ios_interfaces` | Interfaces |
| `ios_l3_interfaces` | IPs en interfaces |
| `ios_static_routes` | Rutas estáticas |
| `ios_acls` | ACLs |
| `ios_ping` | Ping desde dispositivo |

## Terraform

| Comando | Función |
| :------ | :------ |
| `terraform init` | Inicializar provider |
| `terraform plan` | Ver cambios (dry run) |
| `terraform apply` | Aplicar cambios |
| `terraform destroy` | Destruir recursos |

## Herramientas: comparación

| Herramienta | Agente | Transporte | Complejidad |
| :---------- | :----- | :--------- | :---------- |
| Ansible | No | SSH | Baja |
| Terraform | No | API | Media |
| Puppet | Sí | HTTPS | Media |
| Chef | Sí | HTTPS | Alta |

## Intent-Based Networking (IBN)

### Ciclo IBN

1. **Translate**: intención → políticas
2. **Deploy**: políticas → configuración en dispositivos
3. **Assure**: verificar que se cumple la intención
4. **Feedback**: corregir desviaciones

### Cisco DNA Center pilares

| Pilar | Función |
| :---- | :------ |
| Assurance | Salud de la red (health scores, issues) |
| Enforce | Seguridad por identidad (SGT, SGACL) |
| Application Policy | QoS y seguridad por aplicación |

### DNA Center APIs

```bash
# Token
curl -X POST https://dnac/api/system/v1/auth/token -u user:pass

# Dispositivos
curl -X GET https://dnac/api/v1/network-device -H "X-Auth-Token: $TOKEN"

# Health
curl -X GET https://dnac/api/v1/device-health -H "X-Auth-Token: $TOKEN"
```

### TrustSec (Segmentación)

| Concepto | Descripción |
| :------- | :---------- |
| SGT | Security Group Tag (etiqueta de identidad) |
| SGACL | ACL basada en SGT, no en IP |
| pxGrid | Intercambio de contexto ISE ↔ DNA Center |
