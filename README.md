# Mô phỏng lập lịch CPU – SRTF (Bài tập lớn Nguyên lý Hệ điều hành, đề tài #14)

## Chạy dự án
```bash
npm install
npm run dev       # chạy dev
npm test          # chạy unit test (Vitest)
npm run build && npm run preview   # bản build, dùng làm demo offline
```

## Cấu trúc
```
src/core/engine.js   động cơ mô phỏng chung (A sở hữu)
src/core/srtf.js     SRTF (preemptive)
src/core/sjf.js      SJF  (để so sánh)
src/core/fcfs.js     FCFS (để so sánh)
src/core/metrics.js  toSegments() cho Gantt + computeMetrics()
src/core/random.js   generateRandom() + SAMPLE (B sở hữu)
src/usePlayer.js     Play/Pause/Next/Prev/Reset/Seek (Tech Lead)
src/components/      ProcessForm (B), GanttChart + StateView + ResultTable (C), Compare
src/colors.js        màu từng tiến trình (dải xanh lá + cam)
src/tests/           unit test
```

## Hợp đồng dữ liệu (KHÔNG đổi nếu chưa báo cả nhóm)
- Input: `{ pid: "P1", arrival: 0, burst: 8 }`
- `simulateSRTF(processes)` -> mảng snapshot, mỗi phần tử = 1 đơn vị thời gian:
  `{ time, running (pid|null=idle), preempted, readyQueue[], remaining{}, completed[] }`
  (trạng thái ở ĐẦU đơn vị thời gian `time`)
- `toSegments(snapshots)` -> `[{ pid|null, start, end }]` (đã gộp đoạn liên tiếp)
- `computeMetrics(processes, snapshots)` -> `{ perProcess:{pid:{ct,tat,wt,rt}}, avg:{tat,wt,rt}, cpuUtil, throughput, contextSwitches, totalTime }`

## Quy ước thuật toán
- Chọn tiến trình có `remaining` nhỏ nhất. Hòa: `arrival` nhỏ hơn -> thứ tự nhập.
- Tiến trình mới đến có remaining **bằng** tiến trình đang chạy thì **không** ngắt (nếu nó đến sau).
- `TAT = CT - AT`, `WT = TAT - BT`, `RT = lần chạy đầu - AT`.

## Phân công & Git
| Người | Nhánh | Phạm vi |
|---|---|---|
| Tech Lead | `main`, `feat/ui-shell` | khung giao diện, usePlayer, deploy, review/merge |
| A | `feat/core` | `src/core/*`, `src/tests/*` |
| B | `feat/form` | `src/components/ProcessForm*`, `core/random.js` |
| C | `feat/gantt` | `src/components/GanttChart*`, `StateView*`, `ResultTable*` |
| D | `docs/report` | `docs/` (báo cáo, slide, bảng test thủ công) |

Quy tắc: không push thẳng `main`; mở Pull Request, Tech Lead review rồi merge; mỗi người phải có commit của mình.

## Deploy GitHub Pages
1. Sửa `REPO_NAME` trong `vite.config.js` thành tên repo.
2. Repo -> Settings -> Pages -> Source: **GitHub Actions**.
3. Mỗi lần merge vào `main`, workflow `.github/workflows/deploy.yml` tự chạy test, build và deploy.
