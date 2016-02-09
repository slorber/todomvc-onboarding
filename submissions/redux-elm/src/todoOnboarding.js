import React from 'react';

import { View as ViewTodo, update as updateTodo } from './todo';
import { View as ViewOnboarding, update as updateOnboarding} from './onboarding';

export function* update(model = {}, action) {
  return {
    todo: yield* updateTodo(model.todo, action),
    onboarding: yield* updateOnboarding(model.onboarding, action)
  };
}

export const View = ({model, dispatch}) => (
  <div>
    <ViewTodo model={model.todo} dispatch={dispatch} />
    <ViewOnboarding model={model.onboarding} dispatch={dispatch} />
  </div>
);
