export const CHANGE_UA = 'CHANGE_UA';

export function updateUA(ua) {
    return {
        type: CHANGE_UA,
        value: ua
    };
}
