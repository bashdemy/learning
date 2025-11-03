package main

import (
	"fmt"
)

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
func isAnagramTwoMaps(s, t string) bool {
	// Edge case: different lengths cannot be anagrams
	if len(s) != len(t) {
		return false
	}

	// Build frequency map for string s
	frequencyS := make(map[rune]int)
	for _, char := range s {
		frequencyS[char]++
	}

	// Build frequency map for string t
	frequencyT := make(map[rune]int)
	for _, char := range t {
		frequencyT[char]++
	}

	// Compare frequencies
	for char, count := range frequencyS {
		if frequencyT[char] != count {
			return false
		}
	}

	// Check if t has any characters not in s
	for char := range frequencyT {
		if _, exists := frequencyS[char]; !exists {
			return false
		}
	}

	return true
}

/**
 * Solution 2: Single Hashmap with Increment/Decrement
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * More efficient: increment for s, decrement for t, check if all counts are zero.
 */
func isAnagram(s, t string) bool {
	// Edge case: different lengths cannot be anagrams
	if len(s) != len(t) {
		return false
	}

	// Build frequency map
	frequency := make(map[rune]int)

	// Increment counts for characters in s
	for _, char := range s {
		frequency[char]++
	}

	// Decrement counts for characters in t
	for _, char := range t {
		if frequency[char] == 0 {
			// Character in t doesn't exist in s or has been exhausted
			return false
		}
		frequency[char]--
	}

	// Check if all counts are zero
	for _, count := range frequency {
		if count != 0 {
			return false
		}
	}

	return true
}

/**
 * Solution 3: Optimized Single Pass
 * Time Complexity: O(n)
 * Space Complexity: O(n)
 *
 * Most efficient version - process both strings together.
 */
func isAnagramOptimized(s, t string) bool {
	if len(s) != len(t) {
		return false
	}

	frequency := make(map[rune]int)

	// Process both strings in a single logical pass
	for i := 0; i < len(s); i++ {
		// Increment for s
		frequency[rune(s[i])]++
		// Decrement for t
		frequency[rune(t[i])]--
	}

	// Check if all values are zero
	for _, count := range frequency {
		if count != 0 {
			return false
		}
	}

	return true
}

// Test cases
func runTests() {
	fmt.Println("=== Anagram Problem Tests ===\n")

	testCases := []struct {
		s        string
		t        string
		expected bool
	}{
		{s: "anagram", t: "nagaram", expected: true},
		{s: "rat", t: "car", expected: false},
		{s: "listen", t: "silent", expected: true},
		{s: "hello", t: "world", expected: false},
		{s: "a", t: "a", expected: true},
		{s: "ab", t: "ba", expected: true},
		{s: "ab", t: "ac", expected: false},
		{s: "", t: "", expected: true},
	}

	fmt.Println("Testing Solution 1 (Two Hashmaps):")
	for i, tc := range testCases {
		result := isAnagramTwoMaps(tc.s, tc.t)
		status := "✓ PASS"
		if result != tc.expected {
			status = "✗ FAIL"
		}
		fmt.Printf("Test %d: %s - s=\"%s\", t=\"%s\" => %v (expected %v)\n",
			i+1, status, tc.s, tc.t, result, tc.expected)
	}

	fmt.Println("\nTesting Solution 2 (Single Hashmap):")
	for i, tc := range testCases {
		result := isAnagram(tc.s, tc.t)
		status := "✓ PASS"
		if result != tc.expected {
			status = "✗ FAIL"
		}
		fmt.Printf("Test %d: %s - s=\"%s\", t=\"%s\" => %v (expected %v)\n",
			i+1, status, tc.s, tc.t, result, tc.expected)
	}

	fmt.Println("\nTesting Solution 3 (Optimized):")
	for i, tc := range testCases {
		result := isAnagramOptimized(tc.s, tc.t)
		status := "✓ PASS"
		if result != tc.expected {
			status = "✗ FAIL"
		}
		fmt.Printf("Test %d: %s - s=\"%s\", t=\"%s\" => %v (expected %v)\n",
			i+1, status, tc.s, tc.t, result, tc.expected)
	}
}

func main() {
	runTests()
}

