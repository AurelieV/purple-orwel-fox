module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  setupFiles: ['<rootDir>/jest/vue-test.config.js'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
}
