import { observer, inject } from 'mobx-react';
@inject('scoreModel') @observer
class Score extends React.Component{
    render() {
        const { scoreModel } = this.props
        return `Score: ${scoreModel.status()}`
    }
}

export default Score