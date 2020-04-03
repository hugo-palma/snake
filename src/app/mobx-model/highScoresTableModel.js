import { types} from "mobx-state-tree";
import SnakeModel from "./snakeModel";

const HighScoresTableModel = types.model('HighScoresModel', {
    scoreNumber: types.number,
    user: types.string,
    scoreValue: types.number,
    date: types.Date,
    states: SnakeModel,
});

export default HighScoresTableModel
