import { types } from '../helpers/types';

export const userReducer = (state, action) => {
    switch (action.type) {
        case types.login:
            return {
                logged: true,
            };

        case types.logout:
            return {
                logged: false,
            };

        default:
            return state;
    }
};
