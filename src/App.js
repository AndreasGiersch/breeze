import React from 'react';
import './App.css';

import Chart from 'chart.js';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			coValue: 0,
			coDataCount: 0
		};
	}

	ctx;
	chart;

	componentDidMount() {
		setInterval(() => {
			fetch('http://localhost:4000/coData')
				.then(res => res.json())
				.then(data => {
					this.setState(
						{ coValue: data.data, coDataCount: this.state.coDataCount + 1 },
						() => {
							this.chart.data.labels.push(this.state.coDataCount.toString());
							this.chart.data.datasets[0].data.push(this.state.coValue);
							this.chart.update();
						}
					);
				});
		}, 10000);

		this.ctx = document.getElementById('myChart').getContext('2d');
		const gradientStroke = this.ctx.createLinearGradient(0, 0, 0, 500);
		gradientStroke.addColorStop(1, '#198a03'); // green
		gradientStroke.addColorStop(0.8, '#d8e300'); // yellow
		gradientStroke.addColorStop(0, '#c20000'); // red

		this.chart = new Chart(this.ctx, {
			type: 'line',
			data: {
				labels: [],
				datasets: [
					{
						label: 'data',
						borderColor: gradientStroke,
						pointBorderColor: gradientStroke,
						pointBackgroundColor: gradientStroke,
						pointHoverBackgroundColor: gradientStroke,
						pointHoverBorderColor: gradientStroke,
						pointBorderWidth: 10,
						pointHoverRadius: 10,
						pointHoverBorderWidth: 1,
						pointRadius: 3,
						fill: false,
						borderWidth: 4,
						data: []
					}
				]
			},
			options: {
				legend: {
					position: 'bottom'
				},
				scales: {
					yAxes: [
						{
							ticks: {
								fontColor: 'rgba(0,0,0,0.5)',
								fontStyle: 'bold',
								beginAtZero: true,
								maxTicksLimit: 5,
								padding: 20
							},
							gridLines: {
								drawTicks: false,
								display: false
							}
						}
					],
					xAxes: [
						{
							gridLines: {
								zeroLineColor: 'transparent'
							},
							ticks: {
								padding: 20,
								fontColor: 'rgba(0,0,0,0.5)',
								fontStyle: 'bold'
							}
						}
					]
				}
			}
		});
	}

	render() {
		const coVal = this.state.coValue;

		return (
			<div className="App">
				<header className="App-header">Co2 visualization</header>
				<div className="display-data">
					<span>Current Co2 value: </span>
					{coVal <= 1000 ? (
						<span className="low">{coVal}</span>
					) : coVal > 1000 && coVal <= 2000 ? (
						<span className="medium">{coVal}</span>
					) : coVal > 2000 ? (
						<span className="high">{coVal}</span>
					) : undefined}{' '}
					ppm
					<canvas id="myChart"></canvas>
				</div>
			</div>
		);
	}
}

export default App;
