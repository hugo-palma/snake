import BoardElementModel from '../mobx-model/boardElementModel'
import BoardElement from './boardElement.js';
import SnakeModel from "../mobx-model/snakeModel";
import { inject, observer } from 'mobx-react';
import {applySnapshot, getSnapshot, onSnapshot} from "mobx-state-tree"
import highScoreProcess from '../process/proc.highScore'

let states = [];
let currentFrame = -1;

const directions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}
const boundX = 7;
const boundY = 7;
const board = new Array(boundX);
const movementInterval = 1000;
let movementIntervalId;
let randomPointX, randomPointY;

let scoreModel;
let controlsModel;
let snakeModel = SnakeModel.create({alive: true, direction: 'right', isDead: false, positions: []});

let boardElementModels = new Array(boundX)

@inject('scoreModel', 'controlsModel') @observer
class Board extends React.Component {
    constructor(props) {
        super(props);
        scoreModel = this.props.scoreModel;
        controlsModel = this.props.controlsModel;
        document.addEventListener('keydown', keyboardEventHandler);
        movementIntervalId = setInterval(snakeMovement, movementInterval);
        for(let x = 0; x < boundX; x++){
            board[x] = new Array(boundY);
            boardElementModels[x] = new Array(boundY);
        }
        for(let x = 0; x < boundX; x++){
            for(let y = 0; y < boundY; y++){
                boardElementModels[x][y] = BoardElementModel.create({type: 'empty', boardPositionX: x, boardPositionY: y});
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
        addSnapshot(getSnapshot(snakeModel))
    }
}
function keyboardEventHandler(event){
    if(event.key === 'ArrowUp' && snakeModel.getDirection() !== directions.DOWN) {
        snakeModel.setDirection(directions.UP)
    }
    else if(event.key === 'ArrowDown' && snakeModel.getDirection() !== directions.UP) {
        snakeModel.setDirection(directions.DOWN)
    }
    else if(event.key === 'ArrowLeft' && snakeModel.getDirection() !== directions.RIGHT) {
        snakeModel.setDirection(directions.LEFT)
    }
    else if(event.key === 'ArrowRight' && snakeModel.getDirection() !== directions.LEFT) {
        snakeModel.setDirection(directions.RIGHT)
    }
}
function placeInitialSnake() {
    boardElementModels[4][4].setType('body');
    boardElementModels[4][5].setType('body');
    snakeModel.setDirection(directions.RIGHT);
    snakeModel.addPosition([4,4]);
    snakeModel.addPosition([4,5]);
}
function boardBody(board) {
    return <div style={{display: 'inline-block'}}>{board.map((row, i) => <div key={i}>{row}</div>)}</div>
}
function snakeMovement() {
    if(snakeModel.getDirection() && controlsModel.isPaused() === false && controlsModel.isGoingBackwards() === false){
        evaluateMovement()
    }
    else if(controlsModel.isGoingBackwards() === true){
        previousState();
        refreshSnake(snakeModel.getPositions(), boardElementModels, snakeModel.getPointPosition())
    }
}

function evaluateMovement() {
    let temporal = [...snakeModel.getHeadPosition()];
    if(snakeModel.getDirection() === directions.UP) {
        temporal[0] -= 1
    }
    else if(snakeModel.getDirection() === directions.DOWN) {
        temporal[0] += 1
    }
    else if(snakeModel.getDirection() === directions.LEFT) {
        temporal[1] -= 1
    }
    else if(snakeModel.getDirection() === directions.RIGHT) {
        temporal[1] += 1
    }
    compensateBoardBounds(temporal);
    evaluateClash(temporal, snakeModel.getPositions());
    snakeModel.addPosition(temporal);
    if(canEat(temporal, snakeModel.getPointPosition())){
        eatPoint(snakeModel.getPointPosition());
        placeRandomPoint();
    }
    else{
        makeMovement()
    }
    addSnapshot(getSnapshot(snakeModel))
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
function eatPoint(position) {
    scoreModel.addScore();
    boardElementModels[position[0]][position[1]].setType('body')

}
function evaluateClash(newSnakePosition, snakePositions) {
    if(isPositionOccupied(newSnakePosition[0], newSnakePosition[1], snakePositions))
    {
        // snake died
        clearInterval(movementIntervalId)
        highScoreProcess.postHighScore(scoreModel.getUser(), scoreModel.status(), states)
    }
}
function canEat(temporal, pointPosition)
{
    return (temporal[0] === pointPosition[0]) && (temporal[1] === pointPosition[1])
}
function makeMovement() {
    // changing head element color
    boardElementModels[snakeModel.getHeadPosition()[0]][snakeModel.getHeadPosition()[1]].setType('body')
    // changing tail element color
    boardElementModels[snakeModel.getPositions()[0][0]][snakeModel.getPositions()[0][1]].setType('empty')
    snakeModel.removeLastElement()
}
function placeRandomPoint() {
    randomPointX = Math.floor(Math.random() * boundX);
    randomPointY = Math.floor(Math.random() * boundY);
    if(isPositionOccupied(randomPointX, randomPointY, snakeModel.getPositions())){
        placeRandomPoint()
    }
    else{
        snakeModel.addPointPosition([randomPointX, randomPointY]);
        boardElementModels[randomPointX][randomPointY].setType('point');
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
function refreshSnake(snakePositions, boardElementModels, pointPosition){
    boardElementModels.forEach((x) => {
        x.forEach((y) => {
            boardElementModels[y.getBoardPositionX()][y.getBoardPositionY()].setType('empty')
        })
    });
    snakePositions.forEach((p) => {
        boardElementModels[p[0]][p[1]].setType('body')
    });
    boardElementModels[pointPosition[0]][pointPosition[1]].setType('point');
    scoreModel.setScore(snakeModel.getLength());
}
function addSnapshot(snapshot) {
    if(currentFrame === states.length - 1) {
        if(snapshot) {
            currentFrame++;
            states.push(snapshot)
        }
    }
}

export function previousState() {
    if (currentFrame <= 0) return;
    currentFrame -= 1;
    states.pop();
    applySnapshot(snakeModel, states[currentFrame]);
}

export function nextState() {
    if (currentFrame === states.length - 1) return
    currentFrame++
    applySnapshot(snakeModel, states[currentFrame])
}

export default Board
