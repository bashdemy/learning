/**
 * Valid Anagram Problem
 * 
 * Problem: Given two strings s and t, return true if t is an anagram of s, 
 * and false otherwise.
 * 
 * An Anagram is a word or phrase formed by rearranging the letters of a 
 * different word or phrase, typically using all the original letters exactly once.
 * 
 * Example:
 * Input: s = "anagram", t = "nagaram"
 * Output: true
 * 
 * Input: s = "rat", t = "car"
 * Output: false
 * 
 * Approach: Use hashmap to count character frequencies in both strings.
 * If frequencies match, strings are anagrams.
 */

/**
 * Solution 1: Two Hashmaps Approach
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * Build frequency maps for both strings and compare them.
 */
function isAnagramTwoMaps(s, t) {
    // Edge case: different lengths cannot be anagrams
    if (s.length !== t.length) {
        return false;
    }
    
    // Build frequency map for string s
    const frequencyS = {};
    for (const char of s) {
        frequencyS[char] = (frequencyS[char] || 0) + 1;
    }
    
    // Build frequency map for string t
    const frequencyT = {};
    for (const char of t) {
        frequencyT[char] = (frequencyT[char] || 0) + 1;
    }
    
    // Compare frequencies
    for (const char in frequencyS) {
        if (frequencyS[char] !== frequencyT[char]) {
            return false;
        }
    }
    
    return true;
}

/**
 * Solution 2: Single Hashmap with Increment/Decrement
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * More efficient: increment for s, decrement for t, check if all counts are zero.
 */
function isAnagram(s, t) {
    // Edge case: different lengths cannot be anagrams
    if (s.length !== t.length) {
        return false;
    }
    
    // Build frequency map
    const frequency = {};
    
    // Increment counts for characters in s
    for (const char of s) {
        frequency[char] = (frequency[char] || 0) + 1;
    }
    
    // Decrement counts for characters in t
    for (const char of t) {
        if (!frequency[char]) {
            // Character in t doesn't exist in s
            return false;
        }
        frequency[char]--;
    }
    
    // Check if all counts are zero
    for (const char in frequency) {
        if (frequency[char] !== 0) {
            return false;
        }
    }
    
    return true;
}

/**
 * Solution 3: Optimized Single Pass
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 * 
 * Most efficient version - check during decrement phase.
 */
function isAnagramOptimized(s, t) {
    if (s.length !== t.length) {
        return false;
    }
    
    const frequency = {};
    
    // Process both strings in a single logical pass
    for (let i = 0; i < s.length; i++) {
        // Increment for s
        frequency[s[i]] = (frequency[s[i]] || 0) + 1;
        // Decrement for t
        frequency[t[i]] = (frequency[t[i]] || 0) - 1;
    }
    
    // Check if all values are zero
    for (const char in frequency) {
        if (frequency[char] !== 0) {
            return false;
        }
    }
    
    return true;
}

// Test cases
function runTests() {
    console.log("=== Anagram Problem Tests ===\n");
    
    const testCases = [
        { s: "anagram", t: "nagaram", expected: true },
        { s: "rat", t: "car", expected: false },
        { s: "listen", t: "silent", expected: true },
        { s: "hello", t: "world", expected: false },
        { s: "a", t: "a", expected: true },
        { s: "ab", t: "ba", expected: true },
        { s: "ab", t: "ac", expected: false },
        { s: "", t: "", expected: true },
    ];
    
    console.log("Testing Solution 1 (Two Hashmaps):");
    testCases.forEach(({ s, t, expected }, index) => {
        const result = isAnagramTwoMaps(s, t);
        const status = result === expected ? "✓ PASS" : "✗ FAIL";
        console.log(`Test ${index + 1}: ${status} - s="${s}", t="${t}" => ${result} (expected ${expected})`);
    });
    
    console.log("\nTesting Solution 2 (Single Hashmap):");
    testCases.forEach(({ s, t, expected }, index) => {
        const result = isAnagram(s, t);
        const status = result === expected ? "✓ PASS" : "✗ FAIL";
        console.log(`Test ${index + 1}: ${status} - s="${s}", t="${t}" => ${result} (expected ${expected})`);
    });
    
    console.log("\nTesting Solution 3 (Optimized):");
    testCases.forEach(({ s, t, expected }, index) => {
        const result = isAnagramOptimized(s, t);
        const status = result === expected ? "✓ PASS" : "✗ FAIL";
        console.log(`Test ${index + 1}: ${status} - s="${s}", t="${t}" => ${result} (expected ${expected})`);
    });
}

// Run the tests
runTests();

// Export functions for use in other modules (if using Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isAnagram,
        isAnagramTwoMaps,
        isAnagramOptimized
    };
}

