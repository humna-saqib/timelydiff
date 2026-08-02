const { timelydiff } = require("./index");

const SECOND = 1;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 28 * DAY;
const YEAR = 12 * MONTH;
const DECADE = 10 * YEAR;

// Builds a timestamp `diffSeconds` in the past (positive) or future (negative).
function timestampFromNow(diffSeconds) {
  return Date.now() - diffSeconds * 1000;
}

describe("input validation", () => {
  test("throws on non-number timestamp", () => {
    expect(() => timelydiff("not a number")).toThrow(
      "Invalid timestamp provided."
    );
  });

  test("throws on NaN timestamp", () => {
    expect(() => timelydiff(NaN)).toThrow("Invalid timestamp provided.");
  });

  test("throws on non-string length", () => {
    expect(() => timelydiff(Date.now(), 123)).toThrow(
      "Invalid length parameter."
    );
  });

  test("accepts a null length", () => {
    expect(() => timelydiff(Date.now(), null)).not.toThrow();
  });
});

describe("past timestamps, default length", () => {
  test.each([
    [10, "10 seconds ago"],
    [1 * MINUTE, "1 minute ago"],
    [5 * MINUTE, "5 minutes ago"],
    [5 * HOUR, "5 hours ago"],
    [3 * DAY, "3 days ago"],
    [2 * WEEK, "2 weeks ago"],
    [5 * MONTH, "5 months ago"],
    [3 * YEAR, "3 years ago"],
    [15 * DECADE, "15 decades ago"],
  ])("diff of %i seconds -> %s", (diffSeconds, expected) => {
    expect(timelydiff(timestampFromNow(diffSeconds))).toBe(expected);
  });
});

describe("future timestamps, default length", () => {
  test.each([
    [5 * MINUTE, "in 5 minutes"],
    [5 * HOUR, "in 5 hours"],
    [3 * YEAR, "in 3 years"],
  ])("diff of %i seconds -> %s", (diffSeconds, expected) => {
    expect(timelydiff(timestampFromNow(-diffSeconds))).toBe(expected);
  });
});

describe("short length", () => {
  test.each([
    [5 * MINUTE, "past", "5m ago"],
    [5 * HOUR, "past", "5h ago"],
    [3 * YEAR, "past", "3y ago"],
    [5 * HOUR, "future", "in 5h"],
  ])("diff of %i seconds (%s) -> %s", (diffSeconds, direction, expected) => {
    const timestamp = timestampFromNow(
      direction === "future" ? -diffSeconds : diffSeconds
    );
    expect(timelydiff(timestamp, "short")).toBe(expected);
  });
});

describe("shorter length", () => {
  test.each([
    [5 * MINUTE, "past", "5m"],
    [5 * HOUR, "past", "5h"],
    [3 * YEAR, "past", "3y"],
    [5 * HOUR, "future", "in 5h"],
  ])("diff of %i seconds (%s) -> %s", (diffSeconds, direction, expected) => {
    const timestamp = timestampFromNow(
      direction === "future" ? -diffSeconds : diffSeconds
    );
    expect(timelydiff(timestamp, "shorter")).toBe(expected);
  });
});

describe("pluralization", () => {
  test("does not pluralize a value of 1", () => {
    expect(timelydiff(timestampFromNow(1 * HOUR))).toBe("1 hour ago");
  });

  test("pluralizes a value greater than 1", () => {
    expect(timelydiff(timestampFromNow(2 * HOUR))).toBe("2 hours ago");
  });
});
