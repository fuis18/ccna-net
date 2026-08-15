import katex from 'katex';
import type { HastPluginDefinition } from 'satteri';
import type { Element } from 'hast';

const mathClass = (node: Readonly<Element>): string[] => {
  const className = node.properties?.className;
  if (!Array.isArray(className)) return [];
  return className.filter((c): c is string => typeof c === 'string');
};

const renderMath = (source: string, displayMode: boolean): string =>
  katex.renderToString(source, { displayMode, throwOnError: false });

export const satteriKatexPlugin = {
  name: 'satteri-katex',
  element: [
    {
      filter: ['pre'],
      visit(node, ctx) {
        const code = node.children?.find(
          (child) => child.type === 'element' && child.tagName === 'code'
        );
        if (code?.type !== 'element') return;
        const className = mathClass(code);
        if (!className.includes('language-math') && !className.includes('math-display')) return;
        const html = renderMath(ctx.textContent(code), true);
        ctx.replaceNode(node, { type: 'raw', value: `<div class="not-content">${html}</div>` });
      },
    },
    {
      filter: ['code'],
      visit(node, ctx) {
        const className = mathClass(node);
        if (!className.includes('language-math') && !className.includes('math-inline')) return;
        const html = renderMath(ctx.textContent(node), false);
        ctx.replaceNode(node, { type: 'raw', value: `<span class="not-content">${html}</span>` });
      },
    },
  ],
} satisfies HastPluginDefinition;