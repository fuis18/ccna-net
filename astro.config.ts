import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { satteri } from '@astrojs/markdown-satteri';
import { satteriKatexPlugin } from './src/plugins/satteri-katex.ts';
import { iosTheme } from './src/plugins/ios-theme.ts';
import { iosGrammar } from './src/plugins/ios-grammar.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://fuis18.is-a.dev',
  base: process.env.NODE_ENV === 'production' ? '/ccna-net/' : '/',
  vite: {
    resolve: {
      alias: {
        // @mermaid-js/parser (parser langium) es un módulo único de ~663 kB
        // que rolldown no puede partir; solo lo usan diagramas no soportados
        // aquí. Aliarlo a un stub lo elimina del build y evita el warning de
        // "chunks larger than 500 kB".
        '@mermaid-js/parser': fileURLToPath(
          new URL('./src/plugins/mermaid-parser-stub.ts', import.meta.url),
        ),
      },
    },
  },
  markdown: {
    processor: satteri({
      features: { math: true },
      hastPlugins: [satteriKatexPlugin],
    }),
    shikiConfig: {
      theme: iosTheme,
      langs: [iosGrammar],
    },
  },
  integrations: [
    mermaid({ autoTheme: true }),
    starlight({
      title: 'CCNA (Routers & Switches)',
      customCss: ['katex/dist/katex.min.css', './src/styles/custom.css'],
      expressiveCode: {
        themes: [iosTheme],
        useStarlightDarkModeSwitch: false,
      },
      sidebar: [
        {
          label: '1. Network Fundamentals',
          items: [
            { label: 'Visión general del módulo', slug: '01-network-fundamentals' },
            { label: 'Modelo OSI y TCP/IP', slug: '01-network-fundamentals/osi-tcp-ip-model' },
            { label: 'Direccionamiento IPv4 y Subnetting', slug: '01-network-fundamentals/ipv4-addressing-subnetting' },
            { label: 'Direccionamiento IPv6', slug: '01-network-fundamentals/ipv6-addressing' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '01-network-fundamentals/cheat-sheet' },
          ],
        },
        {
          label: '2. Device Management',
          items: [
            { label: 'Visión general del módulo', slug: '02-device-management' },
            { label: 'Acceso Inicial y Modos de CLI', slug: '02-device-management/cli-modes' },
            { label: 'Configuración Básica de Dispositivo', slug: '02-device-management/basic-configuration' },
            { label: 'Acceso Remoto Seguro (SSH vs. Telnet)', slug: '02-device-management/secure-remote-access' },
            { label: 'Gestión de Archivos y Sistema Operativo (IOS)', slug: '02-device-management/ios-file-management' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '02-device-management/cheat-sheet' },
            { label: 'Ejercicio: Puesta en Marcha', slug: '02-device-management/exercise' },
          ],
        },
        {
          label: '3. Configuración de Red (Switching & Direccionamiento)',
          items: [
            { label: 'Visión general del módulo', slug: '03-network-configuration' },
            { label: 'VLANs y Trunking (802.1Q)', slug: '03-network-configuration/vlans-trunking' },
            { label: 'Direccionamiento IP (Switch y Router)', slug: '03-network-configuration/addressing' },
            { label: 'Subinterfaces (Router-on-a-Stick)', slug: '03-network-configuration/subinterfaces' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '03-network-configuration/cheat-sheet' },
            { label: 'Ejercicio: Red de un Piso', slug: '03-network-configuration/exercise' },
          ],
        },
        {
          label: '4. Protocolos de Enrutamiento',
          items: [
            { label: 'Visión general del módulo', slug: '04-routing-protocols' },
            { label: 'Rutas Estáticas y Default', slug: '04-routing-protocols/static-default-routes' },
            { label: 'OSPF (Open Shortest Path First)', slug: '04-routing-protocols/ospf' },
            { label: 'EIGRP y RIP', slug: '04-routing-protocols/eigrp-rip' },
            { label: 'Redistribución entre protocolos', slug: '04-routing-protocols/redistribution' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '04-routing-protocols/cheat-sheet' },
            { label: 'Ejercicio: Routing entre Redes', slug: '04-routing-protocols/exercise' },
          ],
        },
        {
          label: '5. Switching y Seguridad',
          items: [
            { label: 'Visión general del módulo', slug: '05-switching-security' },
            { label: 'Spanning Tree Protocol (STP / RSTP)', slug: '05-switching-security/spanning-tree-protocol' },
            { label: 'EtherChannel (LACP / PAgP)', slug: '05-switching-security/etherchannel' },
            { label: 'Seguridad de Capa 2', slug: '05-switching-security/layer-2-security' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '05-switching-security/cheat-sheet' },
            { label: 'Ejercicio: Switching y Seguridad', slug: '05-switching-security/exercise' },
          ],
        },
        {
          label: '6. Routing y Redundancia',
          items: [
            { label: 'Visión general del módulo', slug: '06-routing-redundancy' },
            { label: 'Métricas y Distancia Administrativa', slug: '06-routing-redundancy/metrics-administrative-distance' },
            { label: 'OSPF avanzado (multi-área y punto a punto)', slug: '06-routing-redundancy/ospf-advanced' },
            { label: 'First Hop Redundancy (FHRP / HSRP)', slug: '06-routing-redundancy/fhrp-hsrp' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '06-routing-redundancy/cheat-sheet' },
            { label: 'Ejercicio: Gateway redundante', slug: '06-routing-redundancy/exercise' },
          ],
        },
        {
          label: '7. Wireless Networks (WLAN)',
          items: [
            { label: 'Visión general del módulo', slug: '07-wireless-networks' },
            { label: 'Arquitectura de APs y WLC', slug: '07-wireless-networks/ap-wlc-architecture' },
            { label: 'Configuración de WLANs y SSIDs', slug: '07-wireless-networks/wlan-ssid-configuration' },
            { label: 'Seguridad Inalámbrica (WPA2 / WPA3)', slug: '07-wireless-networks/wireless-security' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '07-wireless-networks/cheat-sheet' },
            { label: 'Ejercicio: Red Inalámbrica', slug: '07-wireless-networks/exercise' },
          ],
        },
        {
          label: '8. IP Services and Maintenance',
          items: [
            { label: 'Visión general del módulo', slug: '08-ip-services' },
            { label: 'NAT / PAT', slug: '08-ip-services/nat-pat' },
            { label: 'Conexión al ISP (Enlaces WAN)', slug: '08-ip-services/conexion-isp' },
            { label: 'DHCP / DNS / NTP', slug: '08-ip-services/dhcp-dns-ntp' },
            { label: 'Listas de Control de Acceso (ACLs)', slug: '08-ip-services/acls' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '08-ip-services/cheat-sheet' },
            { label: 'Ejercicio: Servicios IP', slug: '08-ip-services/exercise' },
          ],
        },
        {
          label: '9. QoS & Network Design',
          items: [
            { label: 'Visión general del módulo', slug: '09-qos-network-design' },
            { label: 'Algoritmos de Encolamiento', slug: '09-qos-network-design/queuing-algorithms' },
            { label: 'Calidad de Transmisión en Red', slug: '09-qos-network-design/network-transmission-quality' },
            { label: 'Redes Jerárquicas y Escalables', slug: '09-qos-network-design/hierarchy-scalable-networks' },
            { label: 'Documentación de Red', slug: '09-qos-network-design/network-documentation' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '09-qos-network-design/cheat-sheet' },
            { label: 'Ejercicio: QoS y Diseño', slug: '09-qos-network-design/exercise' },
          ],
        },
        {
          label: '10. Network Management & Troubleshooting',
          items: [
            { label: 'Visión general del módulo', slug: '10-management-troubleshooting' },
            { label: 'Descubrimiento de Dispositivos (CDP / LLDP)', slug: '10-management-troubleshooting/cdp-lldp' },
            { label: 'Monitoreo: SNMP y Syslog', slug: '10-management-troubleshooting/snmp-syslog' },
            { label: 'Metodología de Troubleshooting', slug: '10-management-troubleshooting/troubleshooting-process' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '10-management-troubleshooting/cheat-sheet' },
            { label: 'Ejercicio: Gestión y Diagnóstico', slug: '10-management-troubleshooting/exercise' },
          ],
        },
        {
          label: '11. Network Virtualization',
          items: [
            { label: 'Visión general del módulo', slug: '11-network-virtualization' },
            { label: 'Cloud Computing', slug: '11-network-virtualization/cloud-computing' },
            { label: 'Infraestructura Virtual de Red', slug: '11-network-virtualization/virtual-network-infra' },
            { label: 'Software-Defined Networking (SDN)', slug: '11-network-virtualization/sdn' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '11-network-virtualization/cheat-sheet' },
            { label: 'Ejercicio: Virtualización de Red', slug: '11-network-virtualization/exercise' },
          ],
        },
        {
          label: '12. Network Automation',
          items: [
            { label: 'Visión general del módulo', slug: '12-network-automation' },
            { label: 'Panorama de Automatización', slug: '12-network-automation/automation-overview' },
            { label: 'APIs y Formatos de Datos', slug: '12-network-automation/apis-data-frames' },
            { label: 'Herramientas de Gestión de Configuración', slug: '12-network-automation/config-management-tools' },
            { label: 'IBN y Cisco DNA Center', slug: '12-network-automation/ibn-dna-center' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '12-network-automation/cheat-sheet' },
            { label: 'Ejercicio: Automatización de Red', slug: '12-network-automation/exercise' },
          ],
        },
      ],
    }),
  ],
});
