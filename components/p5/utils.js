import p5 from 'p5';

//https://github.com/processing/p5.js/blob/v1.9.3/src/image/loading_displaying.js#L18
export function loadLargeImage(path, successCallback, failureCallback) {
  const pImg = new p5.Image(1, 1);
  const self = this;

  const req = new Request(path, {
    method: 'GET',
    mode: 'cors'
  });

  fetch(path, req)
    .then(response => {
      // GIF section
      const contentType = response.headers.get('content-type');
      if (contentType === null) {
        console.warn(
          'The image you loaded does not have a Content-Type header. If you are using the online editor consider reuploading the asset.'
        );
      }

      //TODO impliment GIF stuff (//https://github.com/processing/p5.js/blob/v1.9.3/src/image/loading_displaying.js#L18)
      // Non-GIF Section 
      const img = new Image();

      img.onload = () => {
        const ratio = img.width / img.height;

        let width = img.width;
        let height = img.height;
        const maxDim = 4096;
        if (width > maxDim || height > maxDim) {
          if (ratio > 1) {
            width = maxDim;
            height = width / ratio;
          } else {
            height = maxDim;
            width = height * ratio;
          }
        }
        
        pImg.width = pImg.canvas.width = img.width = width;
        pImg.height = pImg.canvas.height = img.height = height;

        // Draw the image into the backing canvas of the p5.Image
        pImg.drawingContext.drawImage(img, 0, 0, width, height);
        pImg.modified = true;
        if (typeof successCallback === 'function') {
          successCallback(pImg);
        }
        self._decrementPreload();
      };
      

      img.onerror = e => {
        p5._friendlyFileLoadError(0, img.src);
        if (typeof failureCallback === 'function') {
          failureCallback(e);
          self._decrementPreload();
        } else {
          console.error(e);
        }
      };

      // Set crossOrigin in case image is served with CORS headers.
      // This will let us draw to the canvas without tainting it.
      // See https://developer.mozilla.org/en-US/docs/HTML/CORS_Enabled_Image
      // When using data-uris the file will be loaded locally
      // so we don't need to worry about crossOrigin with base64 file types.
      if (path.indexOf('data:image/') !== 0) {
        img.crossOrigin = 'Anonymous';
      }
      // start loading the image
      img.src = path;
      
      pImg.modified = true;
    })
    .catch(e => {
      p5._friendlyFileLoadError(0, path);
      if (typeof failureCallback === 'function') {
        failureCallback(e);
        self._decrementPreload();
      } else {
        console.error(e);
      }
    });
  return pImg;
}
