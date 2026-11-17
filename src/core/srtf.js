import { runEngine } from './engine.js';

/** SRTF: preemptive, chọn tiến trình có remaining nhỏ nhất ở mỗi đơn vị thời gian. */
export function simulateSRTF(processes) {
  return runEngine(processes, {
    preemptive: true,
    key: (p, remaining) => remaining[p.pid],
  });
}
