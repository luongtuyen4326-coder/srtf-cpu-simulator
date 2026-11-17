// Màu từng tiến trình: dải xanh lá + cam, đủ tương phản với chữ trắng.
export const PALETTE = ['#2E9E5B', '#E8780C', '#1B6B4A', '#C2410C', '#5B8C1A', '#B45309', '#0F766E', '#9A3412'];
export const colorOf = (pid) => PALETTE[(parseInt(pid.slice(1), 10) - 1) % PALETTE.length];
