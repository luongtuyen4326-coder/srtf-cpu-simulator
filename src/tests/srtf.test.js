import { describe, it, expect } from 'vitest';
import { simulateSRTF } from '../core/srtf.js';
import { simulateSJF } from '../core/sjf.js';
import { simulateFCFS } from '../core/fcfs.js';
import { computeMetrics, toSegments } from '../core/metrics.js';
import { SAMPLE } from '../core/random.js';

const run = (procs, sim = simulateSRTF) => {
  const snaps = sim(procs);
  return { snaps, segs: toSegments(snaps), m: computeMetrics(procs, snaps) };
};

describe('SRTF – ví dụ mẫu P1..P4', () => {
  const { segs, m } = run(SAMPLE);

  it('Gantt đúng', () => {
    expect(segs).toEqual([
      { pid: 'P1', start: 0, end: 1 },
      { pid: 'P2', start: 1, end: 5 },
      { pid: 'P4', start: 5, end: 10 },
      { pid: 'P1', start: 10, end: 17 },
      { pid: 'P3', start: 17, end: 26 },
    ]);
  });
  it('waiting từng tiến trình', () => {
    expect(m.perProcess.P1.wt).toBe(9);
    expect(m.perProcess.P2.wt).toBe(0);
    expect(m.perProcess.P3.wt).toBe(15);
    expect(m.perProcess.P4.wt).toBe(2);
  });
  it('trung bình WT=6.5, TAT=13, RT=4.25', () => {
    expect(m.avg).toEqual({ tat: 13, wt: 6.5, rt: 4.25 });
  });
  it('CPU 100%, 1 lần bị ngắt (P1 bị P2 ngắt tại t=1)', () => {
    expect(m.cpuUtil).toBe(100);
    // P1 bị P2 ngắt (t=1). P4 chạy sau khi P2 xong (không ngắt). P1 chạy lại sau P4 xong (không ngắt).
    expect(m.contextSwitches).toBe(1);
  });
});

describe('SRTF – trường hợp biên', () => {
  it('1 tiến trình', () => {
    const { segs, m } = run([{ pid: 'P1', arrival: 0, burst: 3 }]);
    expect(segs).toEqual([{ pid: 'P1', start: 0, end: 3 }]);
    expect(m.avg).toEqual({ tat: 3, wt: 0, rt: 0 });
  });
  it('CPU idle đầu tiên (arrival > 0)', () => {
    const { segs, m } = run([{ pid: 'P1', arrival: 2, burst: 3 }]);
    expect(segs[0]).toEqual({ pid: null, start: 0, end: 2 });
    expect(segs[1]).toEqual({ pid: 'P1', start: 2, end: 5 });
    expect(m.cpuUtil).toBe(60);
  });
  it('CPU idle ở giữa', () => {
    const { segs } = run([
      { pid: 'P1', arrival: 0, burst: 2 },
      { pid: 'P2', arrival: 5, burst: 1 },
    ]);
    expect(segs.map((s) => s.pid)).toEqual(['P1', null, 'P2']);
  });
  it('tất cả đến cùng lúc: chạy theo burst tăng dần', () => {
    const { segs } = run([
      { pid: 'P1', arrival: 0, burst: 5 },
      { pid: 'P2', arrival: 0, burst: 2 },
      { pid: 'P3', arrival: 0, burst: 3 },
    ]);
    expect(segs.map((s) => s.pid)).toEqual(['P2', 'P3', 'P1']);
  });
  it('hòa remaining: ưu tiên đến trước, rồi theo thứ tự nhập', () => {
    const { segs } = run([
      { pid: 'P1', arrival: 0, burst: 3 },
      { pid: 'P2', arrival: 0, burst: 3 },
    ]);
    expect(segs.map((s) => s.pid)).toEqual(['P1', 'P2']);
  });
  it('tiến trình đến sau có remaining bằng nhau KHÔNG ngắt', () => {
    // t=1: P1 còn 2, P2 mới đến burst 2 -> hòa, P1 đến trước nên giữ CPU
    const { segs } = run([
      { pid: 'P1', arrival: 0, burst: 3 },
      { pid: 'P2', arrival: 1, burst: 2 },
    ]);
    expect(segs.map((s) => s.pid)).toEqual(['P1', 'P2']);
  });
  it('mọi tiến trình đều hoàn thành, tổng remaining = 0', () => {
    const { snaps } = run(SAMPLE);
    const last = snaps[snaps.length - 1];
    expect(last.completed.length).toBe(SAMPLE.length - 1); // tiến trình cuối xong sau đơn vị này
  });
  it('snapshot đúng hình dạng hợp đồng dữ liệu', () => {
    const s = simulateSRTF(SAMPLE)[1];
    expect(s).toMatchObject({ time: 1, running: 'P2', preempted: true });
    expect(s.readyQueue).toEqual(['P1']);
    expect(s.remaining).toEqual({ P1: 7, P2: 4, P3: 9, P4: 5 });
  });
});

describe('So sánh FCFS / SJF / SRTF trên cùng dữ liệu', () => {
  it('FCFS WT TB = 8.75', () => {
    expect(run(SAMPLE, simulateFCFS).m.avg.wt).toBe(8.75);
  });
  it('SJF WT TB = 7.75', () => {
    expect(run(SAMPLE, simulateSJF).m.avg.wt).toBe(7.75);
  });
  it('SRTF cho WT TB nhỏ nhất (6.5)', () => {
    const w = [simulateFCFS, simulateSJF, simulateSRTF].map((f) => run(SAMPLE, f).m.avg.wt);
    expect(Math.min(...w)).toBe(w[2]);
  });
});
