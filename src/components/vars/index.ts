import { IoxViewParamsDirective } from './viewParams';
import { IoxStorage } from './storage';
import { IoxLocalVars } from './localVars';
import { IoxGlobalVars } from './globalVars';

export {IoxViewParamsDirective} from './viewParams';
export {IoxStorage} from './storage';
export {IoxLocalVars} from './localVars';
export {IoxGlobalVars} from './globalVars';

export const varsComponents: any[] = [
    IoxViewParamsDirective,
    IoxLocalVars,
    IoxGlobalVars,
    IoxStorage
];
