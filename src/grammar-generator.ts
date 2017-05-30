export type Blocks = { [block: string]: string };

export function generateJSONGrammar(blocks: Blocks) {
    return JSON.stringify(generateGrammar(blocks), null, 4);
}

export function generateGrammar(blocks: Blocks) {
    return {
        name: "Vue Custom Blocks",
        scopeName: "source.vue.custom-blocks",
        fileTypes: [],
        injectionSelector: "source.vue",

        patterns: [
            ...Object.keys(blocks).map(block => generateBlockPattern(block, blocks[block])),
            generateBlockPattern(),
        ],

        repository: {
            "tag-stuff": {
                patterns: [
                    { include: "#tag-generic-attribute" },
                    { include: "#string-double-quoted" },
                    { include: "#string-single-quoted" },
                ],
            },
            "tag-generic-attribute": {
                patterns: [ {
                    name: "entity.other.attribute-name.html",
                    match: "\\b([a-zA-Z\\-:]+)"
                } ],
            },
            "string-single-quoted": {
                patterns: [ {
                    name: "string.quoted.single.html",
                    begin: "'",
                    beginCaptures: {
                        0: { name: "punctuation.definition.string.begin.html" },
                    },
                    end: "'",
                    endCaptures: {
                        0: { name: "punctuation.definition.string.end.html" },
                    },
                } ],
            },
            "string-double-quoted": {
                patterns: [ {
                    name: "string.quoted.souble.html",
                    begin: "\"",
                    beginCaptures: {
                        0: { name: "punctuation.definition.string.begin.html" },
                    },
                    end: "\"",
                    endCaptures: {
                        0: { name: "punctuation.definition.string.end.html" },
                    },
                } ],
            },
        },
    };
}

function generateBlockPattern(block = "[a-zA-Z\\-]+", language?: string) {
    return {
        begin: `(<)(${block})`,
        beginCaptures: {
            1: { name: "punctuation.definition.tag.begin.html" },
            2: { name: "entity.name.tag.style.html" },
        },
        end: "(</)(\\2)(>)",
        endCaptures: {
            1: { name: "punctuation.definition.tag.begin.html" },
            2: { name: "entity.name.tag.style.html" },
            3: { name: "punctuation.definition.tag.end.html" },
        },

        patterns: [
            { include: "#tag-stuff" },
            language ? {
                contentName: language,
                begin: "(>)",
                beginCaptures: {
                    1: { name: "punctuation.definition.tag.end.html" },
                },
                end: `(?=</${block}>)`,
                patterns: [
                    { include: language },
                ],
            } : {
                match: ">",
                captures: {
                    0: { name: "punctuation.definition.tag.end.html" },
                },
            },
        ],
    };
}
