import { evaluate_conditional_logic_for_medication_title, evaluate_string_field_comparison, } from "@tellescope/utilities";
var failures = 0;
var passed = 0;
var assert = function (name, actual, expected) {
    if (actual === expected) {
        passed++;
        console.log("  \u2713 ".concat(name));
    }
    else {
        failures++;
        console.error("  \u2717 ".concat(name, " \u2014 expected ").concat(expected, ", got ").concat(actual));
    }
};
var run_string_comparison_tests = function () {
    console.log("\n[evaluate_string_field_comparison]");
    // Plain-string equals (implicit operator)
    assert("equals plain string match", evaluate_string_field_comparison('Aspirin', 'Aspirin'), true);
    assert("equals plain string mismatch", evaluate_string_field_comparison('Aspirin', 'Lisinopril'), false);
    assert("equals empty string against empty title", evaluate_string_field_comparison('', ''), true);
    assert("equals empty string against undefined title", evaluate_string_field_comparison(undefined, ''), true);
    // $ne
    assert("$ne matches when different", evaluate_string_field_comparison('Aspirin', { $ne: 'Lisinopril' }), true);
    assert("$ne fails when equal", evaluate_string_field_comparison('Aspirin', { $ne: 'Aspirin' }), false);
    // $contains (case sensitive — consistent with enduser/form-response evaluators)
    assert("$contains substring match", evaluate_string_field_comparison('Semaglutide GLP-1', { $contains: 'GLP' }), true);
    assert("$contains case sensitive miss", evaluate_string_field_comparison('Lisinopril 10MG', { $contains: 'mg' }), false);
    assert("$contains case sensitive match", evaluate_string_field_comparison('Lisinopril 10mg', { $contains: 'mg' }), true);
    assert("$contains no match", evaluate_string_field_comparison('Aspirin', { $contains: 'GLP' }), false);
    assert("$contains empty string is always true", evaluate_string_field_comparison('Aspirin', { $contains: '' }), true);
    // $doesNotContain
    assert("$doesNotContain mismatch true", evaluate_string_field_comparison('Aspirin', { $doesNotContain: 'GLP' }), true);
    assert("$doesNotContain match false", evaluate_string_field_comparison('Semaglutide', { $doesNotContain: 'Sema' }), false);
    assert("$doesNotContain case sensitive (different case = no match)", evaluate_string_field_comparison('Placebo', { $doesNotContain: 'PLACEBO' }), true);
    // $exists
    assert("$exists:true on present", evaluate_string_field_comparison('Aspirin', { $exists: true }), true);
    assert("$exists:true on empty", evaluate_string_field_comparison('', { $exists: true }), false);
    assert("$exists:true on undefined", evaluate_string_field_comparison(undefined, { $exists: true }), false);
    assert("$exists:false on present", evaluate_string_field_comparison('Aspirin', { $exists: false }), false);
    assert("$exists:false on undefined", evaluate_string_field_comparison(undefined, { $exists: false }), true);
    // null operator → treated as "no value set"
    assert("null operator on undefined title", evaluate_string_field_comparison(undefined, null), true);
    assert("null operator on present title", evaluate_string_field_comparison('Aspirin', null), false);
    // Unknown operator → returns true (don't suppress triggers on bad data)
    assert("unknown operator returns true", evaluate_string_field_comparison('Aspirin', { $weirdOp: 'x' }), true);
};
var run_conditional_logic_tests = function () {
    console.log("\n[evaluate_conditional_logic_for_medication_title]");
    // Single condition (case-sensitive)
    var c1 = { condition: { title: { $contains: 'GLP' } } };
    assert("single $contains true", evaluate_conditional_logic_for_medication_title('Semaglutide GLP-1', c1), true);
    assert("single $contains false", evaluate_conditional_logic_for_medication_title('Aspirin', c1), false);
    assert("single $contains case-sensitive miss", evaluate_conditional_logic_for_medication_title('Semaglutide glp-1', c1), false);
    // Plain string default-equals
    var c2 = { condition: { title: 'Aspirin' } };
    assert("plain equals true", evaluate_conditional_logic_for_medication_title('Aspirin', c2), true);
    assert("plain equals false", evaluate_conditional_logic_for_medication_title('Lisinopril', c2), false);
    // $and (both true)
    var cAnd = {
        $and: [
            { condition: { title: { $contains: 'mg' } } },
            { condition: { title: { $doesNotContain: 'Placebo' } } },
        ],
    };
    assert("$and both pass", evaluate_conditional_logic_for_medication_title('Lisinopril 10mg', cAnd), true);
    assert("$and first fails", evaluate_conditional_logic_for_medication_title('Lisinopril', cAnd), false);
    assert("$and second fails", evaluate_conditional_logic_for_medication_title('Placebo 5mg', cAnd), false);
    // $or
    var cOr = {
        $or: [
            { condition: { title: 'Aspirin' } },
            { condition: { title: { $contains: 'pril' } } },
        ],
    };
    assert("$or first matches", evaluate_conditional_logic_for_medication_title('Aspirin', cOr), true);
    assert("$or second matches", evaluate_conditional_logic_for_medication_title('Lisinopril', cOr), true);
    assert("$or neither matches", evaluate_conditional_logic_for_medication_title('Metformin', cOr), false);
    // Mixed compound: $and containing $or — the canonical "compound" case
    var cMixed = {
        $and: [
            { condition: { title: { $contains: 'mg' } } },
            {
                $or: [
                    { condition: { title: { $contains: 'Lisin' } } },
                    { condition: { title: { $contains: 'Metform' } } },
                ],
            },
        ],
    };
    assert("$and+$or first or-branch matches", evaluate_conditional_logic_for_medication_title('Lisinopril 10mg', cMixed), true);
    assert("$and+$or second or-branch matches", evaluate_conditional_logic_for_medication_title('Metformin 500mg', cMixed), true);
    assert("$and+$or and-branch fails", evaluate_conditional_logic_for_medication_title('Lisinopril', cMixed), false);
    assert("$and+$or or-branch fails", evaluate_conditional_logic_for_medication_title('Aspirin 81mg', cMixed), false);
    // Empty / no-op
    assert("empty conditions returns true", evaluate_conditional_logic_for_medication_title('Aspirin', {}), true);
    // Unknown operator inside condition → returns true (safe)
    var cUnknown = { condition: { title: { $regex: 'foo' } } };
    assert("unknown operator is permissive", evaluate_conditional_logic_for_medication_title('Aspirin', cUnknown), true);
};
var run_all = function () {
    console.log("Running conditional_logic_medication unit tests");
    run_string_comparison_tests();
    run_conditional_logic_tests();
    console.log("\nResults: ".concat(passed, " passed, ").concat(failures, " failed"));
    if (failures > 0)
        process.exit(1);
};
if (require.main === module) {
    run_all();
}
export { run_all as conditional_logic_medication_unit_tests };
//# sourceMappingURL=conditional_logic_medication.test.js.map