function analyzeDNA() {
  const fileInput = document.getElementById('dnaFile');

  if (!fileInput.files.length) {
    alert('Please select a file');
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const lines = text.split('\n');
    let dnaName = 'Unknown Sequence';

    if (lines[0].startsWith('>')) {
      dnaName = lines[0].substring(1).trim();
    }

    const sequence = lines.filter(line => !line.startsWith('>')).join('').toUpperCase();

    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < sequence.length; i += chunkSize) {
      chunks.push(sequence.slice(i, i + chunkSize));
    }

    const atSkewList = [];
    const gcSkewList = [];
    let cumAT = 0, cumGC = 0;

    chunks.forEach(chunk => {
      let a = (chunk.match(/A/g) || []).length;
      let t = (chunk.match(/T/g) || []).length;
      let g = (chunk.match(/G/g) || []).length;
      let c = (chunk.match(/C/g) || []).length;

      let atSkew = (a - t) / ((a + t) || 1);
      let gcSkew = (g - c) / ((g + c) || 1);

      cumAT += atSkew;
      cumGC += gcSkew;

      atSkewList.push(cumAT.toFixed(4));
      gcSkewList.push(cumGC.toFixed(4));
    });

    // Open new page and pass data via localStorage
    localStorage.setItem('atSkewList', JSON.stringify(atSkewList));
    localStorage.setItem('gcSkewList', JSON.stringify(gcSkewList));
    localStorage.setItem('dnaName', dnaName);

    window.open('graph.html', '_blank');
  };

  reader.readAsText(file);
}