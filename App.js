{
  "testRegex": "((\\.|/*.)(test))\\.(jsx|js)?$",
  "collectCoverageFrom": ["src/**/*.js", "src/**/*.jsx"],
  "setupFilesAfterEnv": ["<rootDir>/src/jest.setup.js"],

  "moduleNameMapper": {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg|png|ico)$": "<rootDir>/__mocks__/fileMock.js",
    "^/deployments/config/app\\.json$": "<rootDir>/__mocks__/fileMock.js"
  },
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  },
  "coverageDirectory": "./test/unit/reports/coverage"
}
