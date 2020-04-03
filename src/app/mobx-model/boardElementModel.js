import { types } from 'mobx-state-tree'

const BoardElementModel = types.model('BoardElementModel',{
    type: types.enumeration('types', ['empty', 'haed', 'body', 'point']),
    boardPositionX: types.number,
    boardPositionY: types.number
}).actions(self => ({
    setType(newType) {
        self.type = newType
    }
})).views(self => ({
    getType() {
        return self.type
    },
    getBoardPositionX() {
        return self.boardPositionX
    },
    getBoardPositionY() {
        return self.boardPositionY
    }
}))

export default BoardElementModel
