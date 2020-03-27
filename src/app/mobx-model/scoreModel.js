import { types } from 'mobx-state-tree'

const ScoreModel = types.model("ScoreModel", {
    score: 0
}).actions(self => ({
    addScore() {
        self.score += 1
    },
    setScore(newScore) {
        self.score = newScore
    }
}))
.views(self => ({
    status() {
        return self.score
    }
}));

export default ScoreModel