import { types } from 'mobx-state-tree'

const BoardElementModel = types.model({
    type: types.enumeration('types', ['empty', 'haed', 'body', 'point'])
}).actions(self => ({
    setType(newType) {
        self.type = newType
    }
})).views(self => ({
    getType() {
        return self.type
    }
}))

export default BoardElementModel