//import request from 'request-promise'
import axios from 'axios';
import regeneratorRuntime from 'regenerator-runtime'

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
    const response  = await axios.post(API_URL + HIGH_SCORE_URL, highScoreRequest);
    if(response.data){
        return response.data
    }
}
function refreshScore(snakeModel, scoreModel) {
    scoreModel.setScore(snakeModel.getLength());
}
export default { getHighScores, postHighScore, refreshScore }
