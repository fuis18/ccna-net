// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://fuis18.is-a.dev',
  base: process.env.NODE_ENV === 'production' ? '/ccna-net/' : '/',
  integrations: [
    starlight({
      title: 'CCNA (Routers & Switches)',
      sidebar: [
        {
          label: '1. Network Fundamentals',
          items: [
            { label: 'Modelo OSI y TCP/IP', slug: '01-network-fundamentals/osi-tcp-ip-model' },
            { label: 'Direccionamiento IPv4 y Subnetting', slug: '01-network-fundamentals/ipv4-addressing-subnetting' },
            { label: 'Direccionamiento IPv6', slug: '01-network-fundamentals/ipv6-addressing' },
          ],
        },
        {
          label: '2. Device Management',
          items: [
            { label: '', slug: '' }
          ]
        },
        {
          label: '3. Switching',
          items: [
            { label: 'VLANs y Trunking (802.1Q)', slug: '03-switching/vlans-trunking' },
            { label: 'Spanning Tree Protocol (STP / RSTP)', slug: '03-switching/spanning-tree-protocol' },
            { label: 'EtherChannel (LACP / PAgP)', slug: '03-switching/etherchannel' },
            { label: 'Seguridad de Capa 2', slug: '03-switching/layer-2-security' },
          ],
        },
        {
          label: '4. Routing',
          items: [
            { label: 'Rutas Estáticas y Default', slug: '04-routing/static-default-routes' },
            { label: 'OSPFv2 (Área Única y Multi-área)', slug: '04-routing/ospfv2' },
            { label: 'Métricas y Distancia Administrativa', slug: '04-routing/metrics-administrative-distance' },
            { label: 'First Hop Redundancy (FHRP / HSRP)', slug: '04-routing/fhrp-hsrp' },
          ],
        },
        {
          label: '5. Wireless Networks (WLAN)',
          items: [
            { label: 'Arquitectura de APs y WLC', slug: '05-wireless-networks/ap-wlc-architecture' },
            { label: 'Configuración de WLANs y SSIDs', slug: '05-wireless-networks/wlan-ssid-configuration' },
            { label: 'Seguridad Inalámbrica (WPA2 / WPA3)', slug: '05-wireless-networks/wireless-security' },
          ],
        },
        {
          label: '6. IP Services and Maintenance',
          items: [
            { label: 'NAT / PAT', slug: '06-ip-services/nat-pat' },
            { label: 'DHCP / DNS / NTP', slug: '06-ip-services/dhcp-dns-ntp' },
            { label: 'Listas de Control de Acceso (ACLs)', slug: '06-ip-services/acls' },
          ],
        },
      ],
    }),
  ],
});
