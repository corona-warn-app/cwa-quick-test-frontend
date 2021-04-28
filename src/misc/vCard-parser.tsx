
export interface IFieldParser {
    [key: string]: any;
}
export interface IFieldPropertyMapping {
    [key: string]: string;
}

export interface Name {
    surname: string;
    name: string;
    additionalName: string;
    prefix: string;
    suffix: string;
}

export interface ValueInfo {
    [key: string]: string;
}

export interface Telephone {
    isDefault: boolean;
    valueInfo: ValueInfo;
    value: string;
}

export interface Email {
    isDefault: boolean;
    valueInfo: ValueInfo;
    value: string;
}

export interface AddressInfo {
    postOfficeBox: string;
    number: string;
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
}

export interface Address {
    isDefault: boolean;
    valueInfo: ValueInfo;
    value: AddressInfo;
}

export interface IvCard {
    name: Name;
    displayName: string;
    telephone: Telephone[];
    email: Email[];
    address: Address[];
    birthday: Date;
}

let fieldPropertyMapping: IFieldPropertyMapping = {
    "TITLE": "title",
    "TEL": "telephone",
    "FN": "displayName",
    "N": "name",
    "EMAIL": "email",
    "CATEGORIES": "categories",
    "ADR": "address",
    "URL": "url",
    "NOTE": "notes",
    "ORG": "organization",
    "BDAY": "birthday",
    "PHOTO": "photo"
};

const lookupField = (context: any, fieldName: any) => {

    let propertyName = fieldPropertyMapping[fieldName];

    if (!propertyName && fieldName !== 'BEGIN' && fieldName !== 'VERSION' && fieldName !== 'END') {
        context.info('define property name for ' + fieldName);
        propertyName = fieldName;
    }

    return propertyName;
}

const removeWeirdItemPrefix = (line: any) => {
    // sometimes lines are prefixed by "item" keyword like "item1.ADR;type=WORK:....."
    return line.substring(0, 4) === "item" ? line.match(/item\d\.(.*)/)[1] : line;
}

const singleLine = (context: any, fieldValue: any, fieldName: any) => {

    // convert escaped new lines to real new lines.
    fieldValue = fieldValue.replace('\\n', '\n');

    // append value if previously specified
    if (context.currentCard[fieldName]) {
        context.currentCard[fieldName] += '\n' + fieldValue;
    } else {
        context.currentCard[fieldName] = fieldValue;
    }

}

const typedLine = (context: any, fieldValue: any, fieldName: any, typeInfo: any, valueFormatter: any) => {

    let isDefault = false;

    // strip type info and find out is that preferred value
    if (typeInfo) {
        typeInfo = typeInfo.filter((type: any) => {
            isDefault = isDefault || type.name === 'PREF';
            return type.name !== 'PREF';
        });

        typeInfo = typeInfo.reduce((p: any, c: any) => {
            p[c.name] = c.value;
            return p;
        }, {});
    }

    context.currentCard[fieldName] = context.currentCard[fieldName] || [];

    context.currentCard[fieldName].push({
        isDefault: isDefault,
        valueInfo: typeInfo,
        value: valueFormatter ? valueFormatter(fieldValue) : fieldValue
    });

}

const commaSeparatedLine = (context: any, fieldValue: any, fieldName: any) => {
    context.currentCard[fieldName] = fieldValue.split(',');
}

const dateLine = (context: any, fieldValue: any, fieldName: any) => {

    // if value is in "19531015T231000Z" format strip time field and use date value.
    fieldValue = fieldValue.length === 16 ? fieldValue.substr(0, 8) : fieldValue;

    let dateValue;

    if (fieldValue.length === 8) { // "19960415" format ?
        dateValue = new Date(fieldValue.substr(0, 4), fieldValue.substr(4, 2), fieldValue.substr(6, 2));
    } else {
        // last chance to try as date.
        dateValue = new Date(fieldValue);
    }

    if (!dateValue || isNaN(dateValue.getDate())) {
        dateValue = null;
        context.error('invalid date format ' + fieldValue);
    }

    context.currentCard[fieldName] = dateValue && dateValue.toJSON(); // always return the ISO date format
}

const structured = (fields: any) => {

    return (context: any, fieldValue: any, fieldName: any) => {

        let values = fieldValue.split(';');

        context.currentCard[fieldName] = fields.reduce((p: any, c: any, i: any) => {
            p[c] = values[i] || '';
            return p;
        }, {});

    }

}

const addressLine = (context: any, fieldValue: string, fieldName: string, typeInfo: string) => {

    typedLine(context, fieldValue, fieldName, typeInfo, (value: any) => {

        let names = value.split(';');

        return {
            // ADR field sequence
            postOfficeBox: names[0],
            number: names[1],
            street: names[2] || '',
            city: names[3] || '',
            region: names[4] || '',
            postalCode: names[5] || '',
            country: names[6] || ''
        };

    });
}

const noop = () => {
}

const endCard = (context: any) => {
    // store card in context and create a new card.
    context.cards.push(context.currentCard);
    context.currentCard = {};
}

const fieldParsers: IFieldParser = {
    "BEGIN": noop,
    "VERSION": noop,
    "N": structured(['surname', 'name', 'additionalName', 'prefix', 'suffix']),
    "TITLE": singleLine,
    "TEL": typedLine,
    "EMAIL": typedLine,
    "ADR": addressLine,
    "NOTE": singleLine,
    "NICKNAME": commaSeparatedLine,
    "BDAY": dateLine,
    "URL": singleLine,
    "CATEGORIES": commaSeparatedLine,
    "END": endCard,
    "FN": singleLine,
    "ORG": singleLine,
    "UID": singleLine,
    "PHOTO": singleLine
};

const feedData = (context: any) => {

    for (let i = 0; i < context.data.length; i++) {

        let line = removeWeirdItemPrefix(context.data[i]);

        let pairs = line.split(':'),
            fieldName = pairs[0],
            fieldTypeInfo,
            fieldValue = pairs.slice(1).join(':');

        // is additional type info provided ?
        if (fieldName.indexOf(';') >= 0 && line.indexOf(';') < line.indexOf(':')) {
            let typeInfo = fieldName.split(';');
            fieldName = typeInfo[0];
            fieldTypeInfo = typeInfo.slice(1).map((type: any) => {
                let info = type.split('=');
                return {
                    name: info[0].toLowerCase(),
                    value: info[1] ? info[1].replace(/"(.*)"/, '$1') : ''
                }
            });
        }

        // ensure fieldType is in upper case
        fieldName = fieldName.toUpperCase();

        let fieldHandler = fieldParsers[fieldName];

        if (fieldHandler) {

            fieldHandler(context, fieldValue, lookupField(context, fieldName), fieldTypeInfo);

        } else if (fieldName.substring(0, 2) !== 'X-') {
            // ignore X- prefixed extension fields.
            context.info('unknown field ' + fieldName + ' with value ' + fieldValue)
        }

    }

}

const parse = (data: string) => {

    let lines = data
        // replace escaped new lines
        .replace(/\n\s{1}/g, '')
        // split if a character is directly after a newline
        .split(/\r\n(?=\S)|\r(?=\S)|\n(?=\S)/);

    let context = {
        info: (desc: string) => {
            console.info(desc);
        },
        error: (err: string) => {
            console.error(err);
        },
        data: lines,
        currentCard: {},
        cards: []
    };
    try {
        feedData(context);

    } catch (error) {
        console.log(error);

    }

    return context.cards as IvCard[];
}
export default parse;