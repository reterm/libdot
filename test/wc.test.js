// Copyright (c) 2014 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import test from 'ava'
import wc from 'wc'

test('strWidth-test', t => {
  var asciiOnechar = 'a';
  var asciiString = 'an ascii string';
  var widecharOnechar = '\u4E2D';
  var widecharString = '\u4E2D\u6587\u5B57\u4E32';
  var ambiguousOnechar = '\u2026'; // Horizontal ellipsis
  var mixedString = '\u4E2D\u6587 English';
  var nullChar = '\u0000';
  var controlChar = '\r';
  var musicalSign = '\uD834\uDD00';
  var wideSurrogatePair = '\uD842\uDD9D';

  t.is(1, wc.strWidth(asciiOnechar), 'ASCII char has wcwidth 1');
  t.is(15, wc.strWidth(asciiString), 'ASCII string');
  t.is(2, wc.strWidth(widecharOnechar),
                  'Chinese char has width 2');
  t.is(8, wc.strWidth(widecharString), 'Widechar string');
  t.is(1, wc.strWidth(ambiguousOnechar),
                  'East Asian Ambiguous character has width 1');
  t.is(12, wc.strWidth(mixedString), 'Mixed string');
  t.is(0, wc.strWidth(nullChar), 'Null char has wcwdith 0');
  t.is(0, wc.strWidth(controlChar),
                  'Control char has width 0');
  t.is(1, wc.strWidth(musicalSign),
                  'A surrogate pair is considered as a single character.');
  t.is(2, wc.strWidth(wideSurrogatePair),
                  'A wide character represented in a surrogate pair.');
});

test('charWidthRegardAmbiguous-test', t => {
  var asciiChar = 'a';
  var wideChar = '\u4E2D';
  var ambiguousChar = '\u2026'; // Horizontal ellipsis
  var nullChar = '\u0000';
  var controlChar = '\r';

  t.is(1, wc.charWidthRegardAmbiguous(asciiChar.charCodeAt(0)),
                  'ASCII char has width 1');
  t.is(2, wc.charWidthRegardAmbiguous(wideChar.charCodeAt(0)),
                  'Chinese char has width 2');
  t.is(2, wc.charWidthRegardAmbiguous(ambiguousChar.charCodeAt(0)),
                  'East Asian Ambiguous character has width 2');
  t.is(0, wc.charWidthRegardAmbiguous(nullChar.charCodeAt(0)),
                  'Null char has wcwdith 0');
  t.is(0, wc.charWidthRegardAmbiguous(controlChar.charCodeAt(0)),
                  'Control char has width 0');
});

test('substr-test', t => {
  var asciiOnechar = '1';
  var asciiString = '1234567890';
  var widecharOnechar = '\u4E2D';
  var widecharString = '\u4E2D\u6587\u5B57\u4E32\u4E2D\u6587\u5B57\u4E32';
  var mixedString = '12345\u4E2D\u6587\u5B57\u4E3267890';

  t.is('1', wc.substr(asciiOnechar, 0, 1));
  t.is('1', wc.substr(asciiOnechar, 0, 2));
  t.is('1', wc.substr(asciiOnechar, 0));
  t.is('', wc.substr(asciiOnechar, 0, 0));
  t.is('', wc.substr(asciiOnechar, 1));

  t.is('1234', wc.substr(asciiString, 0, 4));
  t.is('1234567890', wc.substr(asciiString, 0, 15));
  t.is('5678', wc.substr(asciiString, 4, 4));
  t.is('567890', wc.substr(asciiString, 4, 10));
  t.is('67890', wc.substr(asciiString, 5));
  t.is('', wc.substr(asciiString, 0, 0));
  t.is('', wc.substr(asciiString, 11));

  t.is('\u4E2D', wc.substr(widecharOnechar, 0, 2));
  t.is('\u4E2D', wc.substr(widecharOnechar, 0, 3));
  t.is('\u4E2D', wc.substr(widecharOnechar, 0));
  t.is('\u4E2D', wc.substr(widecharOnechar, 1));
  t.is('', wc.substr(widecharOnechar, 0, 0));
  t.is('', wc.substr(widecharOnechar, 0, 1));
  t.is('', wc.substr(widecharOnechar, 2));

  t.is('\u4E2D\u6587', wc.substr(widecharString, 0, 4));
  t.is('\u4E2D\u6587', wc.substr(widecharString, 0, 5));
  t.is('\u4E2D\u6587\u5B57\u4E32\u4E2D\u6587\u5B57\u4E32',
                  wc.substr(widecharString, 0, 20));
  t.is('\u5B57\u4E32', wc.substr(widecharString, 4, 4));
  t.is('\u5B57\u4E32\u4E2D\u6587\u5B57\u4E32',
                  wc.substr(widecharString, 4, 20));
  t.is('\u5B57\u4E32\u4E2D\u6587\u5B57\u4E32',
                  wc.substr(widecharString, 5));
  t.is('', wc.substr(widecharString, 0, 0));
  t.is('', wc.substr(widecharString, 17));

  t.is('12345\u4E2D', wc.substr(mixedString, 0, 7));
  t.is(mixedString, wc.substr(mixedString, 0));
  t.is(mixedString, wc.substr(mixedString, 0, 20));
});

test('substring-test', t => {
  var asciiString = '1234567890';
  var widecharString = '\u4E2D\u6587\u5B57\u4E32\u4E2D\u6587\u5B57\u4E32';
  var mixedString = '12345\u4E2D\u6587\u5B57\u4E3267890';

  t.is('\u6587\u5B57', wc.substring(widecharString, 2, 6));
  t.is('\u6587\u5B57', wc.substring(widecharString, 3, 7));
  t.is('\u4E2D\u6587\u5B57\u4E3267',
                  wc.substring(mixedString, 5, 15));
  t.is(asciiString.substring(2, 5),
                  wc.substring(asciiString, 2, 5));
  t.is(asciiString.substring(0, 0),
                  wc.substring(asciiString, 0, 0));
  t.is(asciiString.substring(2, 15),
                  wc.substring(asciiString, 2, 15));
});
