import { observer, inject } from 'mobx-react';
import highScoresProcess from '../process/proc.highScore'
import moment from "moment";
@inject('highScoresTableModel') @observer
class HighScoresTable extends React.Component {
    constructor(props) {
        super(props);
    }
    async componentDidMount() {
        const dbHighScores = await highScoresProcess.getHighScores(this.props.highScoresTableModel);
    }
    render() {
        const highScoresTableModel = this.props.highScoresTableModel;
        return <div className={'container'}>
                <table className={'table'}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Replay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            highScoresTableModel.getHighScoresArray().map((score) => {
                                return <tr>
                                    <td>{score.getScoreNumber()}</td>
                                    <td>{score.getUser() ? score.getUser() : 'Anonymous'}</td>
                                    <td>{score.getScoreValue()}</td>
                                    <td>{moment(score.getDate()).format('DD-MM-YYYY HH:MM:SS')}</td>
                                    <td><button className={highScoresTableModel.isReplaying() ? 'btn btn-danger' : 'btn btn-primary'} onClick={this.handleReplayClick.bind(this, score)}>Replay</button>   </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>
            </div>

    }
    handleReplayClick(score) {
        const replayIndex = this.props.highScoresTableModel.getHighScoresArray().indexOf(score);
        this.props.highScoresTableModel.beginReplay(replayIndex)
    }
}
export default HighScoresTable
