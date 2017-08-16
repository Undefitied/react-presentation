import {
    UPDATE_TITLE,
    UPDATE_DESCRIPTION
} from '../actions/meta';

function getDefaultState() {
    return {
        title: 'innogy Generator Programme',
        description: ''
    };
}

export default function(state = getDefaultState(), action) {
    const nextState = {
        ...state
    };
    switch (action.type) {
        case UPDATE_TITLE:
            nextState.title = action.value;
            break;
        case UPDATE_DESCRIPTION:
            nextState.description = action.value;
            break;
        default:
            break;
    }
    return nextState;
}
