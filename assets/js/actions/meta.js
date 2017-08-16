export const UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION';
export const UPDATE_TITLE = 'UPDATE_TITLE';

export function setDescription(value) {
    return {
        type: UPDATE_DESCRIPTION,
        value
    };
}

export function setTitle(value) {
    return {
        type: UPDATE_TITLE,
        value
    };
}
