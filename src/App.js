import './App.css';
import React, { useState, useEffect, useMemo } from "react";
import Table from "./components/Table";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket('ws://city-ws.herokuapp.com/');
const cityMap = {};
function App() {
	const [data, setData] = useState([]);

	// Using useEffect to call the API once mounted and set the data
	useEffect(() => {
		(async () => {
			client.onopen = () => {
				console.log('WebSocket Client Connected');
			};
			client.onmessage = (message) => {
				message = JSON.parse(message.data);
				setData([data, ...message]);
				message.forEach((d) => {
					if (!cityMap[d.city]) {
						cityMap[d.city] = d;
						setData([...data, d]);
					} else {
						cityMap[d.city].aqi = d.aqi;
					}
				});
			};
		})();
	}, [data]);


	const columns = useMemo(
		() => [{
			Header: 'City',
			accessor: 'city'
		}, {
			Header: 'Current AQI',
			accessor: 'aqi'
		}],
		[]
	);

	return (
		<div className="App">
			<header className="App-header">
				<Table columns={columns} data={data} />
			</header>
		</div>
	);
}

export default App;
