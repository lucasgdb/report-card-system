// The service worker caches only offline.html and offline.bundle.js, so the styles ship inside the bundle.
import styles from '@usefaz/ui/globals.css?inline';

import { createRoot } from 'react-dom/client';

import App from './App';

const style = document.createElement('style');
style.textContent = styles;
document.head.append(style);

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
