//import request from 'request-promise'
import axios from 'axios';
import regeneratorRuntime from 'regenerator-runtime'

const API_URL = 'http://localhost:3000/api';
const HIGH_SCORE_URL = '/highScore';
async function getHighScores() {
    console.log('Obtaining high scores')
    const response = await axios.get(API_URL + HIGH_SCORE_URL);
    const highScores = response.data;
    console.log('scores');
    console.log(highScores)
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
