export interface IParserOptions {
    singularOutput?: boolean;
    resultUnescaper?: (value: string) => string;
}
