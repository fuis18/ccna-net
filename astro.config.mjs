// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { satteri } from '@astrojs/markdown-satteri';
import { satteriKatexPlugin } from './src/plugins/satteri-katex.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://fuis18.is-a.dev',
  base: process.env.NODE_ENV === 'production' ? '/ccna-net/' : '/',
  markdown: {
    processor: satteri({
      features: { math: true },
      hastPlugins: [satteriKatexPlugin],
    }),
  },
  integrations: [
    mermaid({ autoTheme: true }),
    starlight({
      title: 'CCNA (Routers & Switches)',
      customCss: ['katex/dist/katex.min.css', './src/styles/custom.css'],
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
          ],
        },
        {
          label: '3. Switching',
          items: [
            { label: 'Visión general del módulo', slug: '03-switching' },
            { label: 'VLANs y Trunking (802.1Q)', slug: '03-switching/vlans-trunking' },
            { label: 'Spanning Tree Protocol (STP / RSTP)', slug: '03-switching/spanning-tree-protocol' },
            { label: 'EtherChannel (LACP / PAgP)', slug: '03-switching/etherchannel' },
            { label: 'Seguridad de Capa 2', slug: '03-switching/layer-2-security' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '03-switching/cheat-sheet' },
          ],
        },
        {
          label: '4. Routing',
          items: [
            { label: 'Visión general del módulo', slug: '04-routing' },
            { label: 'Rutas Estáticas y Default', slug: '04-routing/static-default-routes' },
            { label: 'OSPFv2 (Área Única y Multi-área)', slug: '04-routing/ospfv2' },
            { label: 'Métricas y Distancia Administrativa', slug: '04-routing/metrics-administrative-distance' },
            { label: 'First Hop Redundancy (FHRP / HSRP)', slug: '04-routing/fhrp-hsrp' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '04-routing/cheat-sheet' },
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
          ],
        },
        {
          label: '6. IP Services and Maintenance',
          items: [
            { label: 'Visión general del módulo', slug: '06-ip-services' },
            { label: 'NAT / PAT', slug: '06-ip-services/nat-pat' },
            { label: 'DHCP / DNS / NTP', slug: '06-ip-services/dhcp-dns-ntp' },
            { label: 'Listas de Control de Acceso (ACLs)', slug: '06-ip-services/acls' },
            { label: 'Referencia Técnica (Cheat Sheet)', slug: '06-ip-services/cheat-sheet' },
          ],
        },
      ],
    }),
  ],
});
