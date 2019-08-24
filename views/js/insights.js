document.addEventListener('DOMContentLoaded', () => {
  let insightDataStr = window.localStorage.getItem('insights');
  let insightData = insightDataStr? JSON.parse(insightDataStr) : {
    gender: {
      male: 0, female: 0
    },
    emotion: {
      happy: 0,
      disgusted: 0,
      calm: 0,
      angry: 0,
      sad: 0,
      confused: 0,
      fear: 0,
      surprised: 0
    },
    smile: { yes: 0, no: 0 }
  };

  let tGender = insightData.gender.male + insightData.gender.female;
  if (tGender === 0) tGender = 1;

  document.getElementById('male-gender-bar').style.width = (insightData.gender.male / tGender * 100) + "%";
  document.getElementById('female-gender-bar').style.width = (insightData.gender.female / tGender * 100) + "%";

  let t = 0;
  for (let k of Object.keys(insightData.emotion)) {
    t += insightData.emotion[k];
  }

  if (t == 0) t = 1;
  // Data
  var emotionData = {
    datasets: [{
      hoverBorderColor: '#ffffff',
      data: [
        insightData.emotion.happy,
        insightData.emotion.disgusted, 
        insightData.emotion.calm, 
        insightData.emotion.angry, 
        insightData.emotion.sad, 
        insightData.emotion.confused, 
        insightData.emotion.fear, 
        insightData.emotion.surprised],
      backgroundColor: [
        'rgba(0,123,255,0.9)',
        'rgba(0,123,255,0.5)',
        'rgba(0,123,255,0.3)',
        'rgba(0,123,255,0.2)',
        'rgba(0,123,255,0.1)',
        'rgba(0,123,255,0.8)',
        'rgba(0,123,255,0.7)',
        'rgba(0,123,255,0.6)',
      ]
    }],
    labels: [
      "Happy",
      "Disgusted",
      "Calm",
      "Angry",
      "Sad",
      "Confused",
      "Fear",
      "Surprised"
    ]
  };

  console.log(emotionData)

  // Options
  var emotionOptions = {
    legend: {
      position: 'bottom',
      labels: {
        padding: 25,
        boxWidth: 20
      }
    },
    cutoutPercentage: 0,
    // Uncomment the following line in order to disable the animations.
    // animation: false,
    tooltips: {
      custom: false,
      mode: 'index',
      position: 'nearest'
    }
  };

  var emotionCtx = document.getElementById('emotion-chart');

  // Generate the users by device chart.
  window.emotionChart = new Chart(emotionCtx, {
    type: 'pie',
    data: emotionData,
    options: emotionOptions
  });

  var smileCtx = document.getElementById('smile-chart');
  // Generate the users by device chart.
  window.smileChart = new Chart(smileCtx, {
    type: 'bar',
    data: {
      labels: ["Yes", "No"],
      datasets: [{
        label: "# Of Smiles",
        data: [insightData.smile.yes, insightData.smile.no],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ]
      }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
  });
}, false);