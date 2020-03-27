import { types } from 'mobx-state-tree';

const SnakeModel = types.model('SnakeModel', {
    direction: types.string,
    isDead: types.boolean
})

export default SnakeModel