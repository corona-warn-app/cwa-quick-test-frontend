/*
 * Corona-Warn-App / cwa-quick-test-frontend
 *
 * (C) 2021, T-Systems International GmbH
 *
 * Deutsche Telekom AG and all other contributors /
 * copyright owners license this file to you under the Apache
 * License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export interface IUtils {
    shortHashLen: number,
    pattern: { [key: string]: string },
    shortHash: (value: string) => string,
    isProcessNoValid: (value: string) => boolean,
    isZipValid: (value: string) => boolean,
    isTelValid: (value: string) => boolean,
    isEMailValid: (value: string) => boolean,
    isStandardisedNameValid: (value: string) => boolean,
    convertToICAO: (value: string) => string, 
    isUrlValid: (value: string) => boolean,
    isOpeningHoursValid: (value: string) => boolean,
    getIndent: (level: number) => JSX.Element[],
    pickerDateFormat: string,
    pickerDateTimeFormat: string,
    momentDateFormat: string,
    momentDateTimeFormat: string
}

const shortHashLen = 8;

const pattern = {
    processNo: '^[A-Fa-f0-9]{' + shortHashLen + '}$',
    zip: '^([0]{1}[1-9]{1}|[1-9]{1}[0-9]{1})[0-9]{3}$',
    houseNo: '^([1-9]{1}[0-9a-zA-Z-\\s/]{0,14})$',
    tel: '^([+]{1}[1-9]{1,2}|[0]{1}[1-9]{1})[0-9]{5,}$',
    eMail: '^[\\w\\d\\.!#$%&’*+/=?^_`{|}~-]{1,}[@]{1}[\\w\\d\\.-]{1,}[\\.]{1}[\\w]{2,}$',
    standardisedName: '^[A-Z<]*$',
    url: '^(www\\.|http:\\/\\/|https:\\/\\/){0,1}?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,10}(:[0-9]{1,5})?(\\/.*)?$',
    BSNR:'^[1-9]{1}\\d{8}$',
    //openingHours:'^[\\w-\\d\\s]{0,64}$/gm'
    openingHours:'^(.|\n){0,64}$'
}

const processNoRegExp = new RegExp(pattern.processNo);
const zipRegExp = new RegExp(pattern.zip);
const telRegExp = new RegExp(pattern.tel);
const eMailRegExp = new RegExp(pattern.eMail);
const standardisedNameRegExp = new RegExp(pattern.standardisedName);
const urlRegExp = new RegExp(pattern.url);
const openingHoursExp = new RegExp(pattern.openingHours);

const getIndent = (level: number): JSX.Element[] => {
    const indent: JSX.Element[] = [];

    for (let index = 0; index < level; index++) {
        indent.push(<span key={index} className='intend' />);
    }

    return indent;
}

const convertToICAO = (input: string): string => {
    // implementation as defined by reference pseudo code:
    // https://github.com/corona-warn-app/cwa-quicktest-onboarding/wiki/Anbindung-an-CWA-mit-Verwendung-von-DCCs#icao-conversion
    var result = '';

    // 0. First name and last name are handled separately (the following steps are done for first name and last name individually)
    // 
    // call this method only with the name part!

    // 1. Make sure that the name is in String. Latin format (Latin chars in Unicode) via Regex ^[\u0020-\u0233\u1E02-\u1EF9]+$ (cf. [2], p. 5ff.) -- the charset is actually smaller, but step 7 takes care of that
    result = input.replace(/[^\u0020-\u0233\u1E02-\u1EF9]/g, '');

    // 2. Convert the string to UPPERCASE (cf. [1], p. 18)
    result = result.toUpperCase();

    // 3. Replace commas (\u002C), spaces (\u0020), and hyphens (\u002D = -) by '<' (cf. [1], p. 19f.)
    result = result.replace(/[\u002C\u0020\u002D]/g, '<');
    // 4. Replace multiple occurrences of '<' by a single '<' (e.g., 'HANS<<PETER' --> 'HANS<PETER') (cf. [1], p. 18)
    result = result.replace(/<{1,}/g, '<');
    // 5. Replace diacritical characters: (cf. [1], p. 30ff.; [2], p. 5ff.)
    //      \u00C0-\u00C3, \u0100-\u0104, \u01CD, \u01DE, \u01FA, \u1EA0-\u1EB6 --> A
    result = result.replace(/[\u00C0-\u00C3\u0100-\u0104\u01CD\u01DE\u01FA\u1EA0-\u1EB6]/g, 'A');
    //      \u00C4, \u00C6, \u01FC     --> AE
    result = result.replace(/[\u00C4\u00C6\u01FC]/g, 'AE');
    //      \u00C5                     --> AA
    result = result.replace(/[\u00C5]/g, 'AA');
    //      \u1E02                     --> B
    result = result.replace(/[\u1E02]/g, 'B');
    //      \u00C7, \u0106-\u010C      --> C
    result = result.replace(/[\u00C7\u0106-\u010C]/g, 'B');
    //      \u00D0, \u010E, \u0110, \u1E0A, \u1E10 --> D
    result = result.replace(/[\u00D0\u010E\u0110\u1E0A\u1E10]/g, 'D');
    //      \u00C8-\u00CB, \u0112-\u011A, \u018F, \u1EB8-\u1EC6 --> E 
    result = result.replace(/[\u00C8-\u00CB\u0112-\u011A\u018F\u1EB8-\u1EC6]/g, 'E');  
    //      \u1E1E                    --> F
    result = result.replace(/[\u1E1E]/g, 'F');
    //      \u011C-\u0122, \u01E4, \u01E6, \u01F4, \u1E20 --> G
    result = result.replace(/[\u011C-\u0122\u01E4\u01E6\u01F4\u1E20]/g, 'G');
    //      \u0124, \u0126, \u021E, \u1E24, \u1E26 --> H
    result = result.replace(/[\u0124\u0126\u021E\u1E24\u1E26]/g, 'H');
    //      \u00CC-\u00CF, \u0128-\u0131, \u01CF, \u1EC8, \u1ECA --> I
    result = result.replace(/[\u00CC-\u00CF\u0128-\u0131\u01CF\u1EC8\u1ECA]/g, 'I');
    //      \u0134                     --> J
    result = result.replace(/[\u0134]/g, 'J');
    //      \u0132                    --> IJ
    result = result.replace(/[\u0132]/g, 'IJ');
    //      \u0136, \u01E8, \u1E30     --> K
    result = result.replace(/[\u0136\u01E8\u1E30]/g, 'K');
    //      \u0139-\u0141              --> L
    result = result.replace(/[\u0139-\u0141]/g, 'L');
    //      \u1E40                     --> M
    result = result.replace(/[\u1E40]/g, 'M');
    //      \u00D1, \u0143-\u014A, \u1E44 --> N
    result = result.replace(/[\u00D1\u0143-\u014A\u1E44]/g, 'N');
    //      \u00D2-\u00D5, \u014C-\u0150, \u01A0, \u01D1, \u01EA, \u01EC, \u022A-\u0230, \u1ECC-\u1EDC --> O
    result = result.replace(/[\u00D2-\u00D5\u014C-\u0150\u01A0\u01D1\u01EA\u01EC\u022A-\u0230\u1ECC-\u1EDC]/g, 'O');
    //      \u00D6, \u00D8, \u0152, \u01FE --> OE
    result = result.replace(/[\u00D6\u00D8\u0152\u01FE]/g, 'OE');
    //      \u1E56                     --> P
    result = result.replace(/[\u1E56]/g, 'P');
    //      \u0154-\u0158              --> R
    result = result.replace(/[\u0154-\u0158]/g, 'R');
    //      \u015A-\u0160, \u0218, \u1E60, \u1E62 --> S
    result = result.replace(/[\u015A-\u0160\u0218\u1E60\u1E62]/g, 'S');
    //      \u00DF, \u1E9E        --> SS
    result = result.replace(/[\u00DF\u1E9E]/g, 'SS');
    //      \u0162-\u0166, \u021A, \u1E6A --> T
    result = result.replace(/[\u0162-\u0166\u021A\u1E6A]/g, 'T');
    //      \u00DE                     --> TH
    result = result.replace(/[\u00DE]/g, 'TH');
    //      \u00D9-\u00DB, \u0168-\u0172, \u01AF, \u01D3, \u1EE4-\u1EF0 --> U
    result = result.replace(/[\u00D9-\u00DB\u0168-\u0172\u01AF\u01D3\u1EE4-\u1EF0]/g, 'U');
    //      \u00DC                     --> UE
    result = result.replace(/[\u00DC]/g, 'UE');
    //      \u0174, \u1E80-\u1E84      --> W
    result = result.replace(/[\u0174\u1E80-\u1E84]/g, 'W');
    //      \u1E8C                     --> X
    result = result.replace(/[\u1E8C]/g, 'X');
    //      \u00DD, \u0176, \u0178, \u0232, \u1E8E, \u1EF2-\u1EF8 --> Y
    result = result.replace(/[\u00DD\u0176\u0178\u0232\u1E8E\u1EF2-\u1EF8]/g, 'Y');
    //      \u0179-\u017D, \u01B7, \u01EE, \u1E90, \u1E92 --> Z
    result = result.replace(/[\u0179-\u017D\u01B7\u01EE\u1E90\u1E92]/g, 'Z');

    // Transliteration of Cyrillic Characters
    // \u0410 -> A
    result = result.replace(/[\u0410]/g, 'A');
    // \u0411 -> B
    result = result.replace(/[\u0411]/g, 'B');
    // \u0401 -> E 
    result = result.replace(/[\u0401]/g, 'E');
    // \u0402 -> D
    result = result.replace(/[\u0402]/g, 'D');
    // \u0404 -> IE
    result = result.replace(/[\u0404]/g, 'IE');
    // \u0405 -> DZ
    result = result.replace(/[\u0405]/g, 'DZ');
    // \u0406,\u0407 -> I
    result = result.replace(/[\u0406\u0407]/g, 'I');
    // \u0408 -> J
    result = result.replace(/[\u0408]/g, 'J');
    // \u0409 -> LJ
    result = result.replace(/[\u0409]/g, 'LJ');
    // \u040A -> NJ
    result = result.replace(/[\u040A]/g, 'NJ');
    // \u040C -> K
    result = result.replace(/[\u040C]/g, 'K');
    // \u040E -> U
    result = result.replace(/[\u040E]/g, 'U');
    // \u040F -> DZ 
    result = result.replace(/[\u040F]/g, 'DZ');
    // \u0412 -> V
    result = result.replace(/[\u0412]/g, 'V');
    // \u0413 -> G
    result = result.replace(/[\u0413]/g, 'G');
    // \u0414 -> D
    result = result.replace(/[\u0414]/g, 'D');
    // \u0415 -> E
    result = result.replace(/[\u0415]/g, 'E');
    // \u0416 -> ZH
    result = result.replace(/[\u0416]/g, 'ZH');
    // \u0417 -> Z
    result = result.replace(/[\u0417]/g, 'Z');
    // \u0418,\u0419 -> I
    result = result.replace(/[\u0418\u0419]/g, 'I');
    // \u041A -> K
    result = result.replace(/[\u041A]/g, 'K');
    // \u041B -> L
    result = result.replace(/[\u041B]/g, 'L');
    // \u041C -> M
    result = result.replace(/[\u041C]/g, ';');
    // \u041D -> N
    result = result.replace(/[\u041D]/g, 'N');
    // \u041E -> O
    result = result.replace(/[\u041E]/g, 'O');
    // \u041F -> P
    result = result.replace(/[\u041F]/g, 'P');
    // \u0420 -> R
    result = result.replace(/[\u0420]/g, 'R');
    // \u0421 -> S
    result = result.replace(/[\u0421]/g, 'S');
    // \u0422 -> T
    result = result.replace(/[\u0422]/g, 'T');
    // \u0423 -> U
    result = result.replace(/[\u0423]/g, 'U');
    // \u0424 -> F
    result = result.replace(/[\u0424]/g, 'F');
    // \u0425 -> KH 
    result = result.replace(/[\u0425]/g, 'KH');
    // \u0426 -> TS 
    result = result.replace(/[\u0426]/g, 'TS');
    // \u0427 -> CH 
    result = result.replace(/[\u0427]/g, 'CH');
    // \u0428 -> SH
    result = result.replace(/[\u0428]/g, 'SH');
    // \u0429 -> SHCH
    result = result.replace(/[\u0429]/g, 'SHCH');
    // \u042A -> IE
    result = result.replace(/[\u042A]/g, 'IE');
    // \u042B -> Y
    result = result.replace(/[\u042B]/g, 'Y');
    // \u042D -> E
    result = result.replace(/[\u042D]/g, 'E');
    // \u042E -> IU 
    result = result.replace(/[\u042E]/g, 'IU');
    // \u042F -> IA
    result = result.replace(/[\u042F]/g, 'IA');
    // \u046A -> U
    result = result.replace(/[\u046A]/g, 'U');
    // \u0474 -> Y
    result = result.replace(/[\u0474]/g, 'Y');
    // \u0490,\u0492 -> G
    result = result.replace(/[\u0490\u0492]/g, 'F');

    // Transliteration of Arabic Script
    //
    // \u0651 this is a special case, double the unicode before
    //  AّBC (A\u0651BC) -> AABC
    result = result.replace(/(.{1})\u0651/, "$1$1")

    // \u0640,\u064B-\u064F,\u0650,\u0652,\u0670,\u069C,\u06A2,\u06A7,\u06A8 -> (Not encoded)
    result = result.replace(/\u0640\u064B-\u064F\u0650\u0652\u0670\u069C\u06A2\u06A7\u06A8/,'')
    // \u0621 -> XE
    result = result.replace(/\u0621/,'XE')
    // \u0622 -> XAA
    result = result.replace(/\u0622/,'XAA')
    // \u0623 -> XAE
    result = result.replace(/\u0623/,'XAE')
    // \u0624 -> U
    result = result.replace(/\u0624/,'U')
    // \u0625 -> I
    result = result.replace(/\u0625/,'I')
    // \u0626 -> XI
    result = result.replace(/\u0626/,'XI')
    // \u0627 -> A
    result = result.replace(/\u0627/,'A')
    // \u0628 -> B
    result = result.replace(/\u0628/,'B')
    // \u0629 -> XTA
    result = result.replace(/\u0629/,'XTA')
    // \u062A -> T
    result = result.replace(/\u062A/,'T')
    // \u062B -> XTH
    result = result.replace(/\u062B/,'XTH')
    // \u062C -> J
    result = result.replace(/\u062C/,'J')
    // \u062D -> XH
    result = result.replace(/\u062D/,'XH')
    // \u062E -> XKH
    result = result.replace(/\u062E/,'XKH')
    // \u062F -> D
    result = result.replace(/\u062F/,'D')
    // \u0630 -> XDH
    result = result.replace(/\u0630/,'XDH')
    // \u0631 -> R
    result = result.replace(/\u0631/,'R')
    // \u0632 -> Z
    result = result.replace(/\u0632/,'Z')
    // \u0633 -> S
    result = result.replace(/\u0633/,'S')
    // \u0634 -> XSH
    result = result.replace(/\u0634/,'XSH')
    // \u0635 -> XSS
    result = result.replace(/\u0635/,'XSS')
    // \u0636 -> XDZ
    result = result.replace(/\u0636/,'XDZ')
    // \u0637 -> XTT
    result = result.replace(/\u0637/,'XTT')
    // \u0638 -> XZZ
    result = result.replace(/\u0638/,'XZZ')
    // \u0639 -> E
    result = result.replace(/\u0639/,'E')
    // \u063A -> G
    result = result.replace(/\u063A/,'G')
    // \u0641 -> F
    result = result.replace(/\u0641/,'F')
    // \u0642 -> Q
    result = result.replace(/\u0642/,'Q')
    // \u0643 -> K
    result = result.replace(/\u0643/,'K')
    // \u0644 -> L
    result = result.replace(/\u0644/,'L')
    // \u0645 -> M
    result = result.replace(/\u0645/,'M')
    // \u0646 -> N
    result = result.replace(/\u0646/,'N')
    // \u0647 -> H
    result = result.replace(/\u0647/,'H')
    // \u0648 -> W
    result = result.replace(/\u0648/,'W')
    // \u0649 -> XAY
    result = result.replace(/\u0649/,'XAY')
    // \u064A -> Y
    result = result.replace(/\u064A/,'Y')
    // \u0671 -> XXA
    result = result.replace(/\u0671/,'XXA')
    // \u0679 -> XXT
    result = result.replace(/\u0679/,'XXT')
    // \u067C -> XRT
    result = result.replace(/\u067C/,'XRT')
    // \u067E -> P
    result = result.replace(/\u067E/,'P')
    // \u0681 -> XKE
    result = result.replace(/\u0681/,'XKE')
    // \u0685 -> XXH
    result = result.replace(/\u0685/,'XXH')
    // \u0686 -> XC
    result = result.replace(/\u0686/,'XC')
    // \u0688 -> XXD
    result = result.replace(/\u0688/,'XXD')
    // \u0689 -> XDR
    result = result.replace(/\u0689/,'XDR')
    // \u0691 -> XXR
    result = result.replace(/\u0691/,'XXR')
    // \u0693 -> XRR
    result = result.replace(/\u0693/,'XRR')
    // \u0696 -> XRX
    result = result.replace(/\u0696/,'XRX')
    // \u0698 -> XJ
    result = result.replace(/\u0698/,'XJ')
    // \u069A -> XXS
    result = result.replace(/\u069A/,'XXS')
    // \u06A9 -> XKK
    result = result.replace(/\u06A9/,'XKK')
    // \u06AB -> XXK
    result = result.replace(/\u06AB/,'XXK')
    // \u06AD -> XNG
    result = result.replace(/\u06AD/,'XNG')
    // \u06AF -> XGG
    result = result.replace(/\u06AF/,'XGG')
    // \u06BA -> XNN
    result = result.replace(/\u06BA/,'XNN')
    // \u06BC -> XXN
    result = result.replace(/\u06BC/,'XXN')
    // \u06BE -> XDO
    result = result.replace(/\u06BE/,'XDO')
    // \u06C0 -> XYH
    result = result.replace(/\u06C0/,'XYH')
    // \u06C1 -> XXG
    result = result.replace(/\u06C1/,'XXG')
    // \u06C2 -> XGE
    result = result.replace(/\u06C2/,'XGE')
    // \u06C3 -> XTG
    result = result.replace(/\u06C3/,'XTG')
    // \u06CC -> XYA
    result = result.replace(/\u06CC/,'XYA')
    // \u06CD -> XXY
    result = result.replace(/\u06CD/,'XXY')
    // \u06D0 -> Y
    result = result.replace(/\u06D0/,'Y')
    // \u06D2 -> XYB
    result = result.replace(/\u06D2/,'XYB')
    // \u06D3 -> XBE
    result = result.replace(/\u06D3/,'XBE')

    // 6. Replace arabic numerals 1-9 with roman numerals I-IV if present. Arabic zero is not valid input.
    result = result.replace(/[1]/g, 'I');
    result = result.replace(/[2]/g, 'II');
    result = result.replace(/[3]/g, 'III');
    result = result.replace(/[4]/g, 'IV');
    result = result.replace(/[5]/g, 'V');
    result = result.replace(/[6]/g, 'VI');
    result = result.replace(/[7]/g, 'VII');
    result = result.replace(/[8]/g, 'VIII');
    result = result.replace(/[9]/g, 'IX');

    // 7. Remove all remaining characters that are not A-Z or '<' (cf. [1], p. 20)
    result = result.replace(/[^A-Z<]/g, '<');

    return result
}

const utils: IUtils = {
    shortHashLen: shortHashLen,
    pattern: pattern,
    shortHash: (uuIdHash: string) => uuIdHash.substring(0, shortHashLen),
    isProcessNoValid: (processNo: string) => processNoRegExp.test(processNo),
    isZipValid: (zip: string) => zipRegExp.test(zip),
    isTelValid: (tel: string) => telRegExp.test(tel),
    isEMailValid: (eMail: string) => eMailRegExp.test(eMail),
    isStandardisedNameValid: (value: string) => standardisedNameRegExp.test(value),
    convertToICAO: convertToICAO,
    isUrlValid: (url: string) => urlRegExp.test(url),
    isOpeningHoursValid: (value: string) => openingHoursExp.test(value),
    getIndent: getIndent,
    pickerDateFormat: 'dd.MM.yyyy',
    pickerDateTimeFormat: 'yyyy-MM-dd / hh:mm a',
    momentDateFormat: 'DD.MM.yyyy',
    momentDateTimeFormat: 'yyyy-MM-DD / hh:mm A'
}

export default utils;