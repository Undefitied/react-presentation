import {
    CHANGE_UA
} from '../actions/ua';

function getDefaultState() {
    return {
        agent: 'modern'
    };
}

export default function navbar(state = getDefaultState(), action) {
    const nextState = {
        ...state
    };
    switch (action.type) {
        case CHANGE_UA:
            nextState.agent = action.value;
            break;
        default:
            break;
    }
    return nextState;
}
