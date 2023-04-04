module.exports = {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testEnvironment: 'node',
    testRegex: './test/.*\\.(test|spec)?\\.(js|ts)$',
    moduleFileExtensions: ['ts', 'js', 'json'],
    roots: ['<rootDir>/test'],
};