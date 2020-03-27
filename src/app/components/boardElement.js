import { observer } from 'mobx-react'
let boardElementModel
const types = {
        HEAD: 'head',
        BODY: 'body',
        POINT: 'point',
        EMPTY: 'empty',
    }
class BoardElement extends React.Component {
    constructor(props) {
        super(props);
        this.boardElementModel = this.props.boardElementModel
        this.state = {
            selected: false
        }
    }
    render() {
        return <button
        style={{width: "25px", height: "25px", overflow: 'hidden', position:'relative', textAlign: 'left'}}>
        <div style={this.props.boardElementModel.getType() === types.EMPTY ? getEmptyStyle() : getBodyStyle()}></div>
        </button>
    }
    renderRandomPoint() {
        const typeOfPoint = this.props.boardElementModel.isRandomPoint()
    }
    
}
function getEmptyStyle() {
    return {
        width: '100%',
        height: '100%',
        background: 'white'
    }
}
function getBodyStyle() {
    return {
        width: '25px',
        height: '25px',
        background: 'black'
    }
}
export default observer(BoardElement)