import '@usefaz/ui/globals.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import { preloadFirstScreen } from './preloadFirstScreen';
import { listenForInstallPrompt } from './pwa/installPrompt';
import { registerServiceWorker } from './pwa/registerServiceWorker';

preloadFirstScreen();
registerServiceWorker();
listenForInstallPrompt();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
