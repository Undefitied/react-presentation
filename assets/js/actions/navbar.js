export const SHOW_BG = 'SHOW_BG';
export const STICKY_CHANGE = 'STICKY_CHANGE';

export function changeSticky(sticky = false) {
    return {
        type: STICKY_CHANGE,
        value: sticky
    };
}

export function changeBgVisibility(visible = false) {
    return {
        type: SHOW_BG,
        value: visible
    };
}
