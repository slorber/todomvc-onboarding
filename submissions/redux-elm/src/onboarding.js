import React from 'react';

const CREATED_TODOS_NEEDED = 3;
const MARKED_COMPLETED_TODOS_NEEDED = 2;

const initialModel = {
  progress: {
    todosCreated: 0,
    todosMarkedCompleted: 0,
    completedCleared: false
  },
  completed: false
};

function* checkOnboardingCompleteness(model) {
  if (model.progress.todosCreated >= CREATED_TODOS_NEEDED &&
      model.progress.todosMarkedCompleted >= MARKED_COMPLETED_TODOS_NEEDED &&
      model.progress.completedCleared &&
      !model.completed) {
    // Just to eliminate coupling between components
    yield dispatch => dispatch('ONBOARDING_FINISHED');

    return model;
  } else {
    return model;
  }
}

export function* update(model = initialModel, { type, payload }) {
  const modelMutation = () => {
    switch (type) {
    case 'ADD':
      return {
        ...model,
        progress: {
          ...model.progress,
          todosCreated: Math.max(model.progress.todosCreated + 1, CREATED_TODOS_NEEDED)
        }
      };

    case 'CHECK':
      if (payload.payload) {
        return {
          ...model,
          progress: {
            ...model.progress,
            todosMarkedCompleted: Math.max(model.progress.todosMarkedCompleted + 1, MARKED_COMPLETED_TODOS_NEEDED)
          }
        };
      } else {
        return model;
      }
      break;

    case 'DELETE_COMPLETE':
      return {...model, progress: {...model.progress, completedCleared: true}};

    case 'ONBOARDING_FINISHED':
      return {...model, completed: true};

    default:
      return model;
    }
  };

  return yield* checkOnboardingCompleteness(modelMutation());
}

export const View = ({model}) => (
  <div style={{color: model.completed ? '#00ff00' : '#ff0000'}}>
    {model.completed ? 'Onboarding completed' : 'Onboarding in progress'}
  </div>
);
