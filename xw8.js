/*;
	@module-license:
		The MIT License (MIT)
		@mit-license

		Copyright (@c) 2017 Richeve Siodina Bebedor
		@email: richeve.bebedor@gmail.com

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.
	@end-module-license

	@module-configuration:
		{
			"package": "xw8",
			"path": "xw8/xw8.js",
			"file": "xw8.js",
			"module": "xw8",
			"author": "Richeve S. Bebedor",
			"eMail": "richeve.bebedor@gmail.com",
			"repository": "https://github.com/volkovasystems/xw8.git",
			"test": "xw8-test.js",
			"global": true
		}
	@end-module-configuration

	@module-documentation:
		Execute command and wait.
	@end-module-documentation

	@include:
		{
			"child": "child_process",
			"depher": "depher",
			"detr": "detr",
			"dly": "dly",
			"falzy": "falzy",
			"shft": "shft",
			"zelf": "zelf"
		}
	@end-include
*/

const child = require( "child_process" );
const depher = require( "depher" );
const detr = require( "detr" );
const dly = require( "dly" );
const falzy = require( "falzy" );
const shft = require( "shft" );
const zelf = require( "zelf" );

const DEFAULT_COUNT = 10;

const xw8 = function xw8( command, state, synchronous, option ){
	/*;
		@meta-configuration:
			{
				"command:required": "string",
				"state:required": "boolean",
				"synchronous": boolean,
				"option": "object"
			}
		@end-meta-configuration
	*/

	if( falzy( command ) || typeof command != "string" ){
		throw new Error( "invalid command" );
	}

	if( falzy( state ) || typeof state != "boolean" ){
		throw new Error( "invalid state" );
	}

	let parameter = shft( arguments, 2 );

	synchronous = depher( parameter, BOOLEAN, false );

	option = detr( parameter, {
		"count": DEFAULT_COUNT
	} );

	if( state ){
		command = `count=${ option.count }; while $(${ command }) && [ $count -ge 0 ]; do sleep 1; count=$(( $count - 1 )); done; exit 0;`;

	}else{
		command = `count=${ option.count }; until $(${ command }) || [ $count -le 0 ]; do sleep 1; count=$(( $count - 1 )); done; exit 0`;
	}

	if( synchronous ){
		return dly( true, { "command": command } );

	}else{
		let catcher = dly.bind( zelf( this ) )( { "command": command } )
			.then( function done( error ){
				if( error instanceof Error ){
					return catcher.pass( new Error( `cannot execute command and wait, ${ error.stack }` ), false );
				}

				return catcher.pass( null, true );
			} );

		return catcher;
	}
};

module.exports = xw8;
