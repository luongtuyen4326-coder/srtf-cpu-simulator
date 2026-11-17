import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// QUAN TRỌNG khi deploy GitHub Pages:
// đổi 'srtf-simulator' thành đúng TÊN REPO của nhóm, nếu không trang sẽ trắng.
const REPO_NAME = 'srtf-simulator';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? `/${REPO_NAME}/` : '/',
  test: { environment: 'node' },
}));
