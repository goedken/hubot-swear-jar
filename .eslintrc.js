module.exports = {
    "env" : {
        "es6"     : true,
        "jquery"  : true,
        "mocha"   : true,
        "node"    : true
    },
    "extends" : [
        "google"
    ],
    "rules" : {
        "camelcase" : "off",
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
        "new-cap" : [
            "error", {
                "capIsNew" : false
            }
        ],
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
        "space-before-function-paren" : [
            "error", {
                "anonymous" : "always",
                "named"     : "never"
            }
        ],
        "valid-jsdoc" : [
            "warn", {
                "requireReturn"     : false,
                "requireReturnType" : false
            }
        ]
    }
};