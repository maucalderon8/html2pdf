document.getElementById('download').addEventListener('click', function() {
  var element = document.getElementById('content');
  var button = this;
  button.innerText = 'Downloading...';
  button.className = 'downloading';

  // Función para esperar a que todas las imágenes se carguen
  function waitForImages(element, callback) {
    var images = element.getElementsByTagName('img');
    var totalImages = images.length;
    var loadedImages = 0;

    if (totalImages === 0) {
      callback();
      return;
    }

    function imageLoaded() {
      loadedImages++;
      if (loadedImages === totalImages) {
        callback();
      }
    }

    for (var i = 0; i < totalImages; i++) {
      var img = images[i];
      if (img.complete) {
        imageLoaded();
      } else {
        img.addEventListener('load', imageLoaded);
        img.addEventListener('error', imageLoaded);
      }
    }
  }

  // Espera a que todas las imágenes se carguen antes de generar el PDF
  waitForImages(element, function() {
    setTimeout(function() {
      var opt = {
        pagebreak: { mode: ['css'], before: ${JSON.stringify(breakBefore)}, after: ${JSON.stringify(breakAfter)}, avoid: ${JSON.stringify(breakAvoid)} },
        margin: ${margin},
        filename: '${fileName}',
        html2canvas: {
          useCORS: true,
          scale: ${quality}
        },
        jsPDF: {
          unit: 'px',
          orientation: '${orientation}',
          format: [${finalDimensions}],
          hotfixes: ['px_scaling']
        }
      };
      html2pdf().set(opt).from(element).toPdf().get('pdf').then(function(pdf) {
        button.innerText = 'Done 🎉';
        button.className = 'done';
        setTimeout(function() { 
          button.innerText = 'Download';
          button.className = ''; 
        }, 2000);
      }).save();
    }, 5000); // 5 seconds delay
  });
});
