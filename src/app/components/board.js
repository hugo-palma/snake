import BoardElementModel from '../mobx-model/boardElementModel'
import BoardElement from './boardElement.js';
import SnakeModel from "../mobx-model/snakeModel";
import { inject, observer } from 'mobx-react';
import { applySnapshot, onSnapshot } from "mobx-state-tree"

let states = []
let currentFrame = -1

const directions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}
const boundX = 7
const boundY = 7
const board = new Array(boundX)
const movementInterval = 1000
let pointPosition
let movementIntervalId
let randomPointX, randomPointY
let currentDirection

let scoreModel;
let controlsModel;
let snakeModel = SnakeModel.create({alive: true, direction: 'right', isDead: false, positions: []});

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
            boardElementModels[x] = new Array(boundY)
        }
        for(let x = 0; x < boundX; x++){
            for(let y = 0; y < boundY; y++){
                boardElementModels[x][y] = BoardElementModel.create({type: 'empty', boardPositionX: x, boardPositionY: y})
                board[x][y] = <BoardElement boardElementModel={boardElementModels[x][y]}></BoardElement>;
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
    boardElementModels[4][4].setType('body')
    boardElementModels[4][5].setType('body')
    currentDirection = directions.RIGHT
    snakeModel.addPosition(boardElementModels[4][4])
    snakeModel.addPosition(boardElementModels[4][5])
}
function boardBody(board) {
    return <div>{board.map((row, i) => <div key={i}>{row}</div>)}</div>
}
function snakeMovement() {
    console.log(`snake has ${states.length} states`)
    if(currentDirection && controlsModel.isPaused() === false && controlsModel.isGoingBackwards() === false){
        evaluateMovement()
    }
    else if(controlsModel.isGoingBackwards() === true){
        previousState()
    }
}

function evaluateMovement() {
    //console.log(`antes: ${snakeModel.getHeadPosition().getBoardPositionX()}, ${snakeModel.getHeadPosition().getBoardPositionY()}`)
    let temporal = [snakeModel.getHeadPosition().getBoardPositionX(), snakeModel.getHeadPosition().getBoardPositionY()];
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
    //console.log(`despues: ${snakeModel.getHeadPosition().getBoardPositionX()}, ${snakeModel.getHeadPosition().getBoardPositionY()}`)
    evaluateClash(temporal, snakeModel.getPositions())
    snakeModel.addPosition(boardElementModels[temporal[0]][temporal[1]])
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
    // changing head element color
    snakeModel.getHeadPosition().setType('body')
    // changing tail element color
    snakeModel.getPositions()[0].setType('empty')
    snakeModel.removeLastElement()
}
function placeRandomPoint() {
    randomPointX = Math.floor(Math.random() * boundX);
    randomPointY = Math.floor(Math.random() * boundY);
    if(isPositionOccupied(randomPointX, randomPointY, snakeModel.getPositions())){
        placeRandomPoint()
    }
    else{
        pointPosition = [randomPointX, randomPointY]
        boardElementModels[randomPointX][randomPointY].setType('point')
    }
}
function isPositionOccupied(randomPointX, randomPointY, snakePositions) {
    const possiblePoint = snakePositions.find((v) => v === boardElementModels[randomPointX][randomPointY])
    if(possiblePoint)
    {
        return true
    }
    return false
}

onSnapshot(snakeModel, snapshot => {
    if (currentFrame === states.length - 1) {
        currentFrame++
        states.push(snapshot)
    }
})

export function previousState() {
    console.log(`left ${states.length}`)
    if (currentFrame === 0) return
    currentFrame--
    applySnapshot(snakeModel, states[currentFrame])
    console.log(snakeModel)
}

export function nextState() {
    if (currentFrame === states.length - 1) return
    currentFrame++
    applySnapshot(snakeModel, states[currentFrame])
}

export default Board
