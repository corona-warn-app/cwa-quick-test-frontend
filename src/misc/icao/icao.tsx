/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2022, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the 'License'); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 * 
 * Used character transliteration from 
 * https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
 */

import IIcao from './IIcao';

export const parsePattern = (strPattern: string): RegExp => {
    const split = strPattern.split('/');
    return new RegExp(split[0], split[1]);
}

export const normalize = (input: string, icao: IIcao): string => {
    const output = input
        // remove all leading and tailing whitespaces, new lines, etc.
        .trim()
        // replaces all multiple whitespaces-like characters with single whitespace
        .replaceAll(parsePattern(icao.pattern.findAllSpaces), ' ')
        // replace all whitespaces or , or - with < character
        .replaceAll(parsePattern(icao.pattern.findAllDeviding), '<')
        // removes all non-letter, non-number or non-< characters
        .replaceAll(parsePattern(icao.pattern.findAllNonLetterNonNumber), '')
        // replace all muliple < characters with <
        .replaceAll(parsePattern(icao.pattern.findAllLessThan), '<');

    return output.toUpperCase();
}

export const transliterate = (input: string, icao: IIcao) => {
    let output = '';

    for (const char of input) {
        // set default value
        let transliteratedChar = char;

        // transliterating char if necessary
        if (!parsePattern(icao.pattern.mrz).test(char)) {
            const translitaral = icao.transliterations.find(transliteration => transliteration.utf8 === char);

            if (translitaral) transliteratedChar = translitaral.mrz;
        }

        output += transliteratedChar;
    }

    return output;
}