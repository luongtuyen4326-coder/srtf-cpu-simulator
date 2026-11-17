import { runEngine } from './engine.js';

/** SJF (non-preemptive): chọn burst nhỏ nhất, chạy xong mới chọn tiếp. */
export function simulateSJF(processes) {
  return runEngine(processes, { preemptive: false, key: (p) => p.burst });
}
