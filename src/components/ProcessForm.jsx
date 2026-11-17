import { useState } from 'react';
import { generateRandom, SAMPLE } from '../core/random.js';

const MAX = 10;
const reindex = (list) => list.map((p, i) => ({ ...p, pid: `P${i + 1}` }));
const toInt = (v, min, max = 999) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? min : Math.min(max, Math.max(min, n));
};

/** Nhập tay (thêm/xóa/sửa) + sinh ngẫu nhiên. Dữ liệu luôn hợp lệ: arrival ≥ 0, burst ≥ 1, số nguyên, tối đa 10 tiến trình. */
export default function ProcessForm({ processes, onChange }) {
  const [count, setCount] = useState(5);
  const [maxArrival, setMaxArrival] = useState(10);
  const [maxBurst, setMaxBurst] = useState(10);

  const edit = (i, field, min, v) =>
    onChange(processes.map((p, j) => (j === i ? { ...p, [field]: toInt(v, min) } : p)));

  return (
    <div className="card">
      <h2>Tiến trình</h2>
      <table className="plain">
        <thead><tr><th>PID</th><th>Arrival</th><th>Burst</th><th /></tr></thead>
        <tbody>
          {processes.map((p, i) => (
            <tr key={p.pid}>
              <td><b>{p.pid}</b></td>
              <td><input type="number" min="0" value={p.arrival} aria-label={`Arrival ${p.pid}`}
                onChange={(e) => edit(i, 'arrival', 0, e.target.value)} /></td>
              <td><input type="number" min="1" value={p.burst} aria-label={`Burst ${p.pid}`}
                onChange={(e) => edit(i, 'burst', 1, e.target.value)} /></td>
              <td><button className="ghost" aria-label={`Xóa ${p.pid}`}
                onClick={() => onChange(reindex(processes.filter((_, j) => j !== i)))}>Xóa</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {processes.length === 0 && <p className="hint">Chưa có tiến trình. Thêm một tiến trình hoặc nạp dữ liệu mẫu.</p>}
      <div className="row">
        <button disabled={processes.length >= MAX}
          onClick={() => onChange(reindex([...processes, { pid: '', arrival: 0, burst: 1 }]))}>
          Thêm tiến trình
        </button>
        <button className="ghost" onClick={() => onChange(SAMPLE)}>Dữ liệu mẫu</button>
      </div>

      <h3>Sinh ngẫu nhiên</h3>
      <div className="grid3">
        <label>Số tiến trình<input type="number" min="1" max={MAX} value={count}
          onChange={(e) => setCount(toInt(e.target.value, 1, MAX))} /></label>
        <label>Arrival tối đa<input type="number" min="0" value={maxArrival}
          onChange={(e) => setMaxArrival(toInt(e.target.value, 0, 50))} /></label>
        <label>Burst tối đa<input type="number" min="1" value={maxBurst}
          onChange={(e) => setMaxBurst(toInt(e.target.value, 1, 30))} /></label>
      </div>
      <button className="accent" onClick={() => onChange(generateRandom({ count, maxArrival, maxBurst }))}>
        Tạo ngẫu nhiên
      </button>
    </div>
  );
}
