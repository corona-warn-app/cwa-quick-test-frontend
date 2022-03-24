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

export default interface IIcao {
    pattern: IIcaoPattern,
    transliterations: IIcaoTransliteration[]
}

interface IIcaoTransliteration {
    utf8: string;
    mrz: string;
}

interface IIcaoPattern {
    mrz: string,
    findAllNonLetterNonNumber: string,
    findAllSpaces: string,
    findAllDeviding: string,
    findAllLessThan: string
}
