import { observer } from 'mobx-react'
import React from 'react';
const types = {
        HEAD: 'head',
        BODY: 'body',
        POINT: 'point',
        EMPTY: 'empty',
    };
class BoardElement extends React.Component {
    constructor(props) {
        super(props);
        this.boardElementModel = this.props.boardElementModel;
        this.state = {
            selected: false
        }
    }
    render() {
        return <div style= { getDivStyle(this.props.boardElementModel.getType())}>{ getDivContent(this.props.boardElementModel.getType()) }</div>
    }
    renderRandomPoint() {
        const typeOfPoint = this.props.boardElementModel.isRandomPoint()
    }
}

function getDivStyle(type) {
    return {
        display: 'inline-block',
        padding: '0px',
        width: '35px',
        height: '35px',
        textAlign: 'center',
        backgroundColor: type === types.BODY ? 'black' : 'lightgreen'
    }
}
function getDivContent(type) {
    if(type === types.POINT)
    return <img height='100%' width='100%' src='./app/resources/red-virus.svg'/>
    else{
        return ''
    }
}
export default observer(BoardElement)
