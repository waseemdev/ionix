import { CustomAction } from "./custom-action";
import { CustomActionDirective } from "./custom-action.directive";
import { CustomActionComponent } from "./custom-action.component";

export {CustomAction} from "./custom-action";
export {CustomActionDirective} from "./custom-action.directive";
export {CustomActionComponent} from "./custom-action.component";

export const actionsComponents: any[] = [
    CustomAction,
    CustomActionDirective,
    CustomActionComponent
];
