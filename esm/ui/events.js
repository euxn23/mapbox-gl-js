import { Event } from '../util/evented';
import DOM from '../util/dom';
import Point from '@mapbox/point-geometry';
import { extend } from '../util/util';

/**
 * `MapMouseEvent` is the event type for mouse-related map events.
 * @extends {Object}
 */
export class MapMouseEvent extends Event {
  /**
   * The event type.
   */

  /**
   * The `Map` object that fired the event.
   */

  /**
   * The DOM event which caused the map event.
   */

  /**
   * The pixel coordinates of the mouse cursor, relative to the map and measured from the top left corner.
   */

  /**
   * The geographic location on the map of the mouse cursor.
   */

  /**
   * Prevents subsequent default processing of the event by the map.
   *
   * Calling this method will prevent the following default map behaviors:
   *
   *   * On `mousedown` events, the behavior of {@link DragPanHandler}
   *   * On `mousedown` events, the behavior of {@link DragRotateHandler}
   *   * On `mousedown` events, the behavior of {@link BoxZoomHandler}
   *   * On `dblclick` events, the behavior of {@link DoubleClickZoomHandler}
   *
   */
  preventDefault() {
    this._defaultPrevented = true;
  }
  /**
   * `true` if `preventDefault` has been called.
   */


  get defaultPrevented() {
    return this._defaultPrevented;
  }

  /**
   * @private
   */
  constructor(type, map, originalEvent, data = {}) {
    const point = DOM.mousePos(map.getCanvasContainer(), originalEvent);
    const lngLat = map.unproject(point);
    super(type, extend({
      point,
      lngLat,
      originalEvent
    }, data));
    this._defaultPrevented = false;
  }

}
/**
 * `MapTouchEvent` is the event type for touch-related map events.
 * @extends {Object}
 */

export class MapTouchEvent extends Event {
  /**
   * The event type.
   */

  /**
   * The `Map` object that fired the event.
   */

  /**
   * The DOM event which caused the map event.
   */

  /**
   * The geographic location on the map of the center of the touch event points.
   */

  /**
   * The pixel coordinates of the center of the touch event points, relative to the map and measured from the top left
   * corner.
   */

  /**
   * The array of pixel coordinates corresponding to a
   * [touch event's `touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches) property.
   */

  /**
   * The geographical locations on the map corresponding to a
   * [touch event's `touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches) property.
   */

  /**
   * Prevents subsequent default processing of the event by the map.
   *
   * Calling this method will prevent the following default map behaviors:
   *
   *   * On `touchstart` events, the behavior of {@link DragPanHandler}
   *   * On `touchstart` events, the behavior of {@link TouchZoomRotateHandler}
   *
   */
  preventDefault() {
    this._defaultPrevented = true;
  }
  /**
   * `true` if `preventDefault` has been called.
   */


  get defaultPrevented() {
    return this._defaultPrevented;
  }

  /**
   * @private
   */
  constructor(type, map, originalEvent) {
    const points = DOM.touchPos(map.getCanvasContainer(), originalEvent);
    const lngLats = points.map(t => map.unproject(t));
    const point = points.reduce((prev, curr, i, arr) => {
      return prev.add(curr.div(arr.length));
    }, new Point(0, 0));
    const lngLat = map.unproject(point);
    super(type, {
      points,
      point,
      lngLats,
      lngLat,
      originalEvent
    });
    this._defaultPrevented = false;
  }

}
/**
 * `MapWheelEvent` is the event type for the `wheel` map event.
 * @extends {Object}
 */

export class MapWheelEvent extends Event {
  /**
   * The event type.
   */

  /**
   * The `Map` object that fired the event.
   */

  /**
   * The DOM event which caused the map event.
   */

  /**
   * Prevents subsequent default processing of the event by the map.
   *
   * Calling this method will prevent the the behavior of {@link ScrollZoomHandler}.
   */
  preventDefault() {
    this._defaultPrevented = true;
  }
  /**
   * `true` if `preventDefault` has been called.
   */


  get defaultPrevented() {
    return this._defaultPrevented;
  }

  /**
   * @private
   */
  constructor(type, map, originalEvent) {
    super(type, {
      originalEvent
    });
    this._defaultPrevented = false;
  }

}
/**
 * @typedef {Object} MapBoxZoomEvent
 * @property {MouseEvent} originalEvent
 * @property {LngLatBounds} boxZoomBounds The bounding box of the "box zoom" interaction.
 *   This property is only provided for `boxzoomend` events.
 */