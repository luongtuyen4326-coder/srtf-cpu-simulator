import { colorOf } from '../colors.js';

/** Trạng thái tại thời điểm t: CPU, ready queue, remaining từng tiến trình. */
export default function StateView({ snapshot, processes, step }) {
  const finished = !snapshot;
  const remaining = snapshot ? snapshot.remaining : Object.fromEntries(processes.map((p) => [p.pid, 0]));
  return (
    <div className="card">
      <h2>Trạng thái tại t = {step}</h2>
      <div className="state-grid">
        <div className="cpu" data-idle={!finished && !snapshot.running}>
          <span className="label">CPU</span>
          <strong style={{ color: snapshot?.running ? colorOf(snapshot.running) : undefined }}>
            {finished ? 'Hoàn thành' : snapshot.running ?? 'Idle'}
          </strong>
          {snapshot?.preempted && <span className="badge">Ngắt tiến trình trước</span>}
        </div>
        <div>
          <span className="label">Ready queue</span>
          <div className="chips">
            {snapshot?.readyQueue.length
              ? snapshot.readyQueue.map((pid) => (
                  <span key={pid} className="chip" style={{ background: colorOf(pid) }}>{pid}</span>))
              : <span className="hint">Trống</span>}
          </div>
        </div>
      </div>
      <div className="bars">
        {processes.map((p) => (
          <div key={p.pid} className="bar-row">
            <b>{p.pid}</b>
            <div className="bar"><i style={{ width: `${(remaining[p.pid] / p.burst) * 100}%`, background: colorOf(p.pid) }} /></div>
            <span>{remaining[p.pid]}/{p.burst}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
