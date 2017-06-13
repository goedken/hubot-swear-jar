module.exports = {
    "env" : {
        "es6"     : true
    },
    "extends" : [
        "google"
    ],
    "rules" : {
        "camelcase" : "off",
        "guard-for-in" : "off",
        "indent": [
            "error", 4, {
                "SwitchCase"          : 1,
                "outerIIFEBody"       : 0,
                "MemberExpression"    : 1,
                "FunctionDeclaration" : {
                    "body"      : 1,
                    "parameters": 2
                },
                "FunctionExpression" : {
                    "body"      : 1,
                    "parameters": 2
                },
            }
        ],
        "key-spacing" : [
            "error", {
                "beforeColon" : true,
                "afterColon"  : true,
                "align"       : "colon"
            }
        ],
        "max-len" : [
            "warn", {
                "code"                   : 120,
                "ignoreTrailingComments" : true,
                "ignoreUrls"             : true,
                "tabWidth"               : 4
            }
        ],
        "new-cap" : "off",
        "no-multi-spaces" : [
            "error", {
                "exceptions" : {
                    "VariableDeclarator" : true
                }
            }
        ],
        "object-curly-spacing" : [
            "error", "always"
        ],
        "padded-blocks" : "off",
        "require-jsdoc" : "off",
        "space-before-function-paren" : [
            "error", {
                "anonymous" : "always",
                "named"     : "never"
            }
        ],
        "spaced-comment": [
            "error", "always", {
                "exceptions": ["-", "+"]
            }
        ],
        "valid-jsdoc" : "off"
    }
};