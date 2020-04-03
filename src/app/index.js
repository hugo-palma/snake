'use strict';
import Board from './components/board.js';
import Score from './components/score.js'
import Controls from './components/Controls'
import HighScoresTable from "./components/highScoresTable";
import ReactDOM from 'react-dom'
import ScoreModel from './mobx-model/scoreModel'
import ControlsModel from './mobx-model/controlsModel'
import HighScoresTableModel from "./mobx-model/highScoresTableModel";
import {Provider} from 'mobx-react'
import highScoreProcess from './process/proc.highScore'

let scoreModel = ScoreModel.create({score: 2});
let controlsModel = ControlsModel.create({paused: true, backwards: false});
let highScoresTableModel = HighScoresTableModel.create({replaying: false});


ReactDOM.render(<Provider scoreModel={scoreModel} controlsModel={controlsModel} highScoresTableModel={highScoresTableModel}>
    <Board/><Controls/><Score/><HighScoresTable/></Provider>, document.getElementById('snakeBoardContainer'));
