export const cameraPresets: Record<
  string,
  { position: [number, number, number]; rotation: [number, number, number] }
> = {
  front: { position: [0, 0, 5], rotation: [0, 0, 0] },
  back: { position: [0, 0, -5], rotation: [0, Math.PI, 0] },
  left: { position: [-5, 0, 0], rotation: [0, Math.PI / 2, 0] },
  right: { position: [5, 0, 0], rotation: [0, -Math.PI / 2, 0] },
  top: { position: [0, 5, 0], rotation: [-Math.PI / 2, 0, 0] },
  bottom: { position: [0, -5, 0], rotation: [Math.PI / 2, 0, 0] },
  isometric: { position: [5, 5, 5], rotation: [0, Math.PI / 4, 0] },
  perspective: { position: [3, 3, 3], rotation: [0, Math.PI / 6, 0] },
};

export const zoomPresets = [
  { name: 'Ultra Far', distance: 25 },
  { name: 'Far', distance: 15 },
  { name: 'Medium', distance: 8 },
  { name: 'Close', distance: 3 },
  { name: 'Very Close', distance: 1.5 },
  { name: 'Extreme Close', distance: 0.5 },
  { name: 'Micro Close', distance: 0.2 },
  { name: 'Nano Close', distance: 0.1 },
];

export const scalePresets = [
  { name: 'Tiny', scale: 0.005 },
  { name: 'Small', scale: 0.01 },
  { name: 'Normal', scale: 0.02 },
  { name: 'Large', scale: 0.05 },
  { name: 'Huge', scale: 0.1 },
  { name: 'Massive', scale: 0.2 },
];

export const bgColors = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#1a1a1a' },
  { name: 'Navy', value: '#0a0a2a' },
  { name: 'Dark Green', value: '#0a2a0a' },
  { name: 'Dark Red', value: '#2a0a0a' },
  { name: 'Purple', value: '#2a0a2a' },
  { name: 'White', value: '#ffffff' },
  { name: 'Light Gray', value: '#f0f0f0' },
  { name: 'Sky Blue', value: '#87CEEB' },
  {
    name: 'Gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
];
