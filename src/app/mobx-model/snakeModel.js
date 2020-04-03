import {detach, isAlive, types} from 'mobx-state-tree';

const SnakeModel = types.model('SnakeModel', {
    alive: types.boolean,
    direction: types.enumeration('direction', ['up', 'right', 'down', 'left']),
    positions: types.array(types.array(types.number)),
    pointPosition: types.array(types.number)
}).actions(self => ({
    addPosition(newPosition) {
        self.positions.push(newPosition)
    },
    addPointPosition(newPointPosition) {
        self.pointPosition = newPointPosition
    },
    removeLastElement() {
        detach(self.positions[0])
    },
    setDirection(newDirection) {
        self.direction = newDirection
    },
    setpointPosition(newPointPosition) {
        self.direction = newPointPosition
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
    getPointPosition() {
        return self.pointPosition
    },
    getLength() {
        return self.positions.length
    }
}));

export default SnakeModel
