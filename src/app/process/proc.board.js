function placeInitialSnake(boardElementModels, snakeModel, positions) {
    positions.forEach((p) => {
        boardElementModels[p[0]][p[1]].setType('body');
        snakeModel.addPosition(p);
    });
}
function compensateBoardBounds(temporal, boundX, boundY) {
    if(temporal[0] === -1) {
        temporal[0] = boundX - 1
    }
    if(temporal[0] === boundX) {
        temporal[0] = 0
    }
    if(temporal[1] === -1) {
        temporal[1] = boundY - 1
    }
    if(temporal[1] === boundY) {
        temporal[1] = 0
    }
}
function placeRandomPoint(boundX, boundY, snakeModel, boardElementModels) {
    const randomPointX = Math.floor(Math.random() * (boundX - 1));
    const randomPointY = Math.floor(Math.random() * (boundY - 1));
    if(snakeModel.isPositionOccupied(randomPointX, randomPointY)){
        placeRandomPoint(boundX, boundY, snakeModel, boardElementModels)
    }
    else{
        snakeModel.addPointPosition([randomPointX, randomPointY]);
        boardElementModels[randomPointX][randomPointY].setType('point');
    }
}

function makeMovement(snakeModel, boardElementModels) {
    // changing head element color
    boardElementModels[snakeModel.getHeadPosition()[0]][snakeModel.getHeadPosition()[1]].setType('body');
    // changing tail element color
    boardElementModels[snakeModel.getPositions()[0][0]][snakeModel.getPositions()[0][1]].setType('empty');
    snakeModel.removeLastElement()
}

function refreshBoard(snakePositions, boardElementModels, pointPosition){
    boardElementModels.forEach((x) => {
        x.forEach((y) => {
            boardElementModels[y.getBoardPositionX()][y.getBoardPositionY()].setType('empty')
        })
    });
    snakePositions.forEach((p) => {
        boardElementModels[p[0]][p[1]].setType('body')
    });
    boardElementModels[pointPosition[0]][pointPosition[1]].setType('point');
}

function canEat(targetPosition, currentPointPosition)
{
    return (targetPosition[0] === currentPointPosition[0]) && (targetPosition[1] === currentPointPosition[1])
}

function eatPoint(boardElementModels, pointPosition, scoreModel) {
    boardElementModels[pointPosition[0]][pointPosition[1]].setType('body');
    scoreModel.addScore();
}

function hasClashed(snakeModel, nextPosition) {
    return snakeModel.isPositionOccupied(nextPosition[0], nextPosition[1])
}
export default { compensateBoardBounds, placeRandomPoint, makeMovement, refreshBoard, placeInitialSnake, canEat, eatPoint, hasClashed }
