module.exports = {
    env: {
        es2022: true,
        node: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
    },
    rules: {
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-unused-vars": ["warn"],
        "no-console": ["warn"],
    },
};
