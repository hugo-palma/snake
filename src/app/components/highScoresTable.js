import { observer, inject } from 'mobx-react';
@inject('highScoresModel') @observer
class HighScoresTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <table>
                    <thead>
                        <th>#</th>
                        <th>User</th>
                        <th>Score</th>
                        <th>Date</th>
                        <th>Replay</th>
                    </thead>
                    <tbody>
                        {this.props.highScoresModel.getScores()}
                    </tbody>
                </table>
            </div>
        );
    }
}
