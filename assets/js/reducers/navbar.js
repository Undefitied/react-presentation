import {
    SHOW_BG,
    STICKY_CHANGE
} from '../actions/navbar';

function getDefaultState() {
    return {
        backgroundVisible: true,
        navSticky: false
    };
}

export default function navbar(state = getDefaultState(), action) {
    const nextState = {
        ...state
    };
    switch (action.type) {
        case SHOW_BG:
            nextState.backgroundVisible = action.value;
            break;
        case STICKY_CHANGE:
            nextState.navSticky = action.value;
            break;
        default:
            break;
    }
    return nextState;
}
