import { createRoot } from 'react-dom/client';
import "./index.scss"
import App from "./App";

const domContainer = document.querySelector('#root');
const root = createRoot(domContainer);
root.render(<App/>);