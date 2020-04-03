import { observer, inject } from 'mobx-react';
@inject('scoreModel') @observer
class Score extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            inputIdUser: ''
        }
    }
    render() {
        const { scoreModel } = this.props;
        return <div className={'container'}>
            <h2>Score: {scoreModel.status()}</h2>
            {scoreModel.getUser() ? <div><p>User: {scoreModel.getUser()}</p></div> : <div><input id="userInput" onChange = { this.handleInputChange.bind(this) } placeholder="example@gmail.com"/><button onClick={this.handleClick.bind(this)}>Save</button></div>}
        </div>
    }
    handleInputChange(e) {
        this.setState({inputIdUser: e.target.value})
    }
    handleClick() {
        this.props.scoreModel.setUser(this.state.inputIdUser)
    }
}

export default Score
