import {detach, isAlive, types} from 'mobx-state-tree';
const directions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
};
const SnakeModel = types.model('SnakeModel', {
    alive: types.boolean,
    direction: types.enumeration('direction', [directions.UP, directions.RIGHT, directions.DOWN, directions.LEFT]),
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
    setDirectionUp() {
        self.direction = directions.UP
    },
    setDirectionRight() {
        self.direction = directions.RIGHT
    },
    setDirectionDown() {
        self.direction = directions.DOWN
    },
    setDirectionLeft() {
        self.direction = directions.LEFT
    },
    getNextPosition() {
        const headPosition = self.positions[self.positions.length - 1];
        if(self.direction === directions.UP) {
            return [headPosition[0] - 1, headPosition[1]]
        }
        else if(self.direction  === directions.DOWN) {
            return [headPosition[0] + 1, headPosition[1]];
        }
        else if(self.direction === directions.LEFT) {
            return [headPosition[0], headPosition[1] - 1]
        }
        else if(self.direction === directions.RIGHT) {
            return [headPosition[0], headPosition[1] + 1]
        }
        return headPosition;
    },
    isPositionOccupied(randomPointX, randomPointY) {
        const possiblePoint = self.positions.find((v) => v[0] === randomPointX && v[1] === randomPointY)
        if(possiblePoint)
        {
            return true
        }
        return false
    },
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
    },
    hasDirectionUp() {
        return directions.UP === self.direction
    },
    hasDirectionRight() {
        return directions.RIGHT === self.direction
    },
    hasDirectionDown() {
        return directions.DOWN === self.direction
    },
    hasDirectionLeft() {
        return directions.LEFT === self.direction
    },
}));

export default SnakeModel
