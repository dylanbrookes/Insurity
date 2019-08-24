const chartOpts = {
	        maintainAspectRatio: false,
	        responsive: true,
	        // Uncomment the following line in order to disable the animations.
	        // animation: false,
	        legend: {
	          display: false
	        },
	        tooltips: {
	          enabled: false,
	          custom: false
	        },
	        elements: {
	          point: {
	            radius: 0
	          },
	          line: {
	            tension: 0.3
	          }
	        },
	        scales: {
	          xAxes: [{
	            gridLines: false,
	            scaleLabel: false,
	            ticks: {
	              display: false
	            }
	          }],
	          yAxes: [{
	            gridLines: false,
	            scaleLabel: false,
	            ticks: {
	              display: false,
	              min: 0,
	              max: 1
	            }
	          }],
	        },
      };

document.addEventListener('DOMContentLoaded', () => {
	var riskTakingVal = document.getElementById('risk-taking-value');
	var distractedVal = document.getElementById('distracted-value');
	var moodVal = document.getElementById('mood-value');
	var glassesVal = document.getElementById('glasses-value');
	var talkingVal = document.getElementById('talking-value');
	var eyesVal = document.getElementById('eyes-value');
	var focusedVal = document.getElementById('focused-value');
	var tripLenVal = document.getElementById('trip-len-value');
	var riskTakingCtx = document.getElementsByClassName('risk-taking-chart')[0];
	var riskTakingChart = new Chart(riskTakingCtx, {
		type: 'line',
		data: {
		  labels: [],
		  datasets: [{
		    label: 'Today',
		    fill: 'start',
		    data: [],
		    backgroundColor: 'rgba(0, 184, 216, 0.1)',
		    borderColor: 'rgb(0, 184, 216)',
		    borderWidth: 1.5,
		  }]
		},
		options: chartOpts
	});

	var distractedCtx = document.getElementsByClassName('distracted-chart')[0];
	var distractedChart = new Chart(distractedCtx, {
		type: 'line',
		data: {
		  labels: [],
		  datasets: [{
		    label: 'Today',
		    fill: 'start',
		    data: [],
		    backgroundColor: 'rgba(216, 184, 0, 0.1)',
		    borderColor: 'rgb(216, 184, 0)',
		    borderWidth: 1.5,
		  }]
		},
		options: chartOpts
	});

	window.dataHook = (data) => {
		console.log(data);
		riskTakingChart.data.labels.push('');
		riskTakingChart.data.datasets[0].data.push(data.risk);
		riskTakingChart.update();
		riskTakingVal.innerText = (data.risk * 100).toFixed(0) + '%';

		distractedChart.data.labels.push('');
		distractedChart.data.datasets[0].data.push(data.distraction);
		distractedChart.update();
		distractedVal.innerText = (data.distraction * 100).toFixed(0) + '%';

		moodVal.innerText = data.topMood.toUpperCase();
		glassesVal.innerText = data.glasses ? 'On' : 'Off';
		focusedVal.innerText = data.focused? 'Yes' : 'No';
		talkingVal.innerText = data.talking? 'Yes' : 'No';
		eyesVal.innerText = data.eyesOpen? 'Yes' : 'No';
		tripLenVal.innerText = data.tripLength.toFixed(0) + 's';
	}
}, false);