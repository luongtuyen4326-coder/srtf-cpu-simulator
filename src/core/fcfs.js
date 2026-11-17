import { runEngine } from './engine.js';

/** FCFS: đến trước chạy trước, không ngắt. */
export function simulateFCFS(processes) {
  return runEngine(processes, { preemptive: false, key: (p) => p.arrival });
}
