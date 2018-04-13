// @flow
import { extend } from '../util/util';
import Tile from './tile';

export type FeatureStates = {[feature_id: string]: {[key: string]: string | number | boolean }};
export type LayerFeatureStates = {[layer: string]: FeatureStates};

/** 
 * SourceFeatureState manages the state and state changes
 * to features in a source, separated by source layer.
 *
 * @private
*/
class SourceFeatureState {
    state: LayerFeatureStates;
    stateChanges: LayerFeatureStates;

    constructor() {
        this.state = {};
        this.stateChanges = {};
    }

    setState(feature: string, key: string, value: any, sourceLayer: string) {
        feature = String(feature);
        this.stateChanges[sourceLayer] = this.stateChanges[sourceLayer] || {};
        this.stateChanges[sourceLayer][feature] = this.stateChanges[sourceLayer][feature] || {};
        this.stateChanges[sourceLayer][feature][key] = value;
    }

    getState(feature: string, key?: string, sourceLayer: string) {
        feature = String(feature);
        const base = this.state[sourceLayer] || {};
        const changes = this.stateChanges[sourceLayer] || {};

        if (!key) {
            return extend({}, base[feature], changes[feature]);
        }
        if (changes[feature]) {
            return changes[feature][key];
        }
        if (base[feature]) {
            return base[feature][key];
        }
    }

    initializeTileState(tile: Tile) {
        tile.updateFeatureState(this.state);
    }

    coalesceChanges(tiles: {[any]: Tile}) {
        const changes: LayerFeatureStates = {};
        for (const sourceLayer in this.stateChanges) {
            this.state[sourceLayer]  = this.state[sourceLayer] || {};
            const layerStates = {};
            for (const id in this.stateChanges[sourceLayer]) {
                this.state[sourceLayer][id] = extend(
                                                {},
                                                this.state[sourceLayer][id],
                                                this.stateChanges[sourceLayer][id]);
                layerStates[id] = this.state[sourceLayer][id];
            }
            changes[sourceLayer] = layerStates;
        }
        this.stateChanges = {};
        if (Object.keys(changes).length === 0) return;

        for (const id in tiles) {
            const tile = tiles[id];
            tile.updateFeatureState(changes);
        }
    }
}

export default SourceFeatureState;
