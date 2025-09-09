// Test JSON Samples for Functionality Testing

const testCases = {
    // Valid JSON Cases
    simpleObject: {
        input: '{"name":"John","age":30,"city":"New York"}',
        description: "Simple flat object",
        expectedValid: true
    },
    
    nestedObject: {
        input: '{"user":{"name":"Alice","profile":{"email":"alice@test.com","avatar":"https://example.com/avatar.jpg"},"settings":{"theme":"dark","notifications":{"email":true,"push":false}}}}',
        description: "Deeply nested object",
        expectedValid: true
    },
    
    arrayWithObjects: {
        input: '[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"},{"id":3,"name":"Item 3"}]',
        description: "Array of objects",
        expectedValid: true
    },
    
    mixedTypes: {
        input: '{"string":"Hello","number":42,"boolean":true,"null":null,"array":[1,2,3],"object":{"nested":"value"}}',
        description: "Mixed data types",
        expectedValid: true
    },
    
    unicodeAndSpecial: {
        input: '{"emoji":"😀🎉","chinese":"你好世界","arabic":"مرحبا","special":"Line1\\nLine2\\tTabbed","escaped":"Quote: \\"Hello\\""}',
        description: "Unicode and special characters",
        expectedValid: true
    },
    
    emptyStructures: {
        input: '{"emptyObject":{},"emptyArray":[],"emptyString":""}',
        description: "Empty structures",
        expectedValid: true
    },
    
    largeNumbers: {
        input: '{"smallInt":1,"largeInt":9007199254740991,"float":3.14159265359,"scientific":1.23e-10,"negative":-42}',
        description: "Various number formats",
        expectedValid: true
    },
    
    // Invalid JSON Cases
    missingQuotes: {
        input: '{name:"John","age":30}',
        description: "Missing quotes on key",
        expectedValid: false,
        expectedError: "Unexpected token"
    },
    
    trailingComma: {
        input: '{"name":"John","age":30,}',
        description: "Trailing comma",
        expectedValid: false,
        expectedError: "Unexpected token"
    },
    
    singleQuotes: {
        input: "{'name':'John','age':30}",
        description: "Single quotes instead of double",
        expectedValid: false,
        expectedError: "Unexpected token"
    },
    
    unclosedBracket: {
        input: '{"name":"John","items":[1,2,3}',
        description: "Unclosed bracket",
        expectedValid: false,
        expectedError: "Unexpected token"
    },
    
    duplicateKeys: {
        input: '{"name":"John","name":"Jane"}',
        description: "Duplicate keys (valid JSON but worth testing)",
        expectedValid: true // JSON allows duplicate keys, last one wins
    }
};

// Function to test all cases
function runTests() {
    console.log("=== JSON Formatter Test Suite ===\n");
    
    let passed = 0;
    let failed = 0;
    
    Object.entries(testCases).forEach(([name, testCase]) => {
        console.log(`Testing: ${testCase.description}`);
        console.log(`Input: ${testCase.input.substring(0, 50)}...`);
        
        try {
            const parsed = JSON.parse(testCase.input);
            const formatted = JSON.stringify(parsed, null, 2);
            const minified = JSON.stringify(parsed);
            
            if (testCase.expectedValid) {
                console.log("✅ PASS - Valid JSON parsed successfully");
                console.log(`   Formatted length: ${formatted.length} chars`);
                console.log(`   Minified length: ${minified.length} chars`);
                passed++;
            } else {
                console.log("❌ FAIL - Expected error but JSON was valid");
                failed++;
            }
        } catch (error) {
            if (!testCase.expectedValid) {
                console.log("✅ PASS - Invalid JSON detected as expected");
                console.log(`   Error: ${error.message}`);
                passed++;
            } else {
                console.log("❌ FAIL - Valid JSON failed to parse");
                console.log(`   Error: ${error.message}`);
                failed++;
            }
        }
        console.log("");
    });
    
    console.log("=== Test Results ===");
    console.log(`Total Tests: ${passed + failed}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

// Run tests if executed directly
if (typeof module !== 'undefined' && require.main === module) {
    runTests();
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testCases, runTests };
}