import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Challenge } from './models/Challenge.js';

dotenv.config();

const challenges = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "easy",
    category: "arrays",
    tags: ["hash-table", "array"],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists"
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "nums[1] + nums[2] = 6"
      }
    ],
    testCases: [
      { input: [[2,7,11,15], 9], expectedOutput: [0,1], isHidden: false },
      { input: [[3,2,4], 6], expectedOutput: [1,2], isHidden: false },
      { input: [[3,3], 6], expectedOutput: [0,1], isHidden: true }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Write your solution here\n  \n}`,
      python: `def two_sum(nums, target):\n    # Write your solution here\n    pass`,
      java: `public int[] twoSum(int[] nums, int target) {\n    // Write your solution here\n    \n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    \n}`,
      go: `func twoSum(nums []int, target int) []int {\n    // Write your solution here\n    \n}`
    },
    solution: {
      code: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}`,
      explanation: "Use a hash map to store numbers and their indices. For each number, check if its complement (target - num) exists in the map.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    hints: [
      "Think about using a hash map",
      "Store each number's index as you iterate",
      "For each number, check if target - num exists"
    ],
    companies: ["Amazon", "Google", "Facebook", "Microsoft"],
    acceptanceRate: 0,
    totalSubmissions: 0,
    totalAccepted: 0
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "easy",
    category: "strings",
    tags: ["stack", "string"],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string is valid"
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "All brackets are properly matched"
      },
      {
        input: 's = "(]"',
        output: "false",
        explanation: "Brackets are not properly matched"
      }
    ],
    testCases: [
      { input: "()", expectedOutput: true, isHidden: false },
      { input: "()[]{}", expectedOutput: true, isHidden: false },
      { input: "(]", expectedOutput: false, isHidden: false },
      { input: "([)]", expectedOutput: false, isHidden: true },
      { input: "{[]}", expectedOutput: true, isHidden: true }
    ],
    starterCode: {
      javascript: `function isValid(s) {\n  // Write your solution here\n  \n}`,
      python: `def is_valid(s):\n    # Write your solution here\n    pass`,
      java: `public boolean isValid(String s) {\n    // Write your solution here\n    \n}`,
      cpp: `bool isValid(string s) {\n    // Write your solution here\n    \n}`,
      go: `func isValid(s string) bool {\n    // Write your solution here\n    \n}`
    },
    solution: {
      code: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  \n  for (let char of s) {\n    if (!map[char]) {\n      stack.push(char);\n    } else if (stack.pop() !== map[char]) {\n      return false;\n    }\n  }\n  \n  return stack.length === 0;\n}`,
      explanation: "Use a stack to track opening brackets. For closing brackets, check if the top of stack matches.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    hints: [
      "Use a stack data structure",
      "Push opening brackets onto the stack",
      "Pop and match closing brackets"
    ],
    companies: ["Google", "Amazon", "Microsoft", "Bloomberg"],
    acceptanceRate: 0,
    totalSubmissions: 0,
    totalAccepted: 0
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    difficulty: "easy",
    category: "linked-lists",
    tags: ["linked-list", "recursion"],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ],
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
        explanation: "Merge both sorted lists into one"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
        explanation: "Both lists are empty"
      }
    ],
    testCases: [
      { input: [[1,2,4], [1,3,4]], expectedOutput: [1,1,2,3,4,4], isHidden: false },
      { input: [[], []], expectedOutput: [], isHidden: false },
      { input: [[], [0]], expectedOutput: [0], isHidden: true }
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {\n  // Write your solution here\n  \n}`,
      python: `def merge_two_lists(list1, list2):\n    # Write your solution here\n    pass`,
      java: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    // Write your solution here\n    \n}`,
      cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Write your solution here\n    \n}`,
      go: `func mergeTwoLists(list1 *ListNode, list2 *ListNode) *ListNode {\n    // Write your solution here\n    \n}`
    },
    solution: {
      code: `function mergeTwoLists(list1, list2) {\n  const dummy = new ListNode(0);\n  let current = dummy;\n  \n  while (list1 && list2) {\n    if (list1.val < list2.val) {\n      current.next = list1;\n      list1 = list1.next;\n    } else {\n      current.next = list2;\n      list2 = list2.next;\n    }\n    current = current.next;\n  }\n  \n  current.next = list1 || list2;\n  return dummy.next;\n}`,
      explanation: "Use a dummy node to build the merged list. Compare nodes from both lists and append the smaller one.",
      timeComplexity: "O(m + n)",
      spaceComplexity: "O(1)"
    },
    hints: [
      "Use a dummy node to simplify edge cases",
      "Compare values and link the smaller node",
      "Don't forget to attach remaining nodes"
    ],
    companies: ["Amazon", "Microsoft", "Apple"],
    acceptanceRate: 0,
    totalSubmissions: 0,
    totalAccepted: 0
  },
  {
    title: "Binary Tree Inorder Traversal",
    slug: "binary-tree-inorder-traversal",
    description: "Given the root of a binary tree, return the inorder traversal of its nodes' values. In inorder traversal, we visit the left subtree, then the root, then the right subtree.",
    difficulty: "easy",
    category: "trees",
    tags: ["tree", "binary-tree", "dfs"],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100].",
      "-100 <= Node.val <= 100"
    ],
    examples: [
      {
        input: "root = [1,null,2,3]",
        output: "[1,3,2]",
        explanation: "Inorder traversal of the tree"
      },
      {
        input: "root = []",
        output: "[]",
        explanation: "Empty tree"
      }
    ],
    testCases: [
      { input: [1,null,2,3], expectedOutput: [1,3,2], isHidden: false },
      { input: [], expectedOutput: [], isHidden: false },
      { input: [1], expectedOutput: [1], isHidden: true }
    ],
    starterCode: {
      javascript: `function inorderTraversal(root) {\n  // Write your solution here\n  \n}`,
      python: `def inorder_traversal(root):\n    # Write your solution here\n    pass`,
      java: `public List<Integer> inorderTraversal(TreeNode root) {\n    // Write your solution here\n    \n}`,
      cpp: `vector<int> inorderTraversal(TreeNode* root) {\n    // Write your solution here\n    \n}`,
      go: `func inorderTraversal(root *TreeNode) []int {\n    // Write your solution here\n    \n}`
    },
    solution: {
      code: `function inorderTraversal(root) {\n  const result = [];\n  \n  function traverse(node) {\n    if (!node) return;\n    traverse(node.left);\n    result.push(node.val);\n    traverse(node.right);\n  }\n  \n  traverse(root);\n  return result;\n}`,
      explanation: "Recursively traverse left subtree, visit root, then traverse right subtree.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)"
    },
    hints: [
      "Think recursively",
      "Left -> Root -> Right order",
      "Can also use iterative approach with a stack"
    ],
    companies: ["Amazon", "Microsoft", "Google"],
    acceptanceRate: 0,
    totalSubmissions: 0,
    totalAccepted: 0
  },
  {
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating",
    description: "Given a string s, find the length of the longest substring without repeating characters. A substring is a contiguous sequence of characters within a string.",
    difficulty: "medium",
    category: "strings",
    tags: ["string", "sliding-window", "hash-table"],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    testCases: [
      { input: "abcabcbb", expectedOutput: 3, isHidden: false },
      { input: "bbbbb", expectedOutput: 1, isHidden: false },
      { input: "pwwkew", expectedOutput: 3, isHidden: false },
      { input: "", expectedOutput: 0, isHidden: true },
      { input: "au", expectedOutput: 2, isHidden: true }
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  \n}`,
      python: `def length_of_longest_substring(s):\n    # Write your solution here\n    pass`,
      java: `public int lengthOfLongestSubstring(String s) {\n    // Write your solution here\n    \n}`,
      cpp: `int lengthOfLongestSubstring(string s) {\n    // Write your solution here\n    \n}`,
      go: `func lengthOfLongestSubstring(s string) int {\n    // Write your solution here\n    \n}`
    },
    solution: {
      code: `function lengthOfLongestSubstring(s) {\n  let maxLen = 0;\n  let start = 0;\n  const seen = new Map();\n  \n  for (let end = 0; end < s.length; end++) {\n    if (seen.has(s[end])) {\n      start = Math.max(start, seen.get(s[end]) + 1);\n    }\n    seen.set(s[end], end);\n    maxLen = Math.max(maxLen, end - start + 1);\n  }\n  \n  return maxLen;\n}`,
      explanation: "Use sliding window with a hash map to track character positions. Move start pointer when duplicate is found.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(min(n, m)) where m is charset size"
    },
    hints: [
      "Use sliding window technique",
      "Track characters with a hash map",
      "Move the start pointer when duplicate is found"
    ],
    companies: ["Amazon", "Google", "Facebook", "Microsoft", "Apple"],
    acceptanceRate: 0,
    totalSubmissions: 0,
    totalAccepted: 0
  },
  {
    title: "Maximum Subarray",
    slug: "maximum-subarray",
    description: "Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous part of an array.",
    difficulty: "medium",
    category: "dynamic-programming",
    tags: ["array", "dynamic-programming", "divide-and-conquer"],
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6."
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1."
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23."
      }
    ],
    testCases: [
      { input: [-2,1,-3,4,-1,2,1,-5,4], expectedOutput: 6, isHidden: false },
      { input: [1], expectedOutput: 1, isHidden: false },
      { input: [5,4,-1,7,8], expectedOutput: 23, isHidden: false },
      { input: [-1], expectedOutput: -1, isHidden: true },
      { input: [-2,-1], expectedOutput: -1, isHidden: true }
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {\n  // Write your solution here\n  \n}`,
      python: `def max_sub_array(nums):\n    # Write your solution here\n    pass`,
      java: `public int maxSubArray(int[] nums) {\n    // Write your solution here\n    \n}`,
      cpp: `int maxSubArray(vector<int>& nums) {\n    // Write your solution here\n    \n}`,
      go: `func maxSubArray(nums []int) int {\n    // Write your solution here\n    \n}`
    },
    solution: {
      code: `function maxSubArray(nums) {\n  let maxSum = nums[0];\n  let currentSum = nums[0];\n  \n  for (let i = 1; i < nums.length; i++) {\n    currentSum = Math.max(nums[i], currentSum + nums[i]);\n    maxSum = Math.max(maxSum, currentSum);\n  }\n  \n  return maxSum;\n}`,
      explanation: "Kadane's algorithm: Keep track of current sum and maximum sum. At each position, decide whether to extend current subarray or start new one.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)"
    },
    hints: [
      "Think about Kadane's algorithm",
      "At each position, decide: extend current subarray or start new?",
      "Track both current sum and maximum sum"
    ],
    companies: ["Amazon", "Microsoft", "Google", "Apple", "Bloomberg"],
    acceptanceRate: 0,
    totalSubmissions: 0,
    totalAccepted: 0
  }
];

async function seedChallenges() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('🗑️  Cleared existing challenges');

    // Insert new challenges
    await Challenge.insertMany(challenges);
    console.log(`✅ Successfully seeded ${challenges.length} challenges`);

    console.log('\n📊 Challenges by difficulty:');
    console.log('   Easy:', challenges.filter(c => c.difficulty === 'easy').length);
    console.log('   Medium:', challenges.filter(c => c.difficulty === 'medium').length);
    console.log('   Hard:', challenges.filter(c => c.difficulty === 'hard').length);

    console.log('\n📁 Challenges by category:');
    const categories = [...new Set(challenges.map(c => c.category))];
    categories.forEach(cat => {
      console.log(`   ${cat}:`, challenges.filter(c => c.category === cat).length);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
}

seedChallenges();
