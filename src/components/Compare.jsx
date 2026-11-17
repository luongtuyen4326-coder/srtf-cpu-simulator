/** So sánh waiting time trung bình giữa FCFS, SJF, SRTF (điểm cộng). */
export default function Compare({ rows }) {
  const max = Math.max(...rows.map((r) => r.wt), 1);
  const best = Math.min(...rows.map((r) => r.wt));
  return (
    <div className="card">
      <h2>So sánh waiting time trung bình</h2>
      {rows.map((r) => (
        <div key={r.name} className="bar-row cmp">
          <b>{r.name}</b>
          <div className="bar"><i style={{ width: `${(r.wt / max) * 100}%`, background: r.wt === best ? 'var(--leaf)' : 'var(--orange)' }} /></div>
          <span>{r.wt}</span>
        </div>
      ))}
      <p className="hint">Xanh lá: thấp nhất. Cam: cao hơn.</p>
    </div>
  );
}
