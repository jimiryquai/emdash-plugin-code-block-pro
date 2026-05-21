// Site-side rendering components for code blocks
import CodeBlock from "./CodeBlock.astro";
import CodeBlockPro from "./CodeBlockPro.astro";

export const blockComponents: Record<string, any> = {
	code: CodeBlock,
	"code-block-pro": CodeBlockPro,
};
