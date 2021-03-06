import { parseSourceToSchema } from './parser/parseSourceToSchema';
import { prepareInitialValues } from './helpers';

export const initialState = {
    loading: true,
    editing: {},
    source: undefined,
    initialValues: {},
    sourceType: undefined,
    schema: undefined,
    isAuthRemoving: null
};

const reducer = (state, { type, source, name, sourceType, appTypes, authId, removingAuth, intl }) => {
    switch (type) {
        case 'createForm':
            return {
                ...state,
                sourceType,
                initialValues: prepareInitialValues(state.source, sourceType.product_name),
                schema: parseSourceToSchema(state.source, sourceType, appTypes, intl),
                loading: false
            };
        case 'setSource':
            return {
                ...state,
                source
            };
        case 'reset':
            return {
                ...state,
                editing: {}
            };
        case 'setEdit':
            return {
                ...state,
                editing: {
                    ...state.editing,
                    [name]: !state.editing[name]
                }
            };
        case 'removeAuthPending':
            return {
                ...state,
                isAuthRemoving: null,
                source: {
                    ...state.source,
                    authentications: state.source.authentications.map((auth) => auth.id === authId ? {
                        ...auth, isDeleting: true
                    } : auth)
                }
            };
        case 'removeAuthRejected':
            return {
                ...state,
                source: {
                    ...state.source,
                    authentications: state.source.authentications.map((auth) => auth.id === authId ? {
                        ...auth, isDeleting: false
                    } : auth)
                }
            };
        case 'removeAuthFulfill':
            return {
                ...state,
                source: {
                    ...state.source,
                    authentications: state.source.authentications.filter((auth) => auth.id !== authId)
                }
            };
        case 'setAuthRemoving':
            return {
                ...state,
                isAuthRemoving: removingAuth
            };
        case 'closeAuthRemoving':
            return {
                ...state,
                isAuthRemoving: null
            };
        default:
            return state;
    }
};

export default reducer;
