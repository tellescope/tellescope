// Simple unit test for snippet functionality
import { get_snippet_keys, replace_snippet_template_values } from './utils';
// Test get_snippet_keys function
console.log('Testing get_snippet_keys...');
// Test 1: Extract snippet keys from various text patterns
var test1 = get_snippet_keys('Hello {{snippet:greeting}}, this is {{snippet:company_name}} calling!');
console.log('Test 1 - Expected: ["greeting", "company_name"], Got:', test1);
// Test 2: No snippets in text
var test2 = get_snippet_keys('Hello {{enduser.fname}}, no snippets here!');
console.log('Test 2 - Expected: [], Got:', test2);
// Test 3: Duplicate snippet keys should be deduplicated
var test3 = get_snippet_keys('{{snippet:greeting}} world! {{snippet:greeting}} again!');
console.log('Test 3 - Expected: ["greeting"], Got:', test3);
// Test 4: Complex webhook-like structure
var webhookUrl = 'https://api.example.com/webhook?message={{snippet:welcome_message}}&signature={{snippet:api_signature}}';
var webhookBody = JSON.stringify({
    greeting: '{{snippet:greeting}}',
    company: '{{snippet:company_name}}',
    footer: '{{snippet:email_footer}}'
});
var test4 = get_snippet_keys(webhookUrl + webhookBody);
console.log('Test 4 - Expected: ["welcome_message", "api_signature", "greeting", "company_name", "email_footer"], Got:', test4);
console.log('\nTesting replace_snippet_template_values...');
// Test replace_snippet_template_values function
var snippets = [
    { key: 'greeting', value: 'Hello there' },
    { key: 'company_name', value: 'Acme Corp' },
    { key: 'email_footer', value: 'Best regards,\\nThe Acme Team' }
];
// Test 1: Replace snippets in simple text
var replace1 = replace_snippet_template_values('{{snippet:greeting}}, welcome to {{snippet:company_name}}!', snippets);
console.log('Test 1 - Expected: "Hello there, welcome to Acme Corp!", Got:', replace1);
// Test 2: Replace in webhook URL
var replace2 = replace_snippet_template_values(webhookUrl, snippets);
console.log('Test 2 - Should replace welcome_message with empty and leave signature empty:', replace2);
// Test 3: No snippets in text
var replace3 = replace_snippet_template_values('No snippets here!', snippets);
console.log('Test 3 - Expected: "No snippets here!", Got:', replace3);
// Test 4: Missing snippet
var replace4 = replace_snippet_template_values('{{snippet:missing_key}} should be empty', snippets);
console.log('Test 4 - Expected: " should be empty", Got:', replace4);
console.log('\nAll tests completed!');
//# sourceMappingURL=snippet_test.js.map