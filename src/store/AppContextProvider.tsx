import React, { useReducer } from 'react';
import { useGetContextConfig } from '../api';
import CwaSpinner from '../components/spinner/spinner.component';
import IError from '../misc/error';
import useCancallation, { ICancellationResponse } from '../misc/useCancellation';
import useNavigation, { INavigation } from '../misc/useNavigation';
import { IValueSetList, useGetValueSets } from '../misc/useValueSet';
import utils from '../misc/utils';
import AppContext, { IAppContext } from './app-context';

enum AppCtxActions {
  UPDATE_NAV,
  UPDATE_VS,
  UPDATE_CANCEL,
  UPDATE_CTX_CONFIG,
  UPDATE_GET_CANCEL,
  UPDATE_ERROR,
  CLEAR_ERROR,
}

interface IAppCtxAction {
  type: AppCtxActions;
  payload: INavigation | ICancellationResponse | IValueSetList | (() => void) | IError | any;
}

const appCtxReducer = (state: IAppContext, action: IAppCtxAction) => {
  // console.log('state: ', state);
  // console.log('action: ', action);

  let ctx: IAppContext = { ...state };

  switch (action.type) {
    case AppCtxActions.UPDATE_NAV:
      ctx.navigation = action.payload as INavigation;
      break;

    case AppCtxActions.UPDATE_CANCEL:
      ctx.cancellation = action.payload as ICancellationResponse;
      break;

    case AppCtxActions.UPDATE_VS:
      ctx.valueSets = action.payload as IValueSetList;
      break;

    case AppCtxActions.UPDATE_CTX_CONFIG:
      ctx.contextConfig = action.payload;
      break;

    case AppCtxActions.UPDATE_ERROR:
      ctx.error = [...ctx.error, action.payload as IError];
      console.log(ctx.error);

      break;

    case AppCtxActions.CLEAR_ERROR:
      ctx.error = [];
      break;
  }

  ctx.initialized = !!(ctx.navigation && ctx.cancellation && ctx.utils && ctx.valueSets);

  return ctx;
};

const AppContextProvider = (props: any) => {
  const addError = (error: IError) => {
    contextDispatch({ type: AppCtxActions.UPDATE_ERROR, payload: error });
  };
  const clearError = () => {
    contextDispatch({ type: AppCtxActions.CLEAR_ERROR, payload: {} });
  };

  const navigation = useNavigation();
  const contextConfig = useGetContextConfig();
  const valueSets = useGetValueSets(contextConfig ? contextConfig['rules-server-url'] : '', undefined, (msg) => {
    addError({ message: msg });
  });
  const [cancellation, getCancellation] = useCancallation((error) => {
    addError({ error: error });
  });

  const [context, contextDispatch] = useReducer(appCtxReducer, {
    initialized: false,
    error: [],
    utils: utils,
    updateCancellation: getCancellation,
    updateError: addError,
    clearError: clearError,
  });

  React.useEffect(() => {
    getCancellation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    navigation && contextDispatch({ type: AppCtxActions.UPDATE_NAV, payload: navigation });
  }, [navigation]);

  React.useEffect(() => {
    contextConfig &&
      contextDispatch({
        type: AppCtxActions.UPDATE_CTX_CONFIG,
        payload: contextConfig,
      });
  }, [contextConfig]);

  React.useEffect(() => {
    valueSets && contextDispatch({ type: AppCtxActions.UPDATE_VS, payload: valueSets });
  }, [valueSets]);

  React.useEffect(() => {
    cancellation &&
      contextDispatch({
        type: AppCtxActions.UPDATE_CANCEL,
        payload: cancellation,
      });
  }, [cancellation]);

  return !context.initialized ? (
    <CwaSpinner />
  ) : (
    <AppContext.Provider value={context}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
