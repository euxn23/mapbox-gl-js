import assert from 'assert';
import pixelsToTileUnits from '../source/pixels_to_tile_units';

/**
 * Checks whether a pattern image is needed, and if it is, whether it is not loaded.
 * @private
 * @returns true if a needed image is missing and rendering needs to be skipped.
 */
export const isPatternMissing = function (image, painter) {
  if (!image) return false;
  const imagePosA = painter.imageManager.getPattern(image.from);
  const imagePosB = painter.imageManager.getPattern(image.to);
  return !imagePosA || !imagePosB;
};
export const prepare = function (image, painter, program) {
  const context = painter.context;
  const gl = context.gl;
  const imagePosA = painter.imageManager.getPattern(image.from);
  const imagePosB = painter.imageManager.getPattern(image.to);
  assert(imagePosA && imagePosB);
  gl.uniform1i(program.uniforms.u_image, 0);
  gl.uniform2fv(program.uniforms.u_pattern_tl_a, imagePosA.tl);
  gl.uniform2fv(program.uniforms.u_pattern_br_a, imagePosA.br);
  gl.uniform2fv(program.uniforms.u_pattern_tl_b, imagePosB.tl);
  gl.uniform2fv(program.uniforms.u_pattern_br_b, imagePosB.br);
  const {
    width,
    height
  } = painter.imageManager.getPixelSize();
  gl.uniform2fv(program.uniforms.u_texsize, [width, height]);
  gl.uniform1f(program.uniforms.u_mix, image.t);
  gl.uniform2fv(program.uniforms.u_pattern_size_a, imagePosA.displaySize);
  gl.uniform2fv(program.uniforms.u_pattern_size_b, imagePosB.displaySize);
  gl.uniform1f(program.uniforms.u_scale_a, image.fromScale);
  gl.uniform1f(program.uniforms.u_scale_b, image.toScale);
  context.activeTexture.set(gl.TEXTURE0);
  painter.imageManager.bind(painter.context);
};
export const setPatternUniforms = function (tile, painter, program) {
  const gl = painter.context.gl;
  gl.uniform1f(program.uniforms.u_tile_units_to_pixels, 1 / pixelsToTileUnits(tile, 1, painter.transform.tileZoom));
  const numTiles = Math.pow(2, tile.tileID.overscaledZ);
  const tileSizeAtNearestZoom = tile.tileSize * Math.pow(2, painter.transform.tileZoom) / numTiles;
  const pixelX = tileSizeAtNearestZoom * (tile.tileID.canonical.x + tile.tileID.wrap * numTiles);
  const pixelY = tileSizeAtNearestZoom * tile.tileID.canonical.y; // split the pixel coord into two pairs of 16 bit numbers. The glsl spec only guarantees 16 bits of precision.

  gl.uniform2f(program.uniforms.u_pixel_coord_upper, pixelX >> 16, pixelY >> 16);
  gl.uniform2f(program.uniforms.u_pixel_coord_lower, pixelX & 0xFFFF, pixelY & 0xFFFF);
};