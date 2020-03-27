'use strict';
import BoardElementModel from '../mobx-model/boardElementModel'
import BoardElement from './boardElement.js';
import { inject, observer } from 'mobx-react';
import Snake from './snake'

const directions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}
const boundX = 15
const boundY = 15
const board = new Array(boundX)
const snakePositions = new Array()
const movementInterval = 1000
let pointPosition
let movementIntervalId
let randomPointX, randomPointY
let currentDirection
let headPosition

let scoreModel
let controlsModel

let boardElementModels = new Array(boundX)

@inject('scoreModel', 'controlsModel') @observer
class Board extends React.Component {
    constructor(props) {
        super(props)
        scoreModel = this.props.scoreModel
        controlsModel = this.props.controlsModel
        document.addEventListener('keydown', keyboardEventHandler);
        movementIntervalId = setInterval(snakeMovement, movementInterval);
        for(let x = 0; x < boundX; x++){
            board[x] = new Array(boundY)
            boardElementModels
        [x] = new Array(boundY)
        }
        for(let x = 0; x < boundX; x++){
            for(let y = 0; y < boundY; y++){
                boardElementModels
            [x][y] = BoardElementModel.create({type: 'empty'})
                board[x][y] = <BoardElement selected={false} boardElementModel={boardElementModels
            [x][y]}></BoardElement>;
            }
        }
    }
    render() {
        return boardBody(board);
    }
    componentDidMount() {
        placeInitialSnake()
        placeRandomPoint()
    }
}
function keyboardEventHandler(event){
    if(event.key === 'ArrowUp' && currentDirection !== directions.DOWN) {
        currentDirection = directions.UP
    }
    else if(event.key === 'ArrowDown' && currentDirection !== directions.UP) {
        currentDirection = directions.DOWN
    }
    else if(event.key === 'ArrowLeft' && currentDirection !== directions.RIGHT) {
        currentDirection = directions.LEFT
    }
    else if(event.key === 'ArrowRight' && currentDirection !== directions.LEFT) {
        currentDirection = directions.RIGHT
    }
}
function placeInitialSnake() {
    snakePositions.push([4,4])
    snakePositions.push([4,5])
    console.log(snakePositions[snakePositions.length -1])
    boardElementModels[4][4].setType('body')
    boardElementModels[4][5].setType('body')
    headPosition = [4,5]
    currentDirection = directions.RIGHT
}
function boardBody(board) {
    return <div>{board.map((row, i) => <div key={i}>{row}</div>)}</div>
}
function snakeMovement() {
    if(currentDirection && controlsModel.isPaused() === false){
        evaluateMovement()
    }
}

function evaluateMovement() {
    let temporal = [headPosition[0], headPosition[1]]
    if(currentDirection === directions.UP) {
        temporal[0] -= 1
    }
    else if(currentDirection === directions.DOWN) {
        temporal[0] += 1
    }
    else if(currentDirection === directions.LEFT) {
        temporal[1] -= 1
    }
    else if(currentDirection === directions.RIGHT) {
        temporal[1] += 1
    }
    compensateBoardBounds(temporal)
    evaluateClash(temporal, snakePositions)
    headPosition = temporal
    snakePositions.push(temporal)
    if(canEat(temporal, pointPosition)){
        eatPoint()
        placeRandomPoint()
    }
    else{
        makeMovement()
    }  
}
function compensateBoardBounds(temporal) {
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
function eatPoint() {
    scoreModel.addScore()
}
function evaluateClash(newSnakePosition, snakePositions) {
    if(isPositionOccupied(newSnakePosition[0], newSnakePosition[1], snakePositions))
    {
        // snake died
        clearInterval(movementIntervalId)
    }
}
function canEat(temporal, pointPosition)
{
    return (temporal[0] === pointPosition[0]) && (temporal[1] === pointPosition[1])
}
function makeMovement() {
    let lastIndex  = snakePositions.length -1
    // changing head element color
    boardElementModels[snakePositions[lastIndex][0]][snakePositions[lastIndex][1]].setType('body')
    // changing tail element color
    boardElementModels[snakePositions[0][0]][snakePositions[0][1]].setType('empty')
    snakePositions.shift()
}
function placeRandomPoint() {
    randomPointX = Math.floor(Math.random() * boundX);
    randomPointY = Math.floor(Math.random() * boundY);
    if(isPositionOccupied(randomPointX, randomPointY, snakePositions)){
        placeRandomPoint()
    }
    else{
        pointPosition = [randomPointX, randomPointY]
        boardElementModels[randomPointX][randomPointY].setType('point')
    }
}
function isPositionOccupied(randomPointX, randomPointY, snakePositions) {
    const possiblePoint = snakePositions.find((v) => v[0] === randomPointX && v[1] === randomPointY)
    if(possiblePoint)
    {
        return true
    }
    return false
}

export default Board