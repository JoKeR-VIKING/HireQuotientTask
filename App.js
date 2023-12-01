import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { Dashboard } from './Dashboard';
import './index.css';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<PrimeReactProvider>
		<Dashboard />
	</PrimeReactProvider>
);