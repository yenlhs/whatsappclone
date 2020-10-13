import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import Chat from './Chat'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const messages = [{
  name: 'Adrian',
  message: 'Something',
  timestamp: 'adfasdf',
  received: false
}]

function App() {
  return (
		<Router>
			<div className='app'>
				<Switch>
					<Route path='/'>
						<div className='app__body'>
							{/* Sidebar */}
							<Sidebar />
							<Chat messages={messages} />
						</div>
					</Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
