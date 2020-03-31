import { inject, observer } from 'mobx-react';
@inject('controlsModel') @observer
class Controls extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return <div>
            <button onClick={this.props.controlsModel.toggleBackwards}><div className="fas fa-backward fa-4x" style={{padding: '5px'}}/></button>
            <button onClick={this.props.controlsModel.togglePause}><div className="fas fa-play fa-4x" style={(this.props.controlsModel.isPaused() ? divStylePaused : divStyleDefault)}/></button>
        </div>
    }
}
const divStylePaused = {
    color: 'powderblue',
    padding: '5px'
};
const divStyleDefault = {
    color: 'black',
    padding: '5px'
}
export default Controls
