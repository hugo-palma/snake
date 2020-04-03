import BoardElement from './boardElement.js';
import BoardElementModel from '../mobx-model/boardElementModel';
import SnakeModel from "../mobx-model/snakeModel";
import {inject, observer} from 'mobx-react';
import highScoreProcess from '../process/proc.highScore';
import statesProcess from '../process/proc.states';
import boardProcess from '../process/proc.board';
import config from "../config/snakeConfig";

let states = [];
let currentStateIndex = -1;
let replayingFrame = -1;

const boundX = config.boardBoundX;
const boundY = config.boardBoundY;
const board = new Array(boundX);
const movementInterval = config.movementInterval;
let movementIntervalId;

let scoreModel;
let controlsModel;
let highScoresTableModel;
let snakeModel = SnakeModel.create({alive: true, direction: 'right', isDead: false, positions: []});

let boardElementModels = new Array(boundX);

@inject('scoreModel', 'controlsModel', 'highScoresTableModel') @observer
class Board extends React.Component {
    constructor(props) {
        super(props);
        scoreModel = this.props.scoreModel;
        controlsModel = this.props.controlsModel;
        highScoresTableModel = this.props.highScoresTableModel;
        document.addEventListener('keydown', keyboardEventHandler);
        movementIntervalId = setInterval(boardExecution, movementInterval);
        // creating matrix to store boardElement components and boardElementModels
        for (let x = 0; x < boundX; x++) {
            board[x] = new Array(boundY);
            boardElementModels[x] = new Array(boundY);
        }
        for (let x = 0; x < boundX; x++) {
            for (let y = 0; y < boundY; y++) {
                boardElementModels[x][y] = BoardElementModel.create({
                    type: 'empty',
                    boardPositionX: x,
                    boardPositionY: y
                });
                board[x][y] = <BoardElement boardElementModel={boardElementModels[x][y]}></BoardElement>;
            }
        }
    }

    render() {
        return boardBody(board);
    }

    componentDidMount() {
        const initialPositions = [[0, 0], [0, 1]];
        boardProcess.placeInitialSnake(boardElementModels, snakeModel, initialPositions);
        boardProcess.placeRandomPoint(boundX, boundY, snakeModel, boardElementModels);
        currentStateIndex = statesProcess.addSnapshotToStates(currentStateIndex, statesProcess.getSnapshotFromModel(snakeModel), states)
    }
}

function boardBody(board) {
    // Creating formatted rows from matrix of BoardElements
    return <div className='container' style={{display: 'inline-block'}}>
        {
            board.map((row, i) => <div key={i}>{row}</div>)
        }
        <br/>
    </div>
}

function keyboardEventHandler(event) {
    if (event.key === 'ArrowUp' && !snakeModel.hasDirectionDown()) {
        snakeModel.setDirectionUp()
    } else if (event.key === 'ArrowDown' && !snakeModel.hasDirectionUp()) {
        snakeModel.setDirectionDown()
    } else if (event.key === 'ArrowLeft' && !snakeModel.hasDirectionRight()) {
        snakeModel.setDirectionLeft()
    } else if (event.key === 'ArrowRight' && !snakeModel.hasDirectionLeft()) {
        snakeModel.setDirectionRight()
    }
}

function boardExecution() {
    if (highScoresTableModel.isReplaying()) {
        replay(highScoresTableModel)
    }
    else if (snakeModel.getDirection() && controlsModel.isPaused() === false && controlsModel.isGoingBackwards() === false) {
        processMovement()
    } else if (controlsModel.isGoingBackwards() === true) {
        currentStateIndex = statesProcess.applyPreviousState(currentStateIndex, states, snakeModel);
        boardProcess.refreshBoard(snakeModel.getPositions(), boardElementModels, snakeModel.getPointPosition());
        highScoreProcess.refreshScore(snakeModel, scoreModel)
    }
}

function processMovement() {
    let nextPosition = [...snakeModel.getNextPosition()];
    boardProcess.compensateBoardBounds(nextPosition, boundX, boundY);
    if (boardProcess.hasClashed(snakeModel, nextPosition)) {
        // snake died, removing interval execution
        clearInterval(movementIntervalId);
        // sending score to server
        const response = highScoreProcess.postHighScore(scoreModel.getUser(), scoreModel.status(), states).then((response) => {
            highScoresTableModel.addHighScoreElement(scoreModel.status(), states, scoreModel.getUser())
        });
        return;
    }
    snakeModel.addPosition(nextPosition);
    if (boardProcess.canEat(nextPosition, snakeModel.getPointPosition())) {
        boardProcess.eatPoint(boardElementModels, snakeModel.getPointPosition(), scoreModel);
        boardProcess.placeRandomPoint(boundX, boundY, snakeModel, boardElementModels);
    } else {
        boardProcess.makeMovement(snakeModel, boardElementModels)
    }
    currentStateIndex = statesProcess.addSnapshotToStates(currentStateIndex, statesProcess.getSnapshotFromModel(snakeModel), states);
}

function replay(highScoresTableModel) {
    const replayingIndex = highScoresTableModel.getReplayIndex();
    const highScoreModel = highScoresTableModel.getHighScoresArray()[replayingIndex];
    replayingFrame = statesProcess.applyReplayState(replayingFrame, highScoreModel.getStates(), snakeModel);
    boardProcess.refreshBoard(snakeModel.getPositions(), boardElementModels, snakeModel.getPointPosition());
    highScoreProcess.refreshScore(snakeModel, scoreModel);
}

export default Board
