import {detach, isAlive, types} from 'mobx-state-tree';
import BoardElementModel from "./boardElementModel";

const SnakeModel = types.model('SnakeModel', {
    alive: types.boolean,
    direction: types.enumeration('direction', ['up', 'right', 'down', 'left']),
    isDead: types.boolean,
    positions: types.array(BoardElementModel),
}).actions(self => ({
    addPosition(boardElementModel) {
        self.positions.push(boardElementModel)
    },
    removeLastElement() {
        detach(self.positions[0])
    }
})).views(self => ({
    getDirection() {
        return self.direction
    },
    getHeadPosition() {
        return self.positions[self.positions.length - 1]
    },
    getPositions() {
        return self.positions
    },
}));

export default SnakeModel
