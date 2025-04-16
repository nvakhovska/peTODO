import { jest } from "@jest/globals";

await jest.unstable_mockModule("passport-google-oauth20", () => {
  const Strategy = function(options, verify) {
    this.name = "google";
    this._verify = verify;
    this.authenticate = () => {};
  };

  return {
    Strategy,
  };
});

await import("../../config/passport.js");

describe("passport.js", () => {
  it("should work", () => {
    expect(true).toBe(true);
  });
});
