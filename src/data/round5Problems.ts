import { RelayProblem } from '../types';

export const ROUND5_PROBLEMS: RelayProblem[] = [
  {
    id: 'relay-01',
    title: 'Round 5: Network Packet Traffic Balancer',
    description: `A campus router receives packets characterized by an arrival timestamp and payload size. To prevent buffer overflow, packets must be grouped into contiguous bursts where the total payload does not exceed \`maxBuffer\`.

Your team must implement a function \`balanceNetworkTraffic(packets, maxBuffer)\` that:
1. Calculates the minimum number of transmission windows needed to flush all packets without exceeding \`maxBuffer\` per window.
2. Identifies the maximum latency delay between the earliest and latest packet within any single transmission window.

### Relay Team Structure:
- **Phase 1 (10 Min):** Entire team brainstorms algorithm & decides data representation.
- **Phase 2 (5 Min):** Member 1 writes structure definitions & input parser.
- **Phase 3 (5 Min):** Member 2 writes the greedy window partition logic.
- **Phase 4 (5 Min):** Member 3 computes maximum latency span across windows.
- **Phase 5 (5 Min):** Member 4 writes edge case handling (single packet, buffer overflows).
- **Phase 6 (10 Min):** Entire team works together to debug, optimize, and test!`,
    inputFormat: `Line 1: Space-separated packet sizes (e.g. 2 3 5 1 4)\nLine 2: Single integer maxBuffer (e.g. 6)`,
    outputFormat: `Two integers separated by space: <minWindows> <maxLatency>`,
    phases: [
      { name: 'Strategy & Brainstorming', durationMinutes: 10, description: 'All team members discuss approach, variables, and pseudocode together.' },
      { name: 'Member 1: Setup & Skeleton', durationMinutes: 5, description: 'Member 1 codes packet structure, validates inputs, and writes loop stub.' },
      { name: 'Member 2: Partition Engine', durationMinutes: 5, description: 'Member 2 implements greedy accumulation and window break condition.' },
      { name: 'Member 3: Latency & Metrics', durationMinutes: 5, description: 'Member 3 calculates maximum latency spread per window.' },
      { name: 'Member 4: Boundary Hardening', durationMinutes: 5, description: 'Member 4 handles single element arrays, zeroes, and strict capacity checks.' },
      { name: 'Final All-Hands Collaborative Polish', durationMinutes: 10, description: 'All members join to test, review code together, and submit!' }
    ],
    starterCode: {
      python: `def balance_network_traffic(packets, max_buffer):
    # Member 1: Parse and initialize tracking variables
    if not packets:
        return "0 0"
        
    windows = 0
    current_window_sum = 0
    max_latency = 0
    
    # Member 2 & 3: Fill in window aggregation logic
    for size in packets:
        if size > max_buffer:
            return "-1 -1" # Packet exceeds buffer
        if current_window_sum + size > max_buffer:
            windows += 1
            current_window_sum = size
        else:
            current_window_sum += size
            
    if current_window_sum > 0:
        windows += 1
        
    # Member 4: Compute latency metric
    max_latency = len(packets) // max(1, windows)
    
    return f"{windows} {max_latency}"

# Driver
import sys
input_data = sys.stdin.read().strip().split("\\n")
if len(input_data) >= 2:
    nums = [int(x) for x in input_data[0].split()]
    buf = int(input_data[1])
    print(balance_network_traffic(nums, buf))
`,
      javascript: `function balanceNetworkTraffic(packets, maxBuffer) {
    if (!packets || packets.length === 0) return "0 0";
    
    let windows = 0;
    let currentSum = 0;
    
    for (let size of packets) {
        if (size > maxBuffer) return "-1 -1";
        if (currentSum + size > maxBuffer) {
            windows++;
            currentSum = size;
        } else {
            currentSum += size;
        }
    }
    if (currentSum > 0) windows++;
    
    const maxLatency = Math.floor(packets.length / Math.max(1, windows));
    return \`\${windows} \${maxLatency}\`;
}

function solve(input) {
    const lines = input.trim().split(/\\r?\\n/);
    if (lines.length < 2) return "0 0";
    const packets = lines[0].trim().split(/\\s+/).map(Number);
    const maxBuffer = Number(lines[1].trim());
    return balanceNetworkTraffic(packets, maxBuffer);
}
`
    },
    testCases: [
      {
        id: 'tc-501',
        input: '2 3 5 1 4\n6',
        expectedOutput: '3 1',
        isHidden: false,
      },
      {
        id: 'tc-502',
        input: '1 2 3 4 5 6\n10',
        expectedOutput: '3 2',
        isHidden: false,
      },
      {
        id: 'tc-503',
        input: '10 20 5\n8',
        expectedOutput: '-1 -1',
        isHidden: true,
      }
    ]
  }
];
