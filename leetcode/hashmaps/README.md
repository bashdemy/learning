# Hashmap Problem-Solving Guide

## Strategy Overview

Hashmaps (also called hash tables or dictionaries) are one of the most powerful data structures for solving coding problems. They provide O(1) average time complexity for insertion, deletion, and lookup operations.

## Core Strategy

### 1. **When to Use Hashmaps**

Use hashmaps when you need to:
- **Count occurrences** of elements
- **Track frequencies** of characters, numbers, or objects
- **Store key-value pairs** for quick lookups
- **Group elements** by some property
- **Detect duplicates** efficiently
- **Map relationships** between elements
- **Cache computed results** (memoization)

### 2. **Common Patterns**

#### Pattern 1: Frequency Counting
```javascript
const frequency = {};
for (const item of array) {
    frequency[item] = (frequency[item] || 0) + 1;
}
```

#### Pattern 2: Two-Pass Solution
- **First pass**: Build the hashmap with all necessary information
- **Second pass**: Use the hashmap to solve the problem

#### Pattern 3: One-Pass Solution
- Build the hashmap and check conditions simultaneously
- Often more efficient but requires careful logic

#### Pattern 4: Sliding Window with Hashmap
- Use hashmap to track elements in the current window
- Update the hashmap as window moves

### 3. **Space-Time Tradeoffs**

- **Time Complexity**: O(n) for single pass, O(n) for two passes
- **Space Complexity**: O(n) for storing hashmap
- Trade space for time: Use extra memory to avoid nested loops

## Common Hashmap Problems

### 1. **Anagrams**
- **Problem**: Check if two strings are anagrams
- **Approach**: Count character frequencies in both strings
- **Key Insight**: Anagrams have identical character frequencies

### 2. **Two Sum**
- **Problem**: Find two numbers that add up to target
- **Approach**: Store complements (target - current) in hashmap
- **Key Insight**: Check if complement exists while iterating

### 3. **Group Anagrams**
- **Problem**: Group strings that are anagrams of each other
- **Approach**: Use sorted string as key, original strings as values
- **Key Insight**: Anagrams have the same sorted representation

### 4. **Longest Substring Without Repeating Characters**
- **Problem**: Find longest substring with unique characters
- **Approach**: Use sliding window with hashmap to track character positions
- **Key Insight**: Move start pointer when duplicate found

### 5. **First Unique Character**
- **Problem**: Find first non-repeating character in string
- **Approach**: Count frequencies, then find first with count = 1
- **Key Insight**: Two-pass: count then find

### 6. **Intersection of Two Arrays**
- **Problem**: Find common elements between two arrays
- **Approach**: Use hashmap to track elements in first array, check second
- **Key Insight**: One array in hashmap, iterate through other

### 7. **Subarray Sum Equals K**
- **Problem**: Count subarrays with sum equal to k
- **Approach**: Use prefix sum with hashmap
- **Key Insight**: Track cumulative sums, check if (currentSum - k) exists

### 8. **Ransom Note**
- **Problem**: Check if ransom note can be constructed from magazine
- **Approach**: Count magazine characters, check against ransom note
- **Key Insight**: Ensure sufficient character counts

### 9. **Valid Sudoku**
- **Problem**: Validate if Sudoku board is valid
- **Approach**: Use hashmaps for rows, columns, and boxes
- **Key Insight**: Track seen numbers in each dimension

### 10. **Word Pattern**
- **Problem**: Check if string follows a given pattern
- **Problem**: Use bidirectional mapping between pattern and words
- **Key Insight**: Two hashmaps for pattern→word and word→pattern

## Problem-Solving Template

```javascript
function solveWithHashMap(input) {
    // Step 1: Initialize hashmap
    const map = {};
    
    // Step 2: First pass - build hashmap
    for (const item of input) {
        map[item] = (map[item] || 0) + 1;
    }
    
    // Step 3: Second pass - use hashmap
    for (const item of input) {
        if (map[item] === targetCondition) {
            return item;
        }
    }
    
    return result;
}
```

## Tips and Tricks

1. **Default values**: Use `map[key] || defaultValue` for safe access
2. **Existence check**: Use `key in map` or `map[key] !== undefined`
3. **Iteration**: Use `Object.keys()`, `Object.values()`, or `Object.entries()`
4. **JavaScript Map**: Use `Map` for better performance with frequent additions/deletions
5. **Set vs HashMap**: Use `Set` when you only need to track existence, not counts
6. **Edge cases**: Consider empty inputs, single elements, all duplicates

## Practice Problems by Difficulty

### Easy
- Valid Anagram
- First Unique Character in String
- Two Sum
- Ransom Note
- Intersection of Two Arrays

### Medium
- Group Anagrams
- Longest Substring Without Repeating Characters
- Subarray Sum Equals K
- Word Pattern
- Design HashMap

### Hard
- Minimum Window Substring
- Substring with Concatenation of All Words
- Copy List with Random Pointer

## Common Mistakes to Avoid

1. **Forgetting to handle undefined values**: Check if key exists before accessing
2. **Not resetting hashmap**: Clear hashmap between test cases
3. **Wrong key type**: Ensure consistent key types (string vs number)
4. **Off-by-one errors**: Be careful with indices in sliding window problems
5. **Not considering edge cases**: Empty strings, single characters, etc.

