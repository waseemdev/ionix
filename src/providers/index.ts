import { IoxHttpOptions } from './HttpOptions';
import { IoxAuthService } from './AuthService';
import { IoxHttpService } from './HttpService';
import { IoxRestService } from './RestService';
import { ActionsProvider } from './ActionsProvider';
import { IoxStorageService } from './storage';
import { IoxGlobalVarsService } from './GlobalVars';
import { actionsProviders } from './actions';

export {IoxHttpOptions} from './HttpOptions';
export {IoxAuthService} from './AuthService';
export {IoxHttpService} from './HttpService';
export {IoxRestService} from './RestService';
export {ActionsProvider} from './ActionsProvider';
export { CloseViewAction, SetRootViewAction, PopViewAction, PushViewAction, ShowModalAction, ShowToastAction } from './actions/builtin-actions';
export {IoxStorageService} from './storage';
export {IoxGlobalVarsService} from './GlobalVars';


export const providers: any[] = [
    IoxHttpOptions,
    IoxAuthService,
    IoxHttpService,
    IoxRestService,
    ActionsProvider,
    IoxStorageService,
    IoxGlobalVarsService,
    ...actionsProviders
];
