;(function()
{
	// CommonJS
	SyntaxHighlighter = SyntaxHighlighter || (typeof require !== 'undefined'? require('shCore').SyntaxHighlighter : null);

	function Brush()
	{
	
		var datatypes =	'wire reg integer real time logic tri ';

		var keywords =	'always assign begin case casex casez default else end endcase endfunction endmodule endprimitive endtable endtask ' +
						'for forever function if initial inout input localparam module negedge output parameter posedge primitive ' +
						'repeat table task timescale while always_ff always_comb always_latch typedef enum ';
					
		var functions =	'and or nand nor not xor ';

		this.regexList = [
			{ regex: SyntaxHighlighter.regexLib.singleLineCComments,	css: 'comments' },			// one line comments
			{ regex: SyntaxHighlighter.regexLib.multiLineCComments,		css: 'comments' },			// multiline comments
		    { regex: /(R|L|U|u|u8)?"([^\\"\n]|\\.)*"/g,                 css: 'string' },			// special character
			{ regex: SyntaxHighlighter.regexLib.doubleQuotedString,		css: 'string' },			// strings
			{ regex: new RegExp(this.getKeywords(datatypes), 'gm'),		css: 'color1 bold' },
			{ regex: new RegExp(this.getKeywords(functions), 'gm'),		css: 'functions bold' },
			{ regex: new RegExp(this.getKeywords(keywords), 'gm'),		css: 'keyword bold' }
			];
	};

	Brush.prototype	= new SyntaxHighlighter.Highlighter();
	Brush.aliases	= ['v', 'verilog'];

	SyntaxHighlighter.brushes.Verilog = Brush;

	// CommonJS
	typeof(exports) != 'undefined' ? exports.Brush = Brush : null;
})();
