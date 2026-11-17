import { BugHuntProblem } from '../types';

export const ROUND2_PROBLEMS: BugHuntProblem[] = [
  {
    id: 'bug-01',
    title: 'Bug 1: Clean Palindrome Verifier',
    difficulty: 'Easy',
    bugType: 'Logical Off-by-one',
    description: `A developer attempted to write a function \`isPalindrome(s)\` that checks whether a given string is a palindrome after removing all non-alphanumeric characters and converting everything to lowercase.

However, the code fails on sentences containing spaces and has an off-by-one boundary check that crashes or gives false results for odd-length strings!

### Task:
Fix all deliberate bugs in the code so that it returns \`true\` if the sanitized string reads the same forwards and backwards, and \`false\` otherwise.

### Constraints:
- 1 <= string length <= 10^5
- Characters can be letters, digits, spaces, and punctuation.`,
    hints: [
      'Look at how non-alphanumeric characters are stripped.',
      'Check the while loop boundary condition (off-by-one comparison on pointers).',
      'Make sure case conversion occurs before character comparison.'
    ],
    maxPoints: 100,
    timeLimitMin: 15,
    buggyCode: {
      python: `def is_palindrome(s: str) -> bool:
    # BUG 1: Only strips spaces, misses punctuation!
    cleaned = s.replace(" ", "")
    
    # BUG 2: Case sensitivity not handled!
    # cleaned = cleaned.lower()
    
    left = 0
    # BUG 3: Off-by-one index on right pointer!
    right = len(cleaned) 
    
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
        
    return True

# Test driver
import sys
input_data = sys.stdin.read().strip()
if input_data:
    print("true" if is_palindrome(input_data) else "false")
`,
      javascript: `function isPalindrome(s) {
    // BUG 1: Only removes spaces, misses punctuation symbols
    const cleaned = s.replace(/\\s+/g, '');
    
    // BUG 2: Case sensitivity not converted
    let left = 0;
    // BUG 3: Off-by-one on right pointer (index out of bounds)
    let right = cleaned.length; 
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Execution driver
function solve(input) {
    return isPalindrome(input.trim()) ? "true" : "false";
}
`
    },
    solutionCode: {
      python: `import re

def is_palindrome(s: str) -> bool:
    # Strip all non-alphanumeric and lowercase
    cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    left = 0
    right = len(cleaned) - 1
    
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    return True

import sys
input_data = sys.stdin.read().strip()
if input_data:
    print("true" if is_palindrome(input_data) else "false")
`,
      javascript: `function isPalindrome(s) {
    const cleaned = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    let left = 0;
    let right = cleaned.length - 1;
    
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

function solve(input) {
    return isPalindrome(input.trim()) ? "true" : "false";
}
`
    },
    testCases: [
      {
        id: 'tc-1',
        input: 'A man, a plan, a canal: Panama',
        expectedOutput: 'true',
        isHidden: false,
      },
      {
        id: 'tc-2',
        input: 'race a car',
        expectedOutput: 'false',
        isHidden: false,
      },
      {
        id: 'tc-3',
        input: 'Was it a car or a cat I saw?',
        expectedOutput: 'true',
        isHidden: true,
      },
      {
        id: 'tc-4',
        input: '12321',
        expectedOutput: 'true',
        isHidden: true,
      },
      {
        id: 'tc-5',
        input: 'No lemon, no melon',
        expectedOutput: 'true',
        isHidden: true,
      }
    ]
  },
  {
    id: 'bug-02',
    title: 'Bug 2: Unique Two-Sum Pair Collector',
    difficulty: 'Medium',
    bugType: 'Logical Off-by-one',
    description: `Given an array of integers \`nums\` and an integer \`target\`, the function \`findUniquePairs(nums, target)\` must return all UNIQUE pairs of numbers \`[a, b]\` such that \`a + b == target\` and \`a <= b\`.

The output format is space-separated pairs sorted ascendingly, e.g. "1,4 2,3". If no pairs exist, output "NONE".

The provided implementation produces duplicate pairs, crashes when encountering negative numbers, and has an incorrect hash table update sequence!

### Task:
Debug and fix the algorithm so all edge cases and test cases pass cleanly.`,
    hints: [
      'Ensure pairs (a, b) and (b, a) are not added twice.',
      'Check when seen elements are added to your set/lookup table.',
      'Format output as sorted unique pairs joined by spaces, or "NONE" if empty.'
    ],
    maxPoints: 100,
    timeLimitMin: 20,
    buggyCode: {
      python: `def find_unique_pairs(nums, target):
    # BUG 1: Doesn't prevent duplicate value pairs from entering results
    pairs = []
    seen = {}
    
    for i in range(len(nums)):
        comp = target - nums[i]
        # BUG 2: Checks key equality incorrectly
        if comp in seen:
            # BUG 3: Appends unordered pairs, creating duplicates
            pairs.append(f"{nums[i]},{comp}")
        seen[nums[i]] = i
        
    if not pairs:
        return "NONE"
    return " ".join(pairs)

# Driver
import sys
lines = sys.stdin.read().strip().split("\\n")
if len(lines) >= 2:
    nums = [int(x) for x in lines[0].split()]
    target = int(lines[1])
    print(find_unique_pairs(nums, target))
`,
      javascript: `function findUniquePairs(nums, target) {
    const pairs = [];
    const seen = new Set();
    
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (seen.has(comp)) {
            // BUG: Appends without ensuring a <= b or unique pair tracking
            pairs.push(nums[i] + "," + comp);
        }
        seen.add(nums[i]);
    }
    
    if (pairs.length === 0) return "NONE";
    return pairs.join(" ");
}

function solve(input) {
    const lines = input.trim().split(/\\r?\\n/);
    if (lines.length < 2) return "NONE";
    const nums = lines[0].trim().split(/\\s+/).map(Number);
    const target = Number(lines[1].trim());
    return findUniquePairs(nums, target);
}
`
    },
    solutionCode: {
      python: `def find_unique_pairs(nums, target):
    seen = set()
    used_pairs = set()
    result = []
    
    for num in sorted(nums):
        complement = target - num
        if complement in seen:
            pair = (min(num, complement), max(num, complement))
            if pair not in used_pairs:
                used_pairs.add(pair)
                result.append(f"{pair[0]},{pair[1]}")
        seen.add(num)
        
    if not result:
        return "NONE"
    result.sort()
    return " ".join(result)

import sys
lines = sys.stdin.read().strip().split("\\n")
if len(lines) >= 2:
    nums = [int(x) for x in lines[0].split()]
    target = int(lines[1])
    print(find_unique_pairs(nums, target))
`,
      javascript: `function findUniquePairs(nums, target) {
    const seen = new Set();
    const used = new Set();
    const result = [];
    
    nums.sort((a, b) => a - b);
    for (const num of nums) {
        const complement = target - num;
        if (seen.has(complement)) {
            const pairKey = Math.min(num, complement) + "," + Math.max(num, complement);
            if (!used.has(pairKey)) {
                used.add(pairKey);
                result.push(pairKey);
            }
        }
        seen.add(num);
    }
    
    if (result.length === 0) return "NONE";
    result.sort();
    return result.join(" ");
}

function solve(input) {
    const lines = input.trim().split(/\\r?\\n/);
    if (lines.length < 2) return "NONE";
    const nums = lines[0].trim().split(/\\s+/).map(Number);
    const target = Number(lines[1].trim());
    return findUniquePairs(nums, target);
}
`
    },
    testCases: [
      {
        id: 'tc-21',
        input: '1 2 3 4 5\n5',
        expectedOutput: '1,4 2,3',
        isHidden: false,
      },
      {
        id: 'tc-22',
        input: '2 2 3 3 4 4\n6',
        expectedOutput: '2,4 3,3',
        isHidden: false,
      },
      {
        id: 'tc-23',
        input: '10 20 30\n5',
        expectedOutput: 'NONE',
        isHidden: true,
      },
      {
        id: 'tc-24',
        input: '-2 1 2 4 5\n3',
        expectedOutput: '-2,5 1,2',
        isHidden: true,
      }
    ]
  },
  {
    id: 'bug-03',
    title: 'Bug 3: Run-Length Frequency Compressor',
    difficulty: 'Hard',
    bugType: 'Runtime / Pointer',
    description: `Write a string compressor \`compressString(s)\` that condenses repeated consecutive characters into the character followed by its count (e.g. \`"aabcccccaaa"\` becomes \`"a2b1c5a3"\`).

Rule: If the compressed string is NOT smaller than the original string, return the original string!

The current code has an infinite loop on trailing single characters, miscalculates length comparisons, and throws an index bounds exception on single-character inputs.

### Task:
Fix all edge cases, out-of-bounds access, and return rules.`,
    hints: [
      'Handle strings of length 0 or 1 gracefully.',
      'Check the while loop index incrementation when reading identical characters.',
      'Ensure the rule is followed: return original string if compressed length >= original length.'
    ],
    maxPoints: 100,
    timeLimitMin: 20,
    buggyCode: {
      python: `def compress_string(s: str) -> str:
    # BUG 1: Fails to handle empty string
    res = []
    i = 0
    
    # BUG 2: Infinite loop condition / Out of bounds index
    while i <= len(s):
        count = 1
        # Crashes with IndexError on s[i+1]!
        while s[i] == s[i+1]:
            count += 1
            i += 1
        res.append(s[i] + str(count))
        i += 1
        
    compressed = "".join(res)
    # BUG 3: Returns compressed even if it is longer!
    return compressed

import sys
input_str = sys.stdin.read().strip()
if input_str:
    print(compress_string(input_str))
`,
      javascript: `function compressString(s) {
    if (!s) return "";
    let res = "";
    let i = 0;
    
    // BUG 1: Out of bounds condition <= instead of <
    while (i <= s.length) {
        let count = 1;
        // BUG 2: Reference s[i+1] when i is at last char causes undefined match or loop
        while (s[i] === s[i + 1]) {
            count++;
            i++;
        }
        res += s[i] + count;
        i++;
    }
    
    // BUG 3: Missing requirement: return original if compressed is not smaller
    return res;
}

function solve(input) {
    return compressString(input.trim());
}
`
    },
    solutionCode: {
      python: `def compress_string(s: str) -> str:
    if not s:
        return ""
        
    res = []
    i = 0
    n = len(s)
    
    while i < n:
        count = 1
        while i + 1 < n and s[i] == s[i + 1]:
            count += 1
            i += 1
        res.append(f"{s[i]}{count}")
        i += 1
        
    compressed = "".join(res)
    return compressed if len(compressed) < len(s) else s

import sys
input_str = sys.stdin.read().strip()
if input_str:
    print(compress_string(input_str))
`,
      javascript: `function compressString(s) {
    if (!s) return "";
    let res = "";
    let i = 0;
    const n = s.length;
    
    while (i < n) {
        let count = 1;
        while (i + 1 < n && s[i] === s[i + 1]) {
            count++;
            i++;
        }
        res += s[i] + count;
        i++;
    }
    
    return res.length < s.length ? res : s;
}

function solve(input) {
    return compressString(input.trim());
}
`
    },
    testCases: [
      {
        id: 'tc-31',
        input: 'aabcccccaaa',
        expectedOutput: 'a2b1c5a3',
        isHidden: false,
      },
      {
        id: 'tc-32',
        input: 'abcdef',
        expectedOutput: 'abcdef',
        isHidden: false,
      },
      {
        id: 'tc-33',
        input: 'a',
        expectedOutput: 'a',
        isHidden: true,
      },
      {
        id: 'tc-34',
        input: 'wwwwaaadexxxxxx',
        expectedOutput: 'w4a3d1e1x6',
        isHidden: true,
      }
    ]
  }
];
