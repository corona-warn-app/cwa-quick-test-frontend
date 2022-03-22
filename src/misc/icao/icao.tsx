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
 * 
 * Used character transliteration from 
 * https://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
 */

import translitarals from "./icao.json";
import utils from '../../misc/utils';

export interface ITransliteration {
    utf8: string;
    mrz: string;
}

const transliteration: ITransliteration[] = [...translitarals.translitarations];

const replaceSpecialChars = (name: string) : string => {
    return name.replaceAll("-", "<").replaceAll("’", "").replaceAll(",", "<").replaceAll(" ", "<");
}

const replaceNationalChars = (name: string) : string => {
    let icao:string = "";
    console.log(name.length);
    for (let i = 0; i < name.length; i++) {
        const translitaral = transliteration.find(value => value.utf8 === name[i]);
        if(translitaral) {
            icao += translitaral.mrz;  
        } else {
            icao += name[i];
        } 
        console.log(name[i]);
    }
    console.log("ICAO: " + icao);

    return icao;
}

const transliterate = (name: string) : string => {
    let result = "";

    name = replaceSpecialChars(name).toUpperCase();

    console.log(name);
    
    if (utils.isStandardisedNameValid(name)) {
        result = name;
    } else {
        result = replaceNationalChars(name);
    }

    if(!utils.isStandardisedNameValid(result)) {
        console.log("Could not transliterate some characters: " + result + ".");
        result = "";
    }

    return result;
}

export default transliterate;