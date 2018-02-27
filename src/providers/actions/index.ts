import { PushViewAction, PopViewAction, SetRootViewAction, ShowModalAction, ShowToastAction, CloseViewAction } from "./builtin-actions";

export { PushViewAction, PopViewAction, SetRootViewAction, ShowModalAction, ShowToastAction, CloseViewAction } from "./builtin-actions";

export const actionsProviders: any[] = [
    PushViewAction,
    PopViewAction,
    SetRootViewAction,
    CloseViewAction,
    ShowModalAction,
    ShowToastAction
];
