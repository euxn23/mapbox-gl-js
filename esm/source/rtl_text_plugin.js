import { Event, Evented } from '../util/evented';
let pluginRequested = false;
let pluginURL = null;
export const evented = new Evented();

let _errorCallback;

export const registerForPluginAvailability = function (callback) {
  if (pluginURL) {
    callback({
      pluginURL: pluginURL,
      errorCallback: _errorCallback
    });
  } else {
    evented.once('pluginAvailable', callback);
  }

  return callback;
}; // Only exposed for tests

export const clearRTLTextPlugin = function () {
  pluginRequested = false;
  pluginURL = null;
};
export const setRTLTextPlugin = function (url, callback) {
  if (pluginRequested) {
    throw new Error('setRTLTextPlugin cannot be called multiple times.');
  }

  pluginRequested = true;
  pluginURL = url;
  evented.fire(new Event('pluginAvailable', {
    pluginURL: pluginURL,
    errorCallback: callback
  }));
  _errorCallback = callback;
};
export const plugin = {
  applyArabicShaping: null,
  processBidirectionalText: null
};