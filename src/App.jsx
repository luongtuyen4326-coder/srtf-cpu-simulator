import { useMemo, useState } from 'react';
import { simulateSRTF } from './core/srtf.js';
import { simulateSJF } from './core/sjf.js';
import { simulateFCFS } from './core/fcfs.js';
import { computeMetrics, toSegments } from './core/metrics.js';
import { SAMPLE } from './core/random.js';
import { usePlayer } from './usePlayer.js';
import ProcessForm from './components/ProcessForm.jsx';
import GanttChart from './components/GanttChart.jsx';
import StateView from './components/StateView.jsx';
import ResultTable from './components/ResultTable.jsx';
import Compare from './components/Compare.jsx';

export default function App() {
  const [processes, setProcesses] = useState(SAMPLE);
  const [speed, setSpeed] = useState(600);

  const sim = useMemo(() => {
    if (!processes.length) return null;
    const snapshots = simulateSRTF(processes);
    return {
      snapshots,
      segments: toSegments(snapshots),
      metrics: computeMetrics(processes, snapshots),
      compare: [['FCFS', simulateFCFS], ['SJF', simulateSJF], ['SRTF', simulateSRTF]].map(([name, f]) => ({
        name, wt: computeMetrics(processes, f(processes)).avg.wt,
      })),
    };
  }, [processes]);

  const total = sim ? sim.snapshots.length : 0;
  const player = usePlayer(total, speed);
  const change = (list) => { player.reset(); setProcesses(list); };

  return (
    <>
      <header className="top">
        <div>
          <h1>Mô phỏng lập lịch CPU: SRTF</h1>
          <p>Shortest Remaining Time First, chạy từng bước hoặc tự động</p>
        </div>
      </header>

      <div className="layout">
        <aside><ProcessForm processes={processes} onChange={change} /></aside>

        <main>
          {!sim ? (
            <div className="card empty">Thêm ít nhất một tiến trình để bắt đầu mô phỏng.</div>
          ) : (
            <>
              <div className="card controls">
                <div className="row">
                  <button className="ghost" onClick={player.prev} disabled={player.step === 0}>Lùi</button>
                  {player.playing
                    ? <button className="accent" onClick={player.pause}>Tạm dừng</button>
                    : <button className="accent" onClick={player.play}>{player.step >= total ? 'Chạy lại' : 'Chạy'}</button>}
                  <button className="ghost" onClick={player.next} disabled={player.step >= total}>Tiến</button>
                  <button className="ghost" onClick={player.reset}>Đặt lại</button>
                  <label className="speed">Tốc độ
                    <input type="range" min="100" max="1500" step="100" value={1600 - speed}
                      onChange={(e) => setSpeed(1600 - Number(e.target.value))} />
                  </label>
                </div>
                <input type="range" className="seek" min="0" max={total} value={player.step}
                  aria-label="Thời điểm" onChange={(e) => player.seek(Number(e.target.value))} />
              </div>

              <GanttChart segments={sim.segments} step={player.step} total={total} />
              <StateView snapshot={sim.snapshots[player.step]} processes={processes} step={player.step} />
              <ResultTable processes={processes} metrics={sim.metrics} step={player.step} />
              <Compare rows={sim.compare} />
            </>
          )}
        </main>
      </div>
    </>
  );
}
