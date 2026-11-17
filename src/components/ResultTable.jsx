/** Bảng kết quả: hiện giá trị của tiến trình khi nó đã hoàn thành (ct ≤ t). */
export default function ResultTable({ processes, metrics, step }) {
  return (
    <div className="card">
      <h2>Kết quả</h2>
      <table className="plain results">
        <thead><tr><th>PID</th><th>Arrival</th><th>Burst</th><th>CT</th><th>TAT</th><th>WT</th><th>RT</th></tr></thead>
        <tbody>
          {processes.map((p) => {
            const r = metrics.perProcess[p.pid];
            const done = r.ct <= step;
            return (
              <tr key={p.pid}>
                <td><b>{p.pid}</b></td><td>{p.arrival}</td><td>{p.burst}</td>
                <td>{done ? r.ct : '–'}</td><td>{done ? r.tat : '–'}</td>
                <td>{done ? r.wt : '–'}</td><td>{done ? r.rt : '–'}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr><td colSpan="4">Trung bình</td><td>{metrics.avg.tat}</td><td>{metrics.avg.wt}</td><td>{metrics.avg.rt}</td></tr>
        </tfoot>
      </table>
      <div className="stats">
        <div><span>CPU utilization</span><b>{metrics.cpuUtil}%</b></div>
        <div><span>Throughput</span><b>{metrics.throughput}</b></div>
        <div><span>Số lần ngắt</span><b>{metrics.contextSwitches}</b></div>
        <div><span>Tổng thời gian</span><b>{metrics.totalTime}</b></div>
      </div>
    </div>
  );
}
