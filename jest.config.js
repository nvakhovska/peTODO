// const baseDir = "<rootDir>/**";
// const baseTestDir = "<rootDir>/test/**";

export default {
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/**/*.js"],
  testMatch: ["<rootDir>/test/**/*.test.js"],
  transform: {}, // Disable Babel transforms
  injectGlobals: true,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
