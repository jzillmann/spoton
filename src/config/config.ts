export interface Config {
    inputs: Input[];
    pages: Page[];
}

export interface Input {
    name: string;
    type: string;
    filter?: string;
    expects: string;
    variables: Variable[];
    // auto: boolean;
}

export interface Variable {
    key: string;
    expression: string;
}

export interface Page {
    name: string;
    sections: Section[];
    // intro?: string;
}

export interface Section {
    name: string;
    style?: string;
    elements: Element[];
}

export interface Element {
    name: string;
    type: string;
    value: string;
}
