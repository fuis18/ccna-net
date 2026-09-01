import type { LanguageRegistration } from '@shikijs/types';

// Gramática TextMate para bloques de terminal Cisco IOS (```ios).
// - Líneas que empiezan con `!` o `#`  -> comment.line.ios   (verde)
// - Prompt (hostname + modo + #/>)      -> constant.prompt.ios (blanco)
// - El resto de la línea tras el prompt -> keyword.command.ios (azul)
// - Líneas que empiezan con un comando  -> keyword.command.ios (azul)
// - Líneas de salida sin prompt         -> sin scope (color por defecto)
export const iosGrammar = {
  name: 'ios',
  scopeName: 'source.ios',
  repository: {},
  patterns: [
    {
      match: '^\\s*[!#].*$',
      name: 'comment.line.ios',
    },
    {
      begin: '^\\s*[\\w.-]+(?:\\s*\\([\\w.-]+\\))?[#>%$]\\s*',
      beginCaptures: { 0: { name: 'constant.prompt.ios' } },
      end: '$',
      patterns: [{ match: '.+', name: 'keyword.command.ios' }],
    },
    {
      match:
        '^\\s*(enable|configure\\s+terminal|hostname|interface|int|no|switchport|vlan|username|line|password|login|transport|crypto|banner|clock|copy|show|exit|end|no\\s+shutdown|shutdown|description|bandwidth|spanning-tree|channel-group|access-list|ip|ipv6|router|network|boot\\s+system|ntp|dot11|ssh|telnet|ping|traceroute|write|reload|dir|debug|arp|cdp|lldp|logging|snmp-server)\\b',
      name: 'keyword.command.ios',
    },
  ],
} satisfies LanguageRegistration;
