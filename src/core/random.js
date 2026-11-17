/** Sinh ngẫu nhiên danh sách tiến trình (B sẽ mở rộng/validate thêm). */
export function generateRandom({ count = 5, maxArrival = 10, minBurst = 1, maxBurst = 10 } = {}) {
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  return Array.from({ length: count }, (_, i) => ({
    pid: `P${i + 1}`,
    arrival: rnd(0, maxArrival),
    burst: rnd(minBurst, maxBurst),
  }));
}

export const SAMPLE = [
  { pid: 'P1', arrival: 0, burst: 8 },
  { pid: 'P2', arrival: 1, burst: 4 },
  { pid: 'P3', arrival: 2, burst: 9 },
  { pid: 'P4', arrival: 3, burst: 5 },
];
