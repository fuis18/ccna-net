import katex from 'katex';

const mathClass = (node) => {
  const className = node.properties?.className;
  return Array.isArray(className) ? className : [];
};

const renderMath = (source, displayMode) =>
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
        if (!code) return;
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
};