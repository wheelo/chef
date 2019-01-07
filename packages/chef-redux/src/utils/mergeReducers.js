/**
 * 扁平化combineReducers 
 * 参考: https://stackoverflow.com/questions/43290107/combine-redux-reducers-without-adding-nesting
 */

/* 
const reducerA = combineReducers({ reducerA1, reducerA2 })
const reducerB = combineReducers{{ reducerB1, reducerB2 })
{
    reducerA1: ...,
    reducerA2: ...,
    reducerB1: ...,
    reducerB2: ...
}
*/

import { isObject } from '@chef/chef-utils.is';

function concatenateReducers(reducers) {
    const empty = reducers.length == 0;
    function applyNextState(previousState, nextState) {
        if (isObject(previousState) && isObject(nextState)) {
            return Object.assign(previousState, nextState);
        }
        else {
            return nextState;
        }
    }
    function checkHasChanged(previousState, nextState) {
        if (isObject(previousState) && isObject(nextState)) {
            if (previousState === nextState) {
                return false;
            } else {
                const keys = Object.keys(nextState);
                for (let i = 0; i < keys.length; i++) {
                    if (previousState[keys[i]] !== nextState[keys[i]]) {
                        return true;
                    }
                }
                return false;
            }
        }
        else {
            return previousState !== nextState;
        }
    }
    return function (state, action) {
        if (empty) {
            throw Error('There are no reducers');
        }
        let finalNextState = isObject(state) ? Object.assign({}, state) : state;
        let hasChanged = false;
        function getPreviousState() {
            return typeof state === 'undefined' ? state : finalNextState;
        }
        for (let i = 0; i < reducers.length; i++) {
            const nextState = reducers[i](getPreviousState(), action);
            if (checkHasChanged(finalNextState, nextState)) {
                hasChanged = true;
                finalNextState = applyNextState(finalNextState, nextState);
            }
        }

        return hasChanged ? finalNextState : state;
    }
}


const filterReducer = reducer => {
    let knownKeys = Object.keys(reducer(undefined, { type: '@@FILTER/INIT' }))

    return (state, action) => {
        let filteredState = state;

        if (knownKeys.length && state !== undefined) {
            filteredState = knownKeys.reduce((current, key) => {
                current[key] = state[key];
                return current;
            }, {});
        }

        let newState = reducer(filteredState, action);
        let nextState = state;

        if (newState !== filteredState) {
            knownKeys = Object.keys(newState);
            nextState = {
                ...state,
                ...newState
            };
        }

        return nextState;
    };
}


export const mergeReducers = (...reducers) => concatenateReducers(reducers.map(reducer => filterReducer(reducer)))
