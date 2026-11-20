/**
 * ============================================================================
 * ROUND 1: RAPID FIRE — DEVELOPER QUESTIONS REPOSITORY
 * ============================================================================
 * 
 * INSTRUCTIONS FOR DEVELOPERS:
 * You can add as many custom questions as you like in the array below.
 * 
 * 1. SINGLE-CORRECT MCQ:
 *    - type: "single"
 *    - correct: [index]  --> 0-based: 0=A, 1=B, 2=C, 3=D
 * 
 * 2. MULTIPLE-SELECT QUESTION:
 *    - type: "multiple"
 *    - correct: [0, 2]   --> e.g. options A and C are correct
 * 
 * OPTIONAL FIELDS:
 * - code: (string) Code snippet rendered in a monospace syntax box.
 * - timeLimitSec: (number) Time allocated for this question in seconds (e.g. 20).
 * - explanation: (string) Shown on the answer feedback screen.
 * ============================================================================
 */

const ROUND1_QUESTIONS = [
  // EXAMPLE 1: Single-Choice with Code Snippet
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
    category: "Data Structures",
    question: "Which of the following data structures can be used to implement a Priority Queue? (Select ALL that apply)",
    options: [
      "Binary Heap",
      "Unsorted Array / Linked List",
      "Self-Balancing Binary Search Tree (AVL / Red-Black)",
      "Standard FIFO Queue without priority comparison"
    ],
    correct: [0, 1, 2], // Options A, B, and C
    explanation: "Binary Heaps (O(log n)), BSTs (O(log n)), and simple arrays (O(n) search) can all implement priority queues. A naive FIFO queue cannot maintain priority.",
    timeLimitSec: 25
  },

  // EXAMPLE 3: General Computing & Networking
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

  // >>> DEVELOPERS: PASTE YOUR REMAINING QUESTIONS BELOW <<<
];
