import {detach, types} from "mobx-state-tree";
import SnakeModel from "./snakeModel";
import HighScoreElementModel from "./highScoreElementModel";
import moment from "moment";

const HighScoresTableModel = types.model('HighScoresTableModel', {
    highScoresArray: types.optional(types.array(HighScoreElementModel), []),
    replaying: types.maybeNull(types.boolean),
    replayIndex: types.maybeNull(types.number)
}).actions(self => ({
    setHighScoresArrayFroDbmObject(highScoresObjects) {
        highScoresObjects.forEach((highScoresObject) => {
            const highScore = HighScoreElementModel.create({
                scoreNumber: highScoresObject.scoreNumber || highScoresObjects.indexOf(highScoresObject) + 1,
                user: highScoresObject.user,
                scoreValue: highScoresObject.scoreValue,
                date: moment(highScoresObject.date).toDate(),
                states: highScoresObject.states.map((s) => {
                    return SnakeModel.create({...s});
                }),
            });
            if(!self.highScoresArray)
            {
                self.highScoresArray = []
            }
            self.highScoresArray.push(highScore)
        })
    },
    detachState(state, scoreIndex) {
        const states = self.highScoresArray[scoreIndex].getStates();
        const stateIndex = states.indexOf(state);
        detach(states[stateIndex])
    },
    setHighScoresArray(newHighScoresArray) {
        self.highScoresArray = newHighScoresArray
    },
    beginReplay(replayIndex) {
        console.log(`beginning replay: ${replayIndex}`);
        self.replaying = true;
        self.replayIndex = replayIndex
    },
    addHighScoreElement(scoreValue, states, user) {
        const newScoreNumber = self.highScoresArray.length + 1;
        const newHighScore = HighScoreElementModel.create({
            scoreValue,
            states,
            user,
            scoreNumber: newScoreNumber,
            date: moment().toDate()
        });
        self.highScoresArray.push(newHighScore)
    }
})).views(self => ({
    getHighScoresArray() {
        return self.highScoresArray
    },
    isReplaying() {
        return self.replaying
    },
    getReplayIndex() {
        return self.replayIndex
    }
}));

export default HighScoresTableModel
