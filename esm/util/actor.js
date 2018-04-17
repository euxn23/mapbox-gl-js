import { bindAll } from './util';
import { serialize, deserialize } from './web_worker_transfer';

/**
 * An implementation of the [Actor design pattern](http://en.wikipedia.org/wiki/Actor_model)
 * that maintains the relationship between asynchronous tasks and the objects
 * that spin them off - in this case, tasks like parsing parts of styles,
 * owned by the styles
 *
 * @param {WebWorker} target
 * @param {WebWorker} parent
 * @param {string|number} mapId A unique identifier for the Map instance using this Actor.
 * @private
 */
class Actor {
  constructor(target, parent, mapId) {
    this.target = target;
    this.parent = parent;
    this.mapId = mapId;
    this.callbacks = {};
    this.callbackID = 0;
    bindAll(['receive'], this);
    this.target.addEventListener('message', this.receive, false);
  }
  /**
   * Sends a message from a main-thread map to a Worker or from a Worker back to
   * a main-thread map instance.
   *
   * @param type The name of the target method to invoke or '[source-type].[source-name].name' for a method on a WorkerSource.
   * @param targetMapId A particular mapId to which to send this message.
   * @private
   */


  send(type, data, callback, targetMapId) {
    const id = callback ? `${this.mapId}:${this.callbackID++}` : null;
    if (callback) this.callbacks[id] = callback;
    const buffers = [];
    this.target.postMessage({
      targetMapId: targetMapId,
      sourceMapId: this.mapId,
      type: type,
      id: String(id),
      data: serialize(data, buffers)
    }, buffers);
  }

  receive(message) {
    const data = message.data,
          id = data.id;
    let callback;
    if (data.targetMapId && this.mapId !== data.targetMapId) return;

    const done = (err, data) => {
      const buffers = [];
      this.target.postMessage({
        sourceMapId: this.mapId,
        type: '<response>',
        id: String(id),
        error: err ? serialize(err) : null,
        data: serialize(data, buffers)
      }, buffers);
    };

    if (data.type === '<response>') {
      callback = this.callbacks[data.id];
      delete this.callbacks[data.id];

      if (callback && data.error) {
        callback(deserialize(data.error));
      } else if (callback) {
        callback(null, deserialize(data.data));
      }
    } else if (typeof data.id !== 'undefined' && this.parent[data.type]) {
      // data.type == 'loadTile', 'removeTile', etc.
      this.parent[data.type](data.sourceMapId, deserialize(data.data), done);
    } else if (typeof data.id !== 'undefined' && this.parent.getWorkerSource) {
      // data.type == sourcetype.sourcename.method
      const keys = data.type.split('.');
      const workerSource = this.parent.getWorkerSource(data.sourceMapId, keys[0], keys[1]);
      workerSource[keys[2]](deserialize(data.data), done);
    } else {
      this.parent[data.type](deserialize(data.data));
    }
  }

  remove() {
    this.target.removeEventListener('message', this.receive, false);
  }

}

export default Actor;