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
          label: '3. Configuración de Red (Switching & Routing)',
          items: [
            { label: 'Visión general del módulo', slug: '03-network-configuration' },
            { label: 'VLANs y Trunking (802.1Q)', slug: '03-network-configuration/vlans-trunking' },
            { label: 'Direccionamiento IP (Switch y Router)', slug: '03-network-configuration/addressing' },
            { label: 'Subinterfaces (Router-on-a-Stick)', slug: '03-network-configuration/subinterfaces' },
            { label: 'Rutas Estáticas y Default', slug: '03-network-configuration/static-default-routes' },
            { label: 'Protocolos de Enrutamiento Dinámico (OSPF / EIGRP / RIP)', slug: '03-network-configuration/routing-protocols' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '03-network-configuration/cheat-sheet' },
            { label: 'Ejercicio: Red de un Piso', slug: '03-network-configuration/exercise' },
          ],
        },
        {
          label: '4. Redundancia y Seguridad',
          items: [
            { label: 'Visión general del módulo', slug: '04-redundancy-security' },
            { label: 'Spanning Tree Protocol (STP / RSTP)', slug: '04-redundancy-security/spanning-tree-protocol' },
            { label: 'EtherChannel (LACP / PAgP)', slug: '04-redundancy-security/etherchannel' },
            { label: 'Métricas y Distancia Administrativa', slug: '04-redundancy-security/metrics-administrative-distance' },
            { label: 'First Hop Redundancy (FHRP / HSRP)', slug: '04-redundancy-security/fhrp-hsrp' },
            { label: 'Seguridad de Capa 2', slug: '04-redundancy-security/layer-2-security' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '04-redundancy-security/cheat-sheet' },
            { label: 'Ejercicio: Redundancia y Seguridad', slug: '04-redundancy-security/exercise' },
          ],
        },
        {
          label: '5. Wireless Networks (WLAN)',
          items: [
            { label: 'Visión general del módulo', slug: '05-wireless-networks' },
            { label: 'Arquitectura de APs y WLC', slug: '05-wireless-networks/ap-wlc-architecture' },
            { label: 'Configuración de WLANs y SSIDs', slug: '05-wireless-networks/wlan-ssid-configuration' },
            { label: 'Seguridad Inalámbrica (WPA2 / WPA3)', slug: '05-wireless-networks/wireless-security' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '05-wireless-networks/cheat-sheet' },
            { label: 'Ejercicio: Red Inalámbrica', slug: '05-wireless-networks/exercise' },
          ],
        },
        {
          label: '6. IP Services and Maintenance',
          items: [
            { label: 'Visión general del módulo', slug: '06-ip-services' },
            { label: 'NAT / PAT', slug: '06-ip-services/nat-pat' },
            { label: 'Conexión al ISP (Enlaces WAN)', slug: '06-ip-services/conexion-isp' },
            { label: 'DHCP / DNS / NTP', slug: '06-ip-services/dhcp-dns-ntp' },
            { label: 'Listas de Control de Acceso (ACLs)', slug: '06-ip-services/acls' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '06-ip-services/cheat-sheet' },
            { label: 'Ejercicio: Servicios IP', slug: '06-ip-services/exercise' },
          ],
        },
      ],
    }),
  ],
});
