/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2021, T-Systems International GmbH
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

import translitarals from './icao.json';
import React from 'react';
import ITransliteration from './ITransliteration';

// all characters have to match in 0-9 or uppercase A-Z or < or whitespace
const mrzRegExPattern = /^[0-9A-Z<\s]*$/g;
// finds all non-letter, non-number or non-< characters
const findAllNonLetterNumberRegExPattern = /(?![\p{N}<])(\P{L})/gu;
// finds all whitespaces like characters
const findAllSpacesRegExPattern = /[\s\uFEFF\xA0]+/g;
// finds all whitespaces or - or , in string
const findAllDevidingRegExPattern = /[\s,-]+/g;

// encapsulate loading tranliterations from json
const useGetTransliterations = () => {
    const [result, setResult] = React.useState<ITransliteration[]>();

    React.useEffect(() => {
        setResult([...translitarals.translitarations]);
    }, [])

    return result;
}

const useTransliterate = (onError?: (msg: string) => void) => {
    const transliterations = useGetTransliterations();
    const [result, setResult] = React.useState('');

    const normalize = (input: string): string => {
        let output = '';

        output = input
            // remove all leading and tailing whitespaces, new lines, etc.
            .trim()
            // replaces all multiple whitespaces-like characters with single whitespace
            .replace(findAllSpacesRegExPattern, ' ')
            // replace all whitespaces or , or - with < character
            .replace(findAllDevidingRegExPattern, '<')
            // removes all non-letter, non-number or non-< characters
            .replace(findAllNonLetterNumberRegExPattern, '');

        return output.toUpperCase();
    }

    const transliterate = (input: string, transliterations: ITransliteration[]) => {
        let output = '';

        for (const char of input) {
            // set default value
            let transliteratedChar = char;

            // transliterating char if necessary
            if (!mrzRegExPattern.test(char)) {
                const translitaral = transliterations.find(transliteration => transliteration.utf8 === char);

                if (translitaral) transliteratedChar = translitaral.mrz;
            }

            output += transliteratedChar;
        }

        return output;
    }

    const update = (input: string) => {
        let output = '';

        try {
            // some validation
            if (!input && input !== '') throw new Error('input string is not valid!');
            if (!transliterations) throw new Error('transliterations are not valid!');

            // normalize input string for mrz transliteration
            const normalizedInput = normalize(input);

            console.log(normalizedInput);

            // transliterate normalized input with transliterations from json
            output = transliterate(normalizedInput, transliterations);

            // in the end transliterated output should pass regEx
            if (!mrzRegExPattern.test(output)) new Error('Could not transliterate some characters: ' + output + '.');
        }
        catch (error: any) {
            if (onError) {
                onError(error.message)
            }

            console.log(error.message);
            output = '';
        }

        setResult(output);
    }

    const clear = () => {
        setResult('');
    }

    return [result, update, clear] as const;
}

export default useTransliterate;