/**
* @license Apache-2.0
*
* Copyright (c) 2025 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable max-depth */

'use strict';

// MODULES //

var copyIndexed = require( '@stdlib/array-base-copy-indexed' );
var incrementOffsets = require( './increment_offsets.js' );
var setViewOffsets = require( './set_view_offsets.js' );
var offsets = require( './offsets.js' );


// MAIN //

/**
* Performs a reduction over an input ndarray and assigns results to a provided output ndarray.
*
* @private
* @param {Function} fcn - wrapper for a one-dimensional strided array reduction function
* @param {Array<Object>} arrays - ndarrays
* @param {Array<Object>} views - initialized ndarray-like objects representing sub-array views
* @param {IntegerArray} strides - loop dimension strides for the input ndarray
* @param {boolean} isRowMajor - boolean indicating if provided arrays are in row-major order
* @param {Function} strategy - input ndarray reshape strategy
* @param {Options} opts - function options
* @returns {void}
*
* @example
* var Float64Array = require( '@stdlib/array-float64' );
* var ndarray2array = require( '@stdlib/ndarray-base-to-array' );
* var getStride = require( '@stdlib/ndarray-base-stride' );
* var getOffset = require( '@stdlib/ndarray-base-offset' );
* var getData = require( '@stdlib/ndarray-base-data-buffer' );
* var numelDimension = require( '@stdlib/ndarray-base-numel-dimension' );
* var gsum = require( '@stdlib/blas-ext-base-gsum' ).ndarray;
*
* function wrapper( arrays ) {
*     var x = arrays[ 0 ];
*     return gsum( numelDimension( x, 0 ), getData( x ), getStride( x, 0 ), getOffset( x ) );
* }
*
* // Create data buffers:
* var xbuf = new Float64Array( [ 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0 ] );
* var ybuf = new Float64Array( [ 0.0, 0.0, 0.0 ] );
*
* // Define the array shapes:
* var xsh = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 2, 2 ];
* var ysh = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 3 ];
*
* // Define the array strides:
* var sx = [ 12, 12, 12, 12, 12, 12, 12, 12, 12, 4, 2, 1 ];
* var sy = [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 1 ];
*
* // Define the index offsets:
* var ox = 0;
* var oy = 0;
*
* // Create an input ndarray-like object:
* var x = {
*     'dtype': 'float64',
*     'data': xbuf,
*     'shape': xsh,
*     'strides': sx,
*     'offset': ox,
*     'order': 'row-major'
* };
*
* // Create an output ndarray-like object:
* var y = {
*     'dtype': 'float64',
*     'data': ybuf,
*     'shape': ysh,
*     'strides': sy,
*     'offset': oy,
*     'order': 'row-major'
* };
*
* // Initialize ndarray-like objects representing sub-array views:
* var views = [
*     {
*         'dtype': x.dtype,
*         'data': x.data,
*         'shape': [ 2, 2 ],
*         'strides': [ 2, 1 ],
*         'offset': x.offset,
*         'order': x.order
*     }
* ];
*
* // Define a reshape strategy:
* function strategy( x ) {
*     return {
*         'dtype': x.dtype,
*         'data': x.data,
*         'shape': [ 4 ],
*         'strides': [ 1 ],
*         'offset': x.offset,
*         'order': x.order
*     };
* }
*
* // Perform a reduction:
* unary10d( wrapper, [ x, y ], views, [ 12, 12, 12, 12, 12, 12, 12, 12, 12, 4 ], true, strategy, {} );
*
* var arr = ndarray2array( y.data, y.shape, y.strides, y.offset, y.order );
* // returns [ [ [ [ [ [ [ [ [ [ 10.0, 26.0, 42.0 ] ] ] ] ] ] ] ] ] ]
*/
function unary10d( fcn, arrays, views, strides, isRowMajor, strategy, opts ) { // eslint-disable-line max-statements
	var ybuf;
	var dv0;
	var dv1;
	var dv2;
	var dv3;
	var dv4;
	var dv5;
	var dv6;
	var dv7;
	var dv8;
	var dv9;
	var sh;
	var S0;
	var S1;
	var S2;
	var S3;
	var S4;
	var S5;
	var S6;
	var S7;
	var S8;
	var S9;
	var sv;
	var iv;
	var i0;
	var i1;
	var i2;
	var i3;
	var i4;
	var i5;
	var i6;
	var i7;
	var i8;
	var i9;
	var y;
	var v;
	var i;

	// Note on variable naming convention: S#, dv#, i# where # corresponds to the loop number, with `0` being the innermost loop...

	// Resolve the output ndarray and associated shape:
	y = arrays[ 1 ];
	sh = y.shape;

	// Extract loop variables for purposes of loop interchange: dimensions and loop offset (pointer) increments...
	if ( isRowMajor ) {
		// For row-major ndarrays, the last dimensions have the fastest changing indices...
		S0 = sh[ 9 ];
		S1 = sh[ 8 ];
		S2 = sh[ 7 ];
		S3 = sh[ 6 ];
		S4 = sh[ 5 ];
		S5 = sh[ 4 ];
		S6 = sh[ 3 ];
		S7 = sh[ 2 ];
		S8 = sh[ 1 ];
		S9 = sh[ 0 ];
		dv0 = [ strides[9] ];                     // offset increment for innermost loop
		dv1 = [ strides[8] - ( S0*strides[9] ) ];
		dv2 = [ strides[7] - ( S1*strides[8] ) ];
		dv3 = [ strides[6] - ( S2*strides[7] ) ];
		dv4 = [ strides[5] - ( S3*strides[6] ) ];
		dv5 = [ strides[4] - ( S4*strides[5] ) ];
		dv6 = [ strides[3] - ( S5*strides[4] ) ];
		dv7 = [ strides[2] - ( S6*strides[3] ) ];
		dv8 = [ strides[1] - ( S7*strides[2] ) ];
		dv9 = [ strides[0] - ( S8*strides[1] ) ]; // offset increment for outermost loop
		for ( i = 1; i < arrays.length; i++ ) {
			sv = arrays[ i ].strides;
			dv0.push( sv[9] );
			dv1.push( sv[8] - ( S0*sv[9] ) );
			dv2.push( sv[7] - ( S1*sv[8] ) );
			dv3.push( sv[6] - ( S2*sv[7] ) );
			dv4.push( sv[5] - ( S3*sv[6] ) );
			dv5.push( sv[4] - ( S4*sv[5] ) );
			dv6.push( sv[3] - ( S5*sv[4] ) );
			dv7.push( sv[2] - ( S6*sv[3] ) );
			dv8.push( sv[1] - ( S7*sv[2] ) );
			dv9.push( sv[0] - ( S8*sv[1] ) );
		}
	} else { // order === 'column-major'
		// For column-major ndarrays, the first dimensions have the fastest changing indices...
		S0 = sh[ 0 ];
		S1 = sh[ 1 ];
		S2 = sh[ 2 ];
		S3 = sh[ 3 ];
		S4 = sh[ 4 ];
		S5 = sh[ 5 ];
		S6 = sh[ 6 ];
		S7 = sh[ 7 ];
		S8 = sh[ 8 ];
		S9 = sh[ 9 ];
		dv0 = [ strides[0] ];                     // offset increment for innermost loop
		dv1 = [ strides[1] - ( S0*strides[0] ) ];
		dv2 = [ strides[2] - ( S1*strides[1] ) ];
		dv3 = [ strides[3] - ( S2*strides[2] ) ];
		dv4 = [ strides[4] - ( S3*strides[3] ) ];
		dv5 = [ strides[5] - ( S4*strides[4] ) ];
		dv6 = [ strides[6] - ( S5*strides[5] ) ];
		dv7 = [ strides[7] - ( S6*strides[6] ) ];
		dv8 = [ strides[8] - ( S7*strides[7] ) ];
		dv9 = [ strides[9] - ( S8*strides[8] ) ];  // offset increment for outermost loop
		for ( i = 1; i < arrays.length; i++ ) {
			sv = arrays[ i ].strides;
			dv0.push( sv[0] );
			dv1.push( sv[1] - ( S0*sv[0] ) );
			dv2.push( sv[2] - ( S1*sv[1] ) );
			dv3.push( sv[3] - ( S2*sv[2] ) );
			dv4.push( sv[4] - ( S3*sv[3] ) );
			dv5.push( sv[5] - ( S4*sv[4] ) );
			dv6.push( sv[6] - ( S5*sv[5] ) );
			dv7.push( sv[7] - ( S6*sv[6] ) );
			dv8.push( sv[8] - ( S7*sv[7] ) );
			dv9.push( sv[9] - ( S8*sv[8] ) );
		}
	}
	// Resolve a list of pointers to the first indexed elements in the respective ndarrays:
	iv = offsets( arrays );

	// Shallow copy the list of views to an internal array so that we can update with reshaped views without impacting the original list of views:
	v = copyIndexed( views );

	// Cache a reference to the output ndarray buffer:
	ybuf = y.data;

	// Iterate over the non-reduced ndarray dimensions...
	for ( i9 = 0; i9 < S9; i9++ ) {
		for ( i8 = 0; i8 < S8; i8++ ) {
			for ( i7 = 0; i7 < S7; i7++ ) {
				for ( i6 = 0; i6 < S6; i6++ ) {
					for ( i5 = 0; i5 < S5; i5++ ) {
						for ( i4 = 0; i4 < S4; i4++ ) {
							for ( i3 = 0; i3 < S3; i3++ ) {
								for ( i2 = 0; i2 < S2; i2++ ) {
									for ( i1 = 0; i1 < S1; i1++ ) {
										for ( i0 = 0; i0 < S0; i0++ ) {
											setViewOffsets( views, iv );
											v[ 0 ] = strategy( views[ 0 ] );
											ybuf[ iv[1] ] = fcn( v, opts );
											incrementOffsets( iv, dv0 );
										}
										incrementOffsets( iv, dv1 );
									}
									incrementOffsets( iv, dv2 );
								}
								incrementOffsets( iv, dv3 );
							}
							incrementOffsets( iv, dv4 );
						}
						incrementOffsets( iv, dv5 );
					}
					incrementOffsets( iv, dv6 );
				}
				incrementOffsets( iv, dv7 );
			}
			incrementOffsets( iv, dv8 );
		}
		incrementOffsets( iv, dv9 );
	}
}


// EXPORTS //

module.exports = unary10d;
