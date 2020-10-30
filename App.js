{
    "extends": [
        "eslint:recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "env": {
        "es6": true,
        "es2020": true,
        "node": true
    },
    "rules": {
        "brace-style": [
            "error",
            "1tbs",
            {
                "allowSingleLine": true
            }
        ],
        "no-undef": "error",
        "curly": "error",
        "dot-notation": "error",
        "eqeqeq": "error",
        "id-length": [
            "error",
            {
                "min": 4,
                "max": 50,
                "exceptions": [
                    "aud",
                    "iss",
                    "sub",
                    "jti",
                    "nbf",
                    "all",
                    "ajv",
                    "as",
                    "by",
                    "evt",
                    "faq",
                    "fs",
                    "id",
                    "in",
                    "on",
                    "_id",
                    "app",
                    "App",
                    "env",
                    "get",
                    "GET",
                    "JWT",
                    "key",
                    "log",
                    "max",
                    "min",
                    "put",
                    "PUT",
                    "set",
                    "tag",
                    "uri",
                    "url",
                    "use",
                    "exp",
                    "x5t",
                    "res",
                    "db",
                    "req"

                ]
            }
        ],
        "no-cond-assign": [
            "error",
            "always"
        ],
        "max-statements-per-line": [
            "error",
            {
                "max": 1
            }
        ],
        "no-console": "error",
        "no-constant-condition": "error",
        "no-debugger": "error",
        "no-empty-function": "error",
        "no-restricted-properties": [
            "error",
            {
                "object": "arguments",
                "property": "callee",
                "message": "arguments.callee is deprecated"
            },
            {
                "object": "global",
                "property": "isFinite",
                "message": "Please use Number.isFinite instead"
            },
            {
                "object": "self",
                "property": "isFinite",
                "message": "Please use Number.isFinite instead"
            },
            {
                "object": "window",
                "property": "isFinite",
                "message": "Please use Number.isFinite instead"
            },
            {
                "object": "global",
                "property": "isNaN",
                "message": "Please use Number.isNaN instead"
            },
            {
                "object": "self",
                "property": "isNaN",
                "message": "Please use Number.isNaN instead"
            },
            {
                "object": "window",
                "property": "isNaN",
                "message": "Please use Number.isNaN instead"
            },
            {
                "property": "__defineGetter__",
                "message": "Please use Object.define Property instead."
            },
            {
                "property": "__defineSetter__",
                "message": "Please use Object.define Property instead."
            },
            {
                "object": "Math",
                "property": "pow",
                "message": "Use the exponentiation operator (**) instead."
            }
        ],
        "no-restricted-syntax": [
            "warn",
            {
                "selector": "ForInStatement",
                "message": "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
            },
            {
                "selector": "ForOfStatement",
                "message": "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations."
            },
            {
                "selector": "LabeledStatement",
                "message": "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
            },
            {
                "selector": "WithStatement",
                "message": "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
            }
        ],
        "no-extra-bind": "error",
        "no-implicit-globals": "error",
        "no-loop-func": "error",
        "no-magic-numbers": [
            "warn",
            {
                "ignore": [
                    0,
                    -1
                ]
            }
        ],
        "no-multi-spaces": "error",
        "no-var": "error",
        "no-self-compare": "error",
        "no-useless-return": "error",
        "no-trailing-spaces": "error",
        "no-unused-vars": "error",
        "no-alert": "error",
        "no-lone-blocks": "error",
        "no-extra-semi": "error",
        "no-unreachable": "error",
        "no-multiple-empty-lines": [
            "error",
            {
                "max": 1,
                "maxBOF": 0,
                "maxEOF": 1
            }
        ],
        "prefer-const": "error",
        "prefer-template": "error",
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "sort-imports": [
            "warn",
            {
                "ignoreCase": true,
                "ignoreMemberSort": false,
                "memberSyntaxSortOrder": [
                    "none",
                    "single",
                    "all",
                    "multiple"
                ]
            }
        ],
        "eol-last": [
            "error",
            "always"
        ],
        "no-useless-escape": "error",
        "sort-vars": "off",
        "max-len": [
            "error",
            120,
            2,
            {
                "ignoreUrls": true,
                "ignoreComments": true,
                "ignoreRegExpLiterals": true,
                "ignoreStrings": true,
                "ignoreTemplateLiterals": true
            }
        ],
        "space-before-blocks": "error",
        "keyword-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "space-infix-ops": "error",
        "newline-per-chained-call": [
            "error",
            {
                "ignoreChainWithDepth": 4
            }
        ],
        "no-whitespace-before-property": "error",
        "space-in-parens": [
            "error",
            "never"
        ],
        "array-bracket-spacing": [
            "error",
            "never"
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "block-spacing": [
            "error",
            "always"
        ],
        "comma-spacing": [
            "error",
            {
                "before": false,
                "after": true
            }
        ],
        "computed-property-spacing": [
            "error",
            "never"
        ],
        "func-call-spacing": [
            "error",
            "never"
        ],
        "key-spacing": [
            "error",
            {
                "beforeColon": false,
                "afterColon": true
            }
        ],
        "comma-style": [
            "error",
            "last",
            {
                "exceptions": {
                    "ArrayExpression": false,
                    "ArrayPattern": false,
                    "ArrowFunctionExpression": false,
                    "CallExpression": false,
                    "FunctionDeclaration": false,
                    "FunctionExpression": false,
                    "ImportDeclaration": false,
                    "ObjectExpression": false,
                    "ObjectPattern": false,
                    "VariableDeclaration": false,
                    "NewExpression": false
                }
            }
        ],
        "operator-linebreak": [
            "error",
            "after"
        ],
        "camelcase": [
            "error",
            {
                "properties": "never",
                "ignoreDestructuring": true
            }
        ],
        "new-cap": [
            "error",
            {
                "newIsCap": true,
                "newIsCapExceptions": [],
                "capIsNew": false,
                "capIsNewExceptions": [
                    "Immutable.Map",
                    "Immutable.Set",
                    "Immutable.List"
                ]
            }
        ],
        "no-multi-assign": [
            "error"
        ],
        "object-shorthand": [
            "error",
            "always",
            {
                "ignoreConstructors": false,
                "avoidQuotes": true
            }
        ],
        "no-prototype-builtins": "error",
        "no-plusplus": "warn",
        "no-array-constructor": "error",
        "array-callback-return": [
            "error",
            {
                "allowImplicit": true
            }
        ],
        "prefer-destructuring": [
            "off",
            {
                "VariableDeclarator": {
                    "array": false,
                    "object": true
                },
                "AssignmentExpression": {
                    "array": true,
                    "object": false
                }
            },
            {
                "enforceForRenamedProperties": false
            }
        ],
        "no-eval": "error",
        "wrap-iife": [
            "error",
            "outside",
            {
                "functionPrototypeMethods": false
            }
        ],
        "prefer-rest-params": "error",
        "no-new-func": "error",
        "no-param-reassign": [
            "error",
            {
                "props": true,
                "ignorePropertyModificationsFor": [
                    "acc",
                    "accumulator",
                    "e",
                    "ctx",
                    "req",
                    "request",
                    "res",
                    "response",
                    "$scope",
                    "staticContext"
                ]
            }
        ],
        "prefer-spread": "error",
        "func-style": [
            "error",
            "declaration",
            {
                "allowArrowFunctions": true
            }
        ],
        "prefer-arrow-callback": [
            "error",
            {
                "allowNamedFunctions": false,
                "allowUnboundThis": true
            }
        ],
        "arrow-spacing": [
            "error",
            {
                "before": true,
                "after": true
            }
        ],
        "arrow-parens": [
            "error",
            "as-needed",
            {
                "requireForBlockBody": true
            }
        ],
        "arrow-body-style": [
            "error",
            "as-needed",
            {
                "requireReturnForObjectLiteral": false
            }
        ],
        "no-confusing-arrow": [
            "error",
            {
                "allowParens": true
            }
        ],
        "implicit-arrow-linebreak": [
            "error",
            "beside"
        ],
        "no-dupe-class-members": "error"
    }
}
