import '@usefaz/ui/globals.css';

import { createRoot } from 'react-dom/client';

import App from './App';
import { preloadFirstScreen } from './preloadFirstScreen';

preloadFirstScreen();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
