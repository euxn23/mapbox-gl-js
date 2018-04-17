import window from '../util/window';
const {
  HTMLImageElement,
  HTMLCanvasElement,
  HTMLVideoElement,
  ImageData
} = window;

class Texture {
  constructor(context, image, format, premultiply) {
    this.context = context;
    const {
      width,
      height
    } = image;
    this.size = [width, height];
    this.format = format;
    this.texture = context.gl.createTexture();
    this.update(image, premultiply);
  }

  update(image, premultiply) {
    const {
      width,
      height
    } = image;
    this.size = [width, height];
    const {
      context
    } = this;
    const {
      gl
    } = context;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    context.pixelStoreUnpack.set(1);

    if (this.format === gl.RGBA && premultiply !== false) {
      context.pixelStoreUnpackPremultiplyAlpha.set(true);
    }

    if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement || image instanceof HTMLVideoElement || image instanceof ImageData) {
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, gl.UNSIGNED_BYTE, image);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, gl.UNSIGNED_BYTE, image.data);
    }
  }

  bind(filter, wrap, minFilter) {
    const {
      context
    } = this;
    const {
      gl
    } = context;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    if (filter !== this.filter) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter || filter);
      this.filter = filter;
    }

    if (wrap !== this.wrap) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
      this.wrap = wrap;
    }
  }

  destroy() {
    const {
      gl
    } = this.context;
    gl.deleteTexture(this.texture);
    this.texture = null;
  }

}

export default Texture;