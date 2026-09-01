---
title: Herramientas de Gestión de Configuración
description: "Ansible, Terraform, Puppet, Chef: herramientas para gestionar configuraciones de forma declarativa, versionada y automatizada."
---

Las herramientas de gestión de configuración permiten definir el **estado
deseado** de la red en archivos de texto versionados (Git) y aplicarlos
automáticamente a múltiples dispositivos.

## Ansible

**La herramienta más popular** para automatización de red. No necesita agente
(en comparación con Puppet/Chef) y usa SSH para conectarse a los dispositivos.

### Conceptos clave

| Concepto | Descripción |
| :------- | :---------- |
| **Playbook** | Archivo YAML que define las tareas a ejecutar |
| **Inventory** | Lista de dispositivos y sus datos |
| **Module** | Función que ejecuta una acción específica |
| **Role** | Colección reutilizable de playbooks |
| **Template** | Plantilla Jinja2 con variables |

### Playbook de ejemplo

```yaml
---
# playbook-vlans.yml
- name: Configurar VLANs en switches
  hosts: switches
  gather_facts: yes
  tasks:
    - name: Crear VLAN 10 - Datos
      ios_vlans:
        config:
          - vlan_id: 10
            name: Datos
            state: active
        state: merged

    - name: Crear VLAN 20 - Voz
      ios_vlans:
        config:
          - vlan_id: 20
            name: Voz
            state: active
        state: merged

    - name: Configurar puertos de acceso
      ios_interfaces:
        config:
          - name: FastEthernet0/1
            switchport:
              mode: access
              access_vlan: 10
        state: merged
```

### Inventory de ejemplo

```yaml
# inventory.yml
all:
  children:
    switches:
      hosts:
        SW1:
          ansible_host: 192.168.99.10
          ansible_user: admin
          ansible_password: "{{ vault_sw1_pass }}"
          ansible_network_os: ios
        SW2:
          ansible_host: 192.168.99.11
          ansible_user: admin
          ansible_password: "{{ vault_sw2_pass }}"
          ansible_network_os: ios
    routers:
      hosts:
        R1:
          ansible_host: 192.168.99.1
          ansible_user: admin
          ansible_password: "{{ vault_r1_pass }}"
          ansible_network_os: ios
```

### Ejecución

```bash
# Ejecutar playbook
ansible-playbook -i inventory.yml playbook-vlans.yml

# Dry run (sin aplicar cambios)
ansible-playbook -i inventory.yml playbook-vlans.yml --check

# Ver diff de cambios
ansible-playbook -i inventory.yml playbook-vlans.yml --diff

# Limitar a un host
ansible-playbook -i inventory.yml playbook-vlans.yml --limit SW1
```

### Módulos de red Ansible

| Módulo | Función |
| :----- | :------ |
| `ios_config` | Enviar configuración IOS |
| `ios_vlans` | Gestionar VLANs |
| `ios_interfaces` | Configurar interfaces |
| `ios_l3_interfaces` | Configurar IPs en interfaces |
| `ios_static_routes` | Agregar rutas estáticas |
| `ios_acls` | Gestionar ACLs |
| `ios_ping` | Hacer ping desde el dispositivo |

## Terraform

Herramienta de **Hashicorp** para gestionar infraestructura como código.
Se enfoca en el ciclo de vida de recursos (crear, modificar, destruir).

### Terraform para red

```hcl
# main.tf
terraform {
  required_providers {
    ciscoise = {
      source  = "CiscoDevNet/ciscoise"
      version = "~> 0.1"
    }
  }
}

provider "ciscoise" {
  username = "admin"
  password = "password"
  url      = "https://dna-center.local"
}

resource "cisco_network_device" "switch" {
  hostname     = "SW1"
  ip_address   = "192.168.99.10"
  platform     = "C9200"
  management_ip = "192.168.99.10"
}
```

### Comandos Terraform

```bash
terraform init      # Inicializar provider
terraform plan      # Ver cambios sin aplicar
terraform apply     # Aplicar cambios
terraform destroy   # Destruir recursos
```

## Puppet y Chef

Herramientas **basadas en agente**: necesitan un agente instalado en cada
dispositivo.

| Característica | Ansible | Puppet | Chef |
| :------------- | :------ | :---- | :--- |
| Agente | **No** (agentless) | Sí | Sí |
| Transporte | SSH | HTTPS | HTTPS |
| Lenguaje | YAML | DSL propio (Puppet) | Ruby (DSL) |
| Servidor | No necesario | Puppet Master | Chef Server |
| Complejidad | Baja | Media | Alta |
| Uso en redes | Muy común | Común | Común |

## Git como sistema de versionado

Toda configuración de red debería estar en **Git**:

```bash
# Estructura del repositorio
network-configs/
├── inventory.yml
├── playbooks/
│   ├── vlans.yml
│   ├── qos.yml
│   └── backup.yml
├── group_vars/
│   ├── switches.yml
│   └── routers.yml
├── templates/
│   └── config-backup.j2
└── backups/
    ├── R1-running.cfg
    └── SW1-running.cfg
```

```bash
git init
git add .
git commit -m "Initial commit: playbooks de VLANs y QoS"
git push origin main
```

### Detección de config drift

Comparar la configuración actual con la almacenada en Git:

```bash
# Backup actual
ssh admin@192.168.99.1 "show running-config" > backups/R1-actual.cfg

# Comparar con Git
diff backups/R1-actual.cfg backups/R1-git.cfg

# O usar Ansible para automatizar
ansible-playbook check-drift.yml
```

## Decidir qué herramienta usar

| Necesidad | Herramienta recomendada |
| :-------- | :---------------------- |
| Configuración simple de switches | Ansible |
| Gestión de infraestructura cloud | Terraform |
| Gestión compleja con agente | Puppet |
| Configuración Ruby-friendly | Chef |
| Monitoreo en tiempo real | gNMI + script Python |
