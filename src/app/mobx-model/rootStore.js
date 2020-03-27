import { types } from 'mobx-state-tree'
import SnakeModel from "./snakeModel";

const RootStore = types.model({
    snakeModel: types.map(SnakeModel)
})
export default RootStore
