import { createClient } from '@supabase/supabase-js';
import { Team, Question, CompetitionState } from '../types';

/**
 * Supabase Client & Real-time Synchronization
 * Paste your Supabase project URL and anon public key here:
 */
export const SUPABASE_URL = "https://your-project.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key";

const isSupabaseConfigured = 
  SUPABASE_URL.startsWith('https://') && 
  !SUPABASE_URL.includes('your-project') &&
  SUPABASE_ANON_KEY !== 'your-anon-key';

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

/**
 * DEFAULT SEED TEAMS (Fallback & Initial Data)
 */
export const DEFAULT_TEAMS: Team[] = [
  {
    id: "team-01",
    name: "Null Pointers",
    passcode: "team01",
    college: "PCCOER Ravet",
    members: "Aarav Sharma, Sneha Patil, Rohan Deshmukh",
    avatar: "⚡",
    round1Score: 0,
    manualAdjustment: 0,
    totalScore: 0,
    timeTakenSec: 0,
    completedAt: null
  },
  {
    id: "team-02",
    name: "Binary Beasts",
    passcode: "team02",
    college: "PCCOER Ravet",
    members: "Pooja Deshmukh, Aditya More, Tanvi Shinde",
    avatar: "🐺",
    round1Score: 0,
    manualAdjustment: 0,
    totalScore: 0,
    timeTakenSec: 0,
    completedAt: null
  },
  {
    id: "team-03",
    name: "Stack Overlords",
    passcode: "team03",
    college: "PCCOER Ravet",
    members: "Kunal Verma, Ananya Joshi, Siddharth Rane",
    avatar: "👑",
    round1Score: 0,
    manualAdjustment: 0,
    totalScore: 0,
    timeTakenSec: 0,
    completedAt: null
  },
  {
    id: "team-04",
    name: "Syntax Strikers",
    passcode: "team04",
    college: "VIT Pune",
    members: "Yash Bhosale, Bhairav Jadhav, Rutwik Kubade",
    avatar: "⚔️",
    round1Score: 0,
    manualAdjustment: 0,
    totalScore: 0,
    timeTakenSec: 0,
    completedAt: null
  },
  {
    id: "team-05",
    name: "Runtime Terrors",
    passcode: "team05",
    college: "AISSMS",
    members: "Ravi Salve, Radhika Kadam, Abhishek Tambe",
    avatar: "🦖",
    round1Score: 0,
    manualAdjustment: 0,
    totalScore: 0,
    timeTakenSec: 0,
    completedAt: null
  }
];

/**
 * INITIAL DYNAMIC QUESTION BANK (Preloaded into Supabase / Local Storage)
 */
export const INITIAL_QUESTIONS: Question[] = [
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
    correct: [1],
    explanation: "Modifying a variable multiple times between sequence points causes undefined behavior in standard C.",
    timeLimitSec: 20,
    points: 1000
  },
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
    correct: [0, 1, 2],
    explanation: "Binary Heaps (O(log n)), BSTs (O(log n)), and simple arrays (O(n) search) can all implement priority queues. A naive FIFO queue cannot maintain priority.",
    timeLimitSec: 25,
    points: 1000
  },
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
    correct: [1],
    explanation: "TCP uses 3-way handshakes, sequence numbers, and retransmissions to guarantee in-order delivery.",
    timeLimitSec: 15,
    points: 1000
  }
];
