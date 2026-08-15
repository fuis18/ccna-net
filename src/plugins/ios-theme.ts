import type { ThemeRegistrationRaw } from '@shikijs/types';

// Tema oscuro tipo terminal. Aplica a todos los bloques de código (vía
// markdown.shikiConfig), pero las reglas específicas de `source.ios` solo
// colorean los bloques ```ios. El resto de lenguajes usa reglas genéricas.
export const iosTheme = {
  name: 'ccna-terminal-dark',
  type: 'dark',
  colors: {
    'editor.background': '#0d1117',
    'editor.foreground': '#c9d1d9',
  },
  settings: [
    // Bloques de terminal Cisco IOS (```ios)
    { scope: 'comment.line.ios', settings: { foreground: '#3fb950' } },
    { scope: 'constant.prompt.ios', settings: { foreground: '#f0f6fc' } },
    { scope: 'keyword.command.ios', settings: { foreground: '#58a6ff' } },
    // Reglas genéricas para otros lenguajes
    { scope: 'comment', settings: { foreground: '#8b949e' } },
    { scope: 'string', settings: { foreground: '#a5d6ff' } },
    { scope: 'number', settings: { foreground: '#79c0ff' } },
    { scope: 'keyword', settings: { foreground: '#ff7b72' } },
    { scope: 'function', settings: { foreground: '#d2a8ff' } },
    { scope: 'variable', settings: { foreground: '#ffa657' } },
    { scope: 'constant', settings: { foreground: '#79c0ff' } },
  ],
} satisfies ThemeRegistrationRaw;