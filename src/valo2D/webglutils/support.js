/* eslint-disable no-extra-boolean-cast */

export function getRenderingContext() {
  
  if (!! window.WebGL2RenderingContext) {
    return 'webgl2';
  } else if (!! window.WebGLRenderingContext) {
    return 'webgl';
  } else {
    const canvas = document.createElement('canvas');
    try {
      const gl = canvas.getContext('experimental-webgl');
      canvas.loseContext();
      if (gl) {
        let canvas = document.createElement('canvas');
        const gl = canvas.getContext('experimental-webgl');
        gl.getExtension('WEBGL_lose_context').loseContext();
        canvas = null;
        
        return 'experimental-webgl';
      }
    } catch (e) {
      console.log(e);
      window.alert('Your browser does not support WegGL!\nPlease use Chrome or Firefox if you want to see all the features.');
    }
  }

  return false;
}