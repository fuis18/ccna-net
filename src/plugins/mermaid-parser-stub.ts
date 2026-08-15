// Stub de @mermaid-js/parser (parser langium de mermaid).
// Este sitio solo usa diagramas graph/flowchart y sequenceDiagram, que no
// importan este paquete. Aliarlo a este stub elimina del build el chunk de
// ~663 kB (módulo único que rolldown no puede partir con codeSplitting).
// Las funciones devuelven un objeto seguro y nunca se ejecutan en runtime
// porque los diagramas que usan el parser (cynefin, er, state, timeline,
// railroad, etc.) no se detectan en este sitio.

const safe: Record<string, unknown> = new Proxy({}, { get: () => safe });

export function parse(_text: string): unknown {
  return safe;
}

export function isEmResetFrame(_frame: unknown): boolean {
  return false;
}

export class MermaidParseError extends Error {}

function createServices(): unknown {
  return safe;
}

export { createServices as createRailroadAbnfServices };
export { createServices as createRailroadEbnfServices };
export { createServices as createRailroadPegServices };
export { createServices as createRailroadServices };