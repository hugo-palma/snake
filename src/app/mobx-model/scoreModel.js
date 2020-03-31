import { types } from 'mobx-state-tree'

const ScoreModel = types.model("ScoreModel", {
    score: 0,
    user: types.maybe(types.string, null)
}).actions(self => ({
    addScore() {
        self.score += 1
    },
    setScore(newScore) {
        self.score = newScore
    },
    setUser(user) {
        self.user = user
    }
}))
.views(self => ({
    status() {
        return self.score
    },
    getUser() {
        return self.user
    }
}));

export default ScoreModel
