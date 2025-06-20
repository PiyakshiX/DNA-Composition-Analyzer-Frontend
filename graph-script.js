const dnaName = localStorage.getItem("dnaName") || "Sample DNA";
const atSkewList = JSON.parse(localStorage.getItem("atSkewList") || "[]").map(Number);
const gcSkewList = JSON.parse(localStorage.getItem("gcSkewList") || "[]").map(Number);

document.getElementById("dnaTitle").textContent = dnaName;

function getMinMaxPoints(data) {
  let minVal = Math.min(...data);
  let maxVal = Math.max(...data);
  let minIndex = data.indexOf(minVal);
  let maxIndex = data.indexOf(maxVal);
  return {
    min: { x: minIndex + 1, y: minVal },
    max: { x: maxIndex + 1, y: maxVal }
  };
}

function createChart(ctx, label, data, color) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [
        {
          label: label,
          data: data,
          borderColor: color,
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Chunk ${context.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Chunk Number"
          }
        },
        y: {
          title: {
            display: true,
            text: "Cumulative Skew Value"
          }
        }
      }
    }
  });
}

// Display Min/Max Below Graph
function displayStats(elementId, minMax, label) {
  const statsDiv = document.getElementById(elementId);
  statsDiv.innerHTML = `
    <p><strong>Max ${label}:</strong> ${minMax.max.y.toFixed(4)} (Chunk ${minMax.max.x})</p>
    <p><strong>Min ${label}:</strong> ${minMax.min.y.toFixed(4)} (Chunk ${minMax.min.x})</p>
  `;
}

// AT Skew Chart
const atStats = getMinMaxPoints(atSkewList);
createChart(
  document.getElementById("atSkewChart"),
  "AT Skew",
  atSkewList,
  "black"
);
displayStats("atStats", atStats, "AT Skew");

// GC Skew Chart
const gcStats = getMinMaxPoints(gcSkewList);
createChart(
  document.getElementById("gcSkewChart"),
  "GC Skew",
  gcSkewList,
  "black"
);
displayStats("gcStats", gcStats, "GC Skew");



