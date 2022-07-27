import React, { useReducer } from 'react';
import CwaSpinner from '../components/spinner/spinner.component';
import useCancallation, {
  ICancellationResponse,
} from '../misc/useCancellation';
import useNavigation, { INavigation } from '../misc/useNavigation';
import { IValueSetList, useGetValueSets } from '../misc/useValueSet';
import utils, { IUtils } from '../misc/utils';
import AppContext, { IAppContext } from './app-context';

enum AppCtxActions {
  UPDATE_NAV,
  UPDATE_VS,
  UPDATE_UTILS,
  UPDATE_CANCEL,
  UPDATE_GET_CANCEL,
}

interface IAppCtxAction {
  type: AppCtxActions;
  payload:
    | INavigation
    | ICancellationResponse
    | IUtils
    | IValueSetList
    | (() => void)
    | ((onSuccess: () => void) => void);
}

const defaultAppCtx: IAppContext = { initialized: false };

const appCtxReducer = (state: IAppContext, action: IAppCtxAction) => {
  console.log('state: ', state);
  console.log('action: ', action);

  let ctx: IAppContext = { ...state };

  switch (action.type) {
    case AppCtxActions.UPDATE_NAV:
      ctx.navigation = action.payload as INavigation;
      break;

    case AppCtxActions.UPDATE_CANCEL:
      ctx.cancellation = action.payload as ICancellationResponse;
      break;

    case AppCtxActions.UPDATE_GET_CANCEL:
      ctx.updateCancellation = action.payload as () => void;
      break;

    case AppCtxActions.UPDATE_UTILS:
      ctx.utils = action.payload as IUtils;
      break;

    case AppCtxActions.UPDATE_VS:
      ctx.valueSets = action.payload as IValueSetList;
      break;
  }

  ctx.initialized = !!(
    ctx.navigation &&
    ctx.cancellation &&
    ctx.updateCancellation &&
    ctx.utils &&
    ctx.valueSets
  );

  return ctx;
};

const AppContextProvider = (props: any) => {
  const [context, contextDispatch] = useReducer(appCtxReducer, defaultAppCtx);
  const navigation = useNavigation();
  const valueSets = useGetValueSets();
  //undefined, (msg) => {
  //   setError({ message: msg });
  //}
  const _utils = utils;
  const [cancellation, getCancellation] = useCancallation();

  React.useEffect(() => {
    contextDispatch({
      type: AppCtxActions.UPDATE_GET_CANCEL,
      payload: getCancellation,
    });

    getCancellation();
  }, []);

  React.useEffect(() => {
    navigation &&
      contextDispatch({ type: AppCtxActions.UPDATE_NAV, payload: navigation });
  }, [navigation]);

  React.useEffect(() => {
    valueSets &&
      contextDispatch({ type: AppCtxActions.UPDATE_VS, payload: valueSets });
  }, [valueSets]);

  React.useEffect(() => {
    _utils &&
      contextDispatch({ type: AppCtxActions.UPDATE_UTILS, payload: _utils });
  }, [_utils]);

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
