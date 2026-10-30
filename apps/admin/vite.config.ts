import { defineAppConfig } from '@usefaz/vite-config';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => defineAppConfig({ root: import.meta.dirname, mode, port: 8081 }));
