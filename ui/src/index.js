import { createRoot } from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <App />, // StrictMode is removed
);
