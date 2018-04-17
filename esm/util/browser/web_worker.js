import window from '../window';
import mapboxgl from '../../';
export default function () {
  return new window.Worker(mapboxgl.workerUrl);
}