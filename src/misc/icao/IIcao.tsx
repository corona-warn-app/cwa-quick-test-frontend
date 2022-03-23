
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
    findAllDeviding: string
}
