import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://berendlantink.nl', output: 'static', devToolbar: { enabled: false }, vite: { plugins: [tailwindcss()] } });
