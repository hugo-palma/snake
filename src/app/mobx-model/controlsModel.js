import { types } from 'mobx-state-tree';

const ControlsModel = types.model('ControlsModel', {
    paused: types.boolean,
    backwards: types.boolean
}).actions(self => ({
    togglePause() {
        self.paused = !self.paused
    },
    toggleBackwards() {
        self.backwards = !self.backwards
    }
})).views(self => ({
    isPaused() {
        return self.paused
    },
    isGoingBackwards() {
        return self.backwards
    }
}));

export default ControlsModel