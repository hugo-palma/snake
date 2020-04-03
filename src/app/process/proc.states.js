import {applySnapshot, getSnapshot} from "mobx-state-tree";

function applyReplayState(targetStateIndex, states, snakeModel) {
    if(targetStateIndex >= states.length - 1) return;
    const targetState = states[targetStateIndex + 1];
    const targetSnapshot = getSnapshot(targetState);
    applySnapshot(snakeModel, targetSnapshot);
    console.log('finished applying state');
    return  targetStateIndex + 1;
}

function applyPreviousState(currentStateIndex, states, snakeModel) {
    if (currentStateIndex <= 0) return;
    states.pop();
    applySnapshot(snakeModel, states[currentStateIndex - 1]);
    return currentStateIndex - 1;
}

function addSnapshotToStates(currentStateIndex, snapshot, states) {
    if(currentStateIndex === states.length - 1) {
        if(snapshot) {
            currentStateIndex++;
            states.push(snapshot)
        }
    }
    return currentStateIndex + 1;
}
function getSnapshotFromModel(targetModel) {
    return getSnapshot(targetModel)
}
export default { applyReplayState, applyPreviousState, addSnapshotToStates, getSnapshotFromModel }
