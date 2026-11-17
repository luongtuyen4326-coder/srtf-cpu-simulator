/**
 * Gộp các đơn vị liên tiếp của cùng một tiến trình (hoặc idle) thành đoạn Gantt.
 * @returns {{pid: string|null, start: number, end: number}[]}
 */
export function toSegments(snapshots) {
  const segs = [];
  for (const s of snapshots) {
    const lastSeg = segs[segs.length - 1];
    if (lastSeg && lastSeg.pid === s.running && lastSeg.end === s.time) {
      lastSeg.end = s.time + 1;
    } else {
      segs.push({ pid: s.running, start: s.time, end: s.time + 1 });
    }
  }
  return segs;
}

const round2 = (x) => Math.round(x * 100) / 100;

/**
 * Tính các tiêu chí từ snapshots.
 * Công thức: TAT = CT - AT;  WT = TAT - BT;  RT = lần chạy đầu - AT.
 */
export function computeMetrics(processes, snapshots) {
  const start = {};
  const completion = {};
  for (const s of snapshots) {
    if (!s.running) continue;
    if (start[s.running] === undefined) start[s.running] = s.time;
    if (s.remaining[s.running] === 1) completion[s.running] = s.time + 1;
  }

  const perProcess = {};
  let sumTat = 0, sumWt = 0, sumRt = 0;
  for (const p of processes) {
    const ct = completion[p.pid];
    const tat = ct - p.arrival;
    const wt = tat - p.burst;
    const rt = start[p.pid] - p.arrival;
    perProcess[p.pid] = { ct, tat, wt, rt };
    sumTat += tat; sumWt += wt; sumRt += rt;
  }

  const n = processes.length;
  const total = snapshots.length;
  const busy = snapshots.filter((s) => s.running).length;

  return {
    perProcess,
    avg: { tat: round2(sumTat / n), wt: round2(sumWt / n), rt: round2(sumRt / n) },
    cpuUtil: round2((busy / total) * 100), // %
    throughput: round2(n / total),         // tiến trình / đơn vị thời gian
    contextSwitches: snapshots.filter((s) => s.preempted).length,
    totalTime: total,
  };
}
