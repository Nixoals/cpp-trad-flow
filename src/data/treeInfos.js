const lebelColors = {
	root: 'aliceblue',
    entryPoint: '#CD6155',
	serializeNode: '#22b573',
	finalNode: '#D5F5E3',
	interface: 'orange',
	createBlock: '#AF7AC5',
	injectBlock: '#EC7063',
};

const treeInfos = [
	{ id: 'get-text-code', label: 'Get text code', connectedTo: 'start', position: 'up', level: 1, style: { background: lebelColors.interface } },
	{ id: 'reset-constants', label: 'Reset Class constants', connectedTo: 'start', position: 'down', level: 1, style: { background: lebelColors.root } },
	{ id: 'code-parsing', label: 'Code parsing', connectedTo: 'start', position: 'down', level: 1, style: { background: lebelColors.root } },
	{ id: 'first-pass-functions', label: 'First pass functions', connectedTo: 'code-parsing', position: 'down', level: 2, style: { background: lebelColors.root } },
	{ id: 'store-functions', label: 'Store functions', connectedTo: 'first-pass-functions', position: 'down', level: 3, style: { background: lebelColors.root } },
	{ id: 'second-pass', label: 'Second pass', connectedTo: 'code-parsing', position: 'down', level: 2, style: { background: lebelColors.root } },
	{ id: 'convert-ast', label: 'AST Conversion', connectedTo: 'second-pass', position: 'down', level: 3, style: { background: lebelColors.root } },
	{ id: 'starting-loop-conversion', label: 'Starting loop conversion (serialize nodes)', connectedTo: 'convert-ast', position: 'down', level: 4, style: { background: lebelColors.entryPoint } },
	{ id: 'translation-unit-children', label: 'Translation unit children', connectedTo: 'starting-loop-conversion', position: 'down', level: 5, style: { background: lebelColors.root } },

	{ id: 'function-definition', label: 'Function def', connectedTo: 'translation-unit-children', position: 'down', level: 6, style: { background: lebelColors.serializeNode } },
	{ id: 'void-loop', label: 'Void loop', connectedTo: 'function-definition', position: 'down', level: 7, style: { background: lebelColors.serializeNode } },
	{ id: 'void-setup', label: 'Void setup', connectedTo: 'function-definition', position: 'down', level: 7, style: { background: lebelColors.serializeNode } },
	{ id: 'function-custom', label: 'Function custom', connectedTo: 'function-definition', position: 'down', level: 7, style: { background: lebelColors.serializeNode } },
	{ id: 'compound-statement', label: 'Compound statement', connectedTo: ['void-loop', 'void-setup', 'function-custom'], position: 'down', level: 8, style: { background: lebelColors.serializeNode } },
	{ id: 'serialize-multi-nodes', label: 'Serialize multi nodes', connectedTo: ['compound-statement', 'create-blocks'], position: 'down', level: 9, style: { background: lebelColors.serializeNode } },

	{ id: 'create-statement', label: 'Create Blockly statement', connectedTo: 'serialize-multi-nodes', position: 'down', level: 10, style: { background: lebelColors.serializeNode } },
	{ id: 'serialize-nodes', label: 'Serialize nodes', connectedTo: ['serialize-multi-nodes', 'create-statement', 'create-blocks'], position: 'down', level: 10, style: { background: lebelColors.serializeNode } },

	{ id: 'expression_statement', label: 'Expression statement', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'compound_statement', label: 'Compound statement', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'field_expression', label: 'Field expression', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'call_expression_for_return', label: 'Call expression for return', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'call_expression', label: 'Call expression', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'number_literal', label: 'Number literal', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'char_literal', label: 'Char literal', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'string_literal', label: 'String literal', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'binary_expression', label: 'Binary expression', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'unary_expression', label: 'Unary expression', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'if_statement', label: 'If statement', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'for_statement', label: 'For statement', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'declaration', label: 'Declaration', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'assignment_expression', label: 'Assignment expression', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'identifier', label: 'Identifier', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'comment', label: 'Comment', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'initializer_list', label: 'Initializer list', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'subscript_expression', label: 'Subscript expression', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'while_statement', label: 'While statement', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'cast_expression', label: 'Cast expression', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'return_statement', label: 'Return statement', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'switch_statement', label: 'Switch statement', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'preproc_include', label: 'Preproc include', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'preproc_def', label: 'Preproc def', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },
	{ id: 'pin_declaration', label: 'Pin declaration', connectedTo: 'serialize-nodes', position: 'down', level: 11, style: { background: lebelColors.finalNode } },

	{
		id: 'create-blocks',
		label: 'Create blocks Recursive call',
		connectedTo: ['expression_statement', 'compound_statement', 'field_expression', 'call_expression_for_return', 'call_expression', 'number_literal', 'char_literal', 'string_literal', 'binary_expression', 'unary_expression', 'if_statement', 'for_statement', 'declaration', 'assignment_expression', 'identifier', 'comment', 'initializer_list', 'subscript_expression', 'while_statement', 'cast_expression', 'return_statement', 'switch_statement', 'preproc_include', 'preproc_def', 'pin_declaration'],
		position: 'down',
		level: 12,
		style: { background: lebelColors.createBlock },
	},
	{ id: 'append-block', label: 'Append block to xml', connectedTo: 'create-blocks', position: 'down', level: 13, style: { background: lebelColors.injectBlock } },
    { id: 'reorganize-blocks', label: 'Reorganize prototype blocks', connectedTo: 'append-block', position: 'down', level: 14, style: { background: lebelColors.injectBlock } },
    { id: 'inject-blocks', label: 'Inject blocks', connectedTo: 'append-block', position: 'down', level: 14, style: { background: lebelColors.injectBlock }},

	{ id: 'standalone-blocks', label: 'Standalone blocks', connectedTo: 'translation-unit-children', position: 'down', level: 6, style: { background: lebelColors.serializeNode } },
	{ id: 'includes-blocks', label: 'Include blocks', connectedTo: 'standalone-blocks', position: 'down', level: 7, style: { background: lebelColors.serializeNode } },
	{ id: 'define-blocks', label: 'Define blocks', connectedTo: 'standalone-blocks', position: 'down', level: 7, style: { background: lebelColors.serializeNode } },
    
];

export default treeInfos;
