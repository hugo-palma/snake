//import request from 'request-promise'
import axios from 'axios';
import regeneratorRuntime from 'regenerator-runtime'
import HighScoresTableModel from "../mobx-model/highScoresTableModel";

const API_URL = 'http://localhost:3000/api';
const HIGH_SCORE_URL = '/highScore';
async function getHighScores(highScoresTableModel) {
    const response = await axios.get(API_URL + HIGH_SCORE_URL);
    const highScores = response.data;
    highScoresTableModel.setHighScoresArrayFroDbmObject(highScores);
    return highScoresTableModel
}
async function postHighScore(email, scoreValue, states){
    const highScoreRequest = {
        user: email,
        scoreValue: scoreValue,
        states
    };
    console.log('sending high score');
    const response  = await axios.post(API_URL + HIGH_SCORE_URL, highScoreRequest);
    if(response.data){
        return response.data
    }
}
export default { getHighScores, postHighScore }
