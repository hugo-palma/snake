import {detach, types} from "mobx-state-tree";
import SnakeModel from "./snakeModel";

const HighScoreElementModel = types.model('HighScoreElementModel',
    {
        scoreNumber: types.maybeNull(types.number),
        user: types.maybeNull(types.string),
        scoreValue: types.number,
        date: types.Date,
        states: types.maybeNull(types.array(SnakeModel)),
    }).actions(self => ({
    })).views(self => ({
        getScoreNumber() {
          return self.scoreNumber
        },
        getUser() {
                return self.user
        },
        getScoreValue() {
                return self.scoreValue
        },
        getDate() {
                return self.date
        },
        getStates() {
                return self.states
        },
}));

export default HighScoreElementModel
