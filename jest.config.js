'use strict';

console.log('[DEVELOPER] Loading jest.config.js');

module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    testEnvironment: 'node',
    testMatch: ['<rootDir>/**/*.test.js'],
    testPathIgnorePatterns: ['/demo_page/', 'node_modules', '^.+\\.(scss|less)$'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^.+\\.(scss|less)$': '<rootDir>/cssMock.js'
    }
};