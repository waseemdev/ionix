import { IoxLoading } from './loading';
import { IoxConfirm } from './confirm';
import { IoxToast } from './toast';
import { DialogBase } from './dialog-base';

export {IoxLoading} from './loading';
export {IoxConfirm} from './confirm';
export { IoxToast } from './toast';
export { DialogBase } from './dialog-base';

export const dialogComponents: any[] = [
    DialogBase,
    IoxLoading,
    IoxConfirm,
    IoxToast
];
