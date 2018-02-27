import { IoxFormComponent } from './form';
import { FieldDefComponent } from './field-def';
import { ValidationsComponent } from './validations';
import { GroupDefComponent } from './group-def';
import { ValidationMsg } from './validation-msg';

export {ControlBase} from './controlBase';
export {IoxFormComponent} from './form';
export {FieldDefComponent} from './field-def';
export {ValidationsComponent} from './validations';
export {GroupDefComponent} from './group-def';
export { ValidationMsg } from './validation-msg';

export const formsComponents: any[] = [
    FieldDefComponent,
    GroupDefComponent,
    IoxFormComponent,
    ValidationMsg,
    ValidationsComponent,
];
