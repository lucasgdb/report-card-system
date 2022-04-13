import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { createRoot } from 'react-dom/client';

import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);

module.hot?.accept();
