declare global {
    export interface Function {
        serialize: any;
        deserialize: any;
        execute: any;
    }
}

Function.prototype.serialize = function (func: Function) {
    const matches = func.toString().match(/^\s*[^(]*\(([^)]*)\)\s*(?:=>)?\s*{(.*)}\s*$/);
    return [
        'window.Function',
        matches[1].trim().split(/\s*,\s*/),
        matches[2]
    ];
};
Function.prototype.deserialize = function (data: [string, string[], string], globals: string[] = []) {
    let expression = `var { ${globals.join(', ')} } = this.globals;`;
    return (data instanceof Array && data[0] == 'window.Function') ? new (Function.bind.apply(Function, [Function].concat(data[1] as any[], [(globals.length ? `eval('${expression}');\n` : '') + data[2] as any]))) : data;
};

export default module;