import { colorOf } from '../colors.js';

const CELL = 30; // px / đơn vị thời gian

/** Gantt: vẽ các đoạn đã chạy tới thời điểm `step`, vạch cam là thời điểm hiện tại. */
export default function GanttChart({ segments, step, total }) {
  const shown = segments.filter((s) => s.start < step).map((s) => ({ ...s, end: Math.min(s.end, step) }));
  const ticks = [...new Set([...shown.map((s) => s.start), step])];

  return (
    <div className="card">
      <h2>Biểu đồ Gantt</h2>
      <div className="gantt-scroll">
        <div className="gantt" style={{ width: total * CELL + 2 }}>
          <div className="track" />
          {shown.map((s, i) => (
            <div key={i} className={`seg ${s.pid ? '' : 'idle'}`}
              style={{ left: s.start * CELL, width: (s.end - s.start) * CELL, background: s.pid ? colorOf(s.pid) : undefined }}
              title={`${s.pid ?? 'Idle'}: ${s.start} → ${s.end}`}>
              {s.pid ?? 'idle'}
            </div>
          ))}
          {ticks.map((t) => (
            <span key={t} className="tick" style={{ left: t * CELL }}>{t}</span>
          ))}
          <div className="playhead" style={{ left: step * CELL }} />
        </div>
      </div>
    </div>
  );
}
