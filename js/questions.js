/**
 * ============================================================================
 * ROUND 1: RAPID FIRE — QUESTIONS REPOSITORY
 * ============================================================================
 * 
 * DEVELOPER INSTRUCTIONS:
 * - Insert your 25 to 30 technical questions in the array below.
 * - Each question must follow one of the two formats:
 * 
 * 1. SINGLE-CORRECT MCQ:
 *    - type: "single"
 *    - correct: [index]  --> e.g. [1] for Option B (0-based: 0=A, 1=B, 2=C, 3=D)
 * 
 * 2. MULTIPLE-SELECT QUESTION:
 *    - type: "multiple"
 *    - correct: [index1, index2, ...] --> e.g. [0, 2] for Option A and C
 * 
 * OPTIONAL FIELDS:
 * - code: (string) Code snippet to be rendered in a monospace syntax box.
 * - timeLimitSec: (number) Time allocated for this specific question (default 20s).
 * - explanation: (string) Shown on the answer feedback screen.
 * ============================================================================
 */

const ROUND1_QUESTIONS = [
  // EXAMPLE 1: Single-Correct Multiple Choice with Code Snippet
  {
    id: "q-01",
    type: "single",
    category: "Programming Fundamentals (C / Memory)",
    question: "What will be the output of the following C code snippet?",
    code: `int a = 5;\nprintf("%d %d %d", a++, ++a, a);`,
    options: [
      "5 7 7",
      "Undefined Behavior",
      "5 6 7",
      "7 7 7"
    ],
    correct: [1], // Index 1 is Option B
    explanation: "Modifying a variable multiple times between sequence points causes undefined behavior in standard C.",
    timeLimitSec: 20
  },

  // EXAMPLE 2: Multiple-Select Question ("Select all that apply")
  {
    id: "q-02",
    type: "multiple",
    category: "Technical Concepts (Data Structures)",
    question: "Which of the following data structures can be used to implement a Priority Queue? (Select ALL that apply)",
    options: [
      "Binary Heap",
      "Unsorted Array / Linked List",
      "Self-Balancing Binary Search Tree (AVL / Red-Black)",
      "Standard FIFO Queue without priority comparison"
    ],
    correct: [0, 1, 2], // Options A, B, and C can all back a Priority Queue
    explanation: "Binary Heaps (O(log n)), BSTs (O(log n)), and simple arrays (O(n) search) can all implement priority queues. A naive FIFO queue cannot maintain priority.",
    timeLimitSec: 25
  },

  // EXAMPLE 3: Single-Correct Question on General Computing
  {
    id: "q-03",
    type: "single",
    category: "General Computing & Networks",
    question: "Which transport-layer protocol is connection-oriented and guarantees ordered, error-checked packet delivery?",
    options: [
      "User Datagram Protocol (UDP)",
      "Transmission Control Protocol (TCP)",
      "Internet Control Message Protocol (ICMP)",
      "Address Resolution Protocol (ARP)"
    ],
    correct: [1], // Index 1 is Option B
    explanation: "TCP uses 3-way handshakes, sequence numbers, and retransmissions to guarantee in-order delivery.",
    timeLimitSec: 15
  }

  // >>> DEVELOPERS: PASTE REMAINING 25-30 QUESTIONS HERE <<<
];
