'use strict';
import Board from './components/board.js';
import Score from './components/score.js'
import Controls from './components/Controls'
import ReactDOM from 'react-dom'
import ScoreModel from './mobx-model/scoreModel'
import ControlsModel from './mobx-model/controlsModel'
import { Provider } from 'mobx-react'

let scoreModel = ScoreModel.create({score: 2})
let controlsModel = ControlsModel.create({paused: false, backwards: false})

ReactDOM.render(<Provider scoreModel={scoreModel} controlsModel={controlsModel}><Board /><Score/><Controls/></Provider>, document.getElementById('snakeBoardContainer'))