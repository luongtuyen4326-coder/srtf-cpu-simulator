/**
 * Động cơ mô phỏng chung cho FCFS / SJF / SRTF.
 * Mỗi vòng lặp = 1 đơn vị thời gian => 1 snapshot.
 *
 * Quy ước tie-break (hòa): key nhỏ hơn -> arrival nhỏ hơn -> thứ tự nhập (idx).
 *
 * Snapshot (trạng thái TẠI ĐẦU đơn vị thời gian t, trước khi chạy):
 * {
 *   time, running (pid | null = idle), preempted (bool),
 *   readyQueue: [pid],           // đã đến, chưa xong, không phải đang chạy
 *   remaining: { pid: số },      // remaining ở đầu đơn vị t
 *   completed: [pid]             // đã xong trước t
 * }
 */
export function runEngine(input, { preemptive, key }) {
  const procs = input.map((p, i) => ({ ...p, idx: i }));
  const remaining = Object.fromEntries(procs.map((p) => [p.pid, p.burst]));
  const snapshots = [];
  const done = [];
  let t = 0;
  let last = null;

  const cmp = (a, b) =>
    key(a, remaining) - key(b, remaining) ||
    a.arrival - b.arrival ||
    a.idx - b.idx;

  while (done.length < procs.length) {
    const avail = procs.filter((p) => p.arrival <= t && remaining[p.pid] > 0);

    let pick = null;
    if (avail.length) {
      const current = last ? avail.find((p) => p.pid === last) : null;
      pick = !preemptive && current ? current : [...avail].sort(cmp)[0];
    }

    const preempted = Boolean(
      pick && last && last !== pick.pid && remaining[last] > 0
    );

    snapshots.push({
      time: t,
      running: pick ? pick.pid : null,
      preempted,
      readyQueue: avail
        .filter((p) => !pick || p.pid !== pick.pid)
        .sort(cmp)
        .map((p) => p.pid),
      remaining: { ...remaining },
      completed: [...done],
    });

    if (pick) {
      remaining[pick.pid] -= 1;
      if (remaining[pick.pid] === 0) done.push(pick.pid);
    }
    last = pick ? pick.pid : null;
    t += 1;
  }
  return snapshots;
}
