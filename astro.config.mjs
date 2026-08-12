// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
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
					label: '2. Switching',
					items: [
						{ label: 'VLANs y Trunking (802.1Q)', slug: '02-switching/vlans-trunking' },
						{ label: 'Spanning Tree Protocol (STP / RSTP)', slug: '02-switching/spanning-tree-protocol' },
						{ label: 'EtherChannel (LACP / PAgP)', slug: '02-switching/etherchannel' },
						{ label: 'Seguridad de Capa 2', slug: '02-switching/layer-2-security' },
					],
				},
				{
					label: '3. Routing',
					items: [
						{ label: 'Rutas Estáticas y Default', slug: '03-routing/static-default-routes' },
						{ label: 'OSPFv2 (Área Única y Multi-área)', slug: '03-routing/ospfv2' },
						{ label: 'Métricas y Distancia Administrativa', slug: '03-routing/metrics-administrative-distance' },
						{ label: 'First Hop Redundancy (FHRP / HSRP)', slug: '03-routing/fhrp-hsrp' },
					],
				},
				{
					label: '4. Wireless Networks (WLAN)',
					items: [
						{ label: 'Arquitectura de APs y WLC', slug: '04-wireless-networks/ap-wlc-architecture' },
						{ label: 'Configuración de WLANs y SSIDs', slug: '04-wireless-networks/wlan-ssid-configuration' },
						{ label: 'Seguridad Inalámbrica (WPA2 / WPA3)', slug: '04-wireless-networks/wireless-security' },
					],
				},
				{
					label: '5. IP Services and Maintenance',
					items: [
						{ label: 'NAT / PAT', slug: '05-ip-services/nat-pat' },
						{ label: 'DHCP / DNS / NTP', slug: '05-ip-services/dhcp-dns-ntp' },
						{ label: 'Listas de Control de Acceso (ACLs)', slug: '05-ip-services/acls' },
					],
				},
			],
		}),
	],
});
