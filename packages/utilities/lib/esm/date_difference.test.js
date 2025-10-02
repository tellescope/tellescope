import { calculate_days_between_dates, parse_date_string } from './utils.js';
// Unit tests for date difference utility functions
console.log('🧪 Testing date utility functions...\n');
var testsPassed = 0;
var testsFailed = 0;
var test = function (name, fn) {
    try {
        fn();
        console.log("\u2705 ".concat(name));
        testsPassed++;
    }
    catch (error) {
        console.log("\u274C ".concat(name));
        console.error("   Error: ".concat(error instanceof Error ? error.message : String(error)));
        testsFailed++;
    }
};
var assertEqual = function (actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || "Expected ".concat(expected, " but got ").concat(actual));
    }
};
var assertNotNull = function (value, message) {
    if (value === null || value === undefined) {
        throw new Error(message || "Expected non-null value");
    }
};
// Test parse_date_string
console.log('Testing parse_date_string:');
test('parses ISO string correctly', function () {
    var result = parse_date_string('2024-01-15T10:00:00Z');
    assertNotNull(result);
    assertEqual(result.getFullYear(), 2024);
    assertEqual(result.getMonth(), 0); // January = 0
    assertEqual(result.getDate(), 15);
});
test('parses MM-DD-YYYY string correctly', function () {
    var result = parse_date_string('01-15-2024');
    assertNotNull(result);
    assertEqual(result.getFullYear(), 2024);
    assertEqual(result.getMonth(), 0); // January = 0
    assertEqual(result.getDate(), 15);
});
test('returns null for invalid date string', function () {
    var result = parse_date_string('invalid-date');
    assertEqual(result, null);
});
test('returns null for empty string', function () {
    var result = parse_date_string('');
    assertEqual(result, null);
});
// Test calculate_days_between_dates
console.log('\nTesting calculate_days_between_dates:');
test('calculates days between two ISO dates', function () {
    var days = calculate_days_between_dates('2024-01-15T00:00:00Z', '2024-01-25T00:00:00Z');
    assertEqual(days, 10);
});
test('calculates days between two MM-DD-YYYY dates', function () {
    var days = calculate_days_between_dates('01-15-2024', '01-25-2024');
    assertEqual(days, 10);
});
test('calculates days between ISO and MM-DD-YYYY', function () {
    var days = calculate_days_between_dates('2024-01-15T00:00:00Z', '01-25-2024');
    assertEqual(days, 10);
});
test('calculates days between MM-DD-YYYY and ISO', function () {
    var days = calculate_days_between_dates('01-15-2024', '2024-01-25T00:00:00Z');
    assertEqual(days, 10);
});
test('returns absolute value (order does not matter)', function () {
    var days1 = calculate_days_between_dates('2024-01-25T00:00:00Z', '2024-01-15T00:00:00Z');
    var days2 = calculate_days_between_dates('2024-01-15T00:00:00Z', '2024-01-25T00:00:00Z');
    assertEqual(days1, days2);
    assertEqual(days1, 10);
});
test('handles $now for date1', function () {
    var days = calculate_days_between_dates('$now', '2024-01-15T00:00:00Z');
    // Should be many days since 2024-01-15
    if (days < 200) {
        throw new Error("Expected large number of days, got ".concat(days));
    }
});
test('handles $now for date2', function () {
    var days = calculate_days_between_dates('2024-01-15T00:00:00Z', '$now');
    // Should be many days since 2024-01-15
    if (days < 200) {
        throw new Error("Expected large number of days, got ".concat(days));
    }
});
test('handles both $now (should be 0)', function () {
    var days = calculate_days_between_dates('$now', '$now');
    assertEqual(days, 0);
});
test('works with Date objects', function () {
    var date1 = new Date('2024-01-15');
    var date2 = new Date('2024-01-25');
    var days = calculate_days_between_dates(date1, date2);
    assertEqual(days, 10);
});
test('throws error for invalid date1', function () {
    try {
        calculate_days_between_dates('invalid-date', '2024-01-25T00:00:00Z');
        throw new Error('Should have thrown an error');
    }
    catch (error) {
        if (!(error instanceof Error) || !error.message.includes('Invalid date1')) {
            throw error;
        }
    }
});
test('throws error for invalid date2', function () {
    try {
        calculate_days_between_dates('2024-01-15T00:00:00Z', 'invalid-date');
        throw new Error('Should have thrown an error');
    }
    catch (error) {
        if (!(error instanceof Error) || !error.message.includes('Invalid date2')) {
            throw error;
        }
    }
});
test('calculates 30 days correctly', function () {
    var days = calculate_days_between_dates('2024-01-01T00:00:00Z', '2024-01-31T00:00:00Z');
    assertEqual(days, 30);
});
test('calculates 365 days for a full year', function () {
    var days = calculate_days_between_dates('2024-01-01T00:00:00Z', '2025-01-01T00:00:00Z');
    assertEqual(days, 366); // 2024 is a leap year
});
// Summary
console.log('\n' + '='.repeat(50));
console.log("\u2705 Passed: ".concat(testsPassed));
console.log("\u274C Failed: ".concat(testsFailed));
console.log('='.repeat(50));
if (testsFailed > 0) {
    process.exit(1);
}
else {
    console.log('\n🎉 All tests passed!');
    process.exit(0);
}
//# sourceMappingURL=date_difference.test.js.map