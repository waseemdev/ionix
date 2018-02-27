
# Ionix
Experimental library for Ionic Framework helps you build an app without Typescript, only HTML/CSS.

Built on top of [ng-interactions](https://github.com/waseemdev/ng-interactions).


# Setup

1. install via npm:
```
npm i ng-ionix@latest --save
```
2. Import IoxModule in you module
```typescript
import { IoxModule } from "ng-ionix";

@NgModule({
    imports: [
        IoxModule,
        ....
    ]
})
export class AppModule { }
```


# Http

## `iox-apis`
`api` is a component that make and call an HTTP request.

```html
<iox-apis>
    <api #getPage
        url="/pages/about"
        [anonymous]="true"
        [executingMessage]="'LOADING_MSG' | translate"
        dataPath="data.page.content">
    </api>
</iox-apis>
```
#### `api` Properties:
| Property      | Desc.         |
| ------------- | ------------- |
| url | api url |
| method | default is `get` |
| anonymous | default is true |
| authorized | default is null |
| cache | whether or not to cache the data, default is false |
| persistDataKey | whether or not to save returned data (mapped data) in Local Storage |
| executingMessage | loading message you want to show during executing the api, default is null, so no loading message will show |
| successMessage | toast message you want to show if completed successfuly, default is null, so no toast will show |
| errorMessage | toast message you want to show if received an error, default is null, so no toast will show |
| pagingQueryParam | the name of page parameter to pass in url query, default is `page` e.g. ?page=1 |
| startPageNo | the number should starts paging results at, default is `1` |
| hasNextPage | determines whether it has a next page or not |
| dataPath | the actual data path you want to store it in `data` property. |
| response | `readonly` HTTP response |
| data | `readonly` represents mapped data from response, if `dataPath` wasn't provided will be the same as `response` |
| error | `readonly` HTTP error |
| executing | `readonly` whether is executing or not |

<br>

# `action`
`action` is a custom action built on top of `ActionBase` from ng-interactions.

You can pass the name of action as a string or an `api` object.

When `action` is attached to ion-content, will be executed after the element is loaded. otherwise it will be executed on click event.
### 1. api action:
Use `[action]` to call and execute `api`, and when it is bound to `ion-content` that has `ion-refresher` or/and `ion-infinite-scroll`, it will implement `ionRefresh` and `ionInfinite` events.
Example:
```html
<iox-apis>
    <api #loadProducts url="/products"
        [executingMessage]="'LOADING_MSG' | translate"
        [hasNextPage]="loadProducts?.response?.data?.next_page_url"
        dataPath="data.products">
    </api>
</iox-apis>

<ion-content [action]="loadProducts">
    <!-- no need to implement (ionRefresh) event, [action] takes care of it. -->
    <ion-refresher>
        <ion-refresher-content pullingText="" refreshingText="">
        </ion-refresher-content>
    </ion-refresher>

    <ion-list>
        <ion-item *ngFor="let item of loadProducts?.data">
            ...

            <event-trigger on="click">
                <action [action]="'pushView'" [actionParams]="['ProductDetailPage', { productId: item.id }]"></action>
            </event-trigger>
        </ion-item>
    </ion-list>

    <!-- no need to implement (ionInfinite) event, [action] takes care of it. -->
    <ion-infinite-scroll>
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
    </ion-infinite-scroll>
</ion-content>
```
### `[actionParams]` for `api`:
You can pass query parameters to `api` using `[actionParams]` in two ways:
1. an array of values: ['category_1', 4], so will be applied to `api` query variables in order.
2. an object with keys that match variables in api url: { cat: 'category_1', id: 4 }.
    ```html
    <api url="/{cat}/products/{id}">
    <!-- the result will be the same for both ways, so final url wil be: '/category_1/product/4'. -->
    <api>
    ```

### 2. 'pushView':
```html
<button [action]="'pushView'" [actionParams]="['SomePage', { product: item }]">Push</action>
```

### 3. 'popView':
```html
<button [action]="'popView'"></button>
```

### 4. 'setRootView':
```html
<button [action]="'setRootView'" [actionParams]="['SomePage']">Set Root</button>
```

### 5. 'closeView':
```html
<button>
    <event-trigger on="click">
        <action [action]="'closeView'"></action>
    </event-trigger>
    Cancel
</button>
<!-- Or -->
<button [action]="'closeView'" [actionParams]="[{ selectedItem: item }]">Ok</button>
```

### 6. 'showModal':
```html
<button [action]="'showModal'" [actionParams]="['ModalPage', { params... }]">Show Modal</button>
```

### 7. 'showToast':
```html
<button [action]="'showToast'" [actionParams]="[{ message: 'toast message...', duration: 3000 }]">Show Toast</button>
```

### 8. 'submitForm' (see Forms):
```html
<button [action]="'submitForm'">Show Toast</button>
```


### Http Settings:

```javascript
import { IoxHttpOptions } from "ng-ionix";
...
    constructor(httpOptions: IoxHttpOptions) {
        httpOptions.domain = 'https://www.mydomain.com';
        httpOptions.apiBasePath = '/api/v1';
    }
```

### Http Authorization:

```javascript
import { IoxAuthService } from "ng-ionix";
...
    constructor(authService: IoxAuthService) {
        authService.authorizationHeader = 'Bearer';
        authService.accessToken = 'user access token should be stored here';
        authService.authenticateAsync = (): Observable<boolean> => {
            return new Observable(observer => {
                // check if user is authenticated or not, refresh the token if expired.
                observer.next(true);
            });
        };
    }
```

### Intercept Http Request:
```javascript
import { HttpRequest } from "@angular/common/http";
...
    constructor(httpService: IoxHttpService) {
        httpService.iterceptRequest = (httpRequest: HttpRequest<any>) => {
            // change the request...
            return true; // true to allow the execution
        };
    }
```


### Add Custom Action:

```javascript
import { IAction } from "ng-ionix";

export class MyCustomAction implements IAction {
    name: string = 'customPushView';

    constructor(private app: App) {
    }

    execute(params: any): Observable<any> {
        return Observable.fromPromise(this.app.getActiveNavs()[0].push.apply(this.app.getActiveNavs()[0], params));
    }
}

// in App or AppModule
import { IAction, ActionsProvider } from "ng-ionix";
...
    constructor(actionsProvider: ActionsProvider, myAction: MyCustomAction) {
        actionsProvider.add(myAction);
    }
```

# Forms
`iox-form` takes care of building FormGroup, and calling `api`.

## iox-form Properties:
| Property | Desc. |
|----------|-------|
| submitAction | an `api` object |
| submitParams | an array of parameters as follows: **0:** whether or not to send only changes. **1:** tag name, 'update' will group all fields that has 'update' tag and compose them in one object and send it to api as a body. '!update' will take all fields that its tag not equals to 'update' **2:** parameter for api |

```html
<iox-form #form [submitAction]="addProfileApi" [submitParams]="[true, '!noupdate', { id: 10 }]">
    <button [action]="'submitForm'">Save</button>
</iox-form>
```

## field-def Properties:
| Property | Desc. |
|----------|-------|
| name | field name |
| default | default value for the field |
| required | `boolean` |
| min | `number` |
| max | `number` |
| minLength | `number` |
| maxLength | `number` |
| regex | `string` |
| tag | `string` to mark fields and group them, so you can include/exclude them before submitting the form |

## validations
`validations` component helps you to display validation errors for a control/field.

Form example:
```html
<iox-form #form [submitAction]="updateProfileApi" [submitParams]="[true, '!noupdate', { id: 10 }]">
    <field-def name="id" tag="noupdate" />
    <field-def name="email" [required]="true"  />
    <field-def name="firstName" [required]="true" />
    <field-def name="lastName" [required]="true" />

    <ion-list *ngIf="form?.formGroup" [formGroup]="form.formGroup">
        ...
        <ion-item>
            <ion-label floating>{{ 'email' | translate }}</ion-label>
            <ion-input type="email" formControlName="email"></ion-input>
        </ion-item>
        <validations [control]="'email'"></validations>
        ...
    </ion-list>

    <!-- when you click the button will submit the form, make an object with all changed fields (first param: true) that have no 'noupdate' in tag property (second param: '!noupdate'), then will call updateProfileApi with query parameter (id: 10) -->
    <button [action]="'submitForm'">Save</button>
</iox-form>
```


# Dialogs

## 1. confirm
```html
<iox-confirm #confirm okText="Ok" cancelText="Cancel" [message]="msg | translate" [title]="title | translate" (cancelled)="..." (confirmed)="..."></iox-confirm>
<button (click)="confirm.present()">
    Show Confirm
</button>
```

## 2. loading
```html
<iox-loading #loading [message]="msg | translate" [duration]="2000"></iox-loading>
<button (click)="loading.present()">
    Show Loading
</button>
```

## 3. toast
```html
<iox-toast #toast [message]="msg | translate" [duration]="2000"></iox-toast>
<button (click)="toast.present()">
    Show Toast
</button>
```

Also you can use `showOn` preporty on toast, loading or confirm to show it when the value is true.
```html
<iox-toast #toast [message]="msg | translate" [duration]="2000" [showOn]="value.length > 10"></iox-toast>
```


# Variables

## View Parameters
Use `iox-view-params` to read parameters passed to current page.
```html
<iox-apis>
    <api #getProductDetailApi
        url="/product/{id}"
        [executingMessage]="'LOADING_MSG' | translate"
        dataPath="data.product">
    </api>
</iox-apis>

<iox-view-params #viewParams></iox-view-params>

<ion-content [action]="getProductDetailApi" [actionParams]="[viewParams?.get('productId')]">
</ion-content>
```

## Storage
Enable you to access LocalStorage.

```html
<iox-storage #storage></iox-storage>
<div>{{ storage?.get('some-key') }}</div>
<button (click)="storage.set('key', value)">
    Save
</button>
```

## Global Variables
Access global variables across all the pages.

```html
<iox-global-vars #vars></iox-global-vars>
<div>{{ vars?.get('some-key') }}</div>
```

## Local Variables
Temporary variables inside the page.

```html
<iox-local-vars #vars></iox-local-vars>
<div>{{ vars?.get('some-key') }}</div>
<button (click)="vars.set('key', value)">
    Save
</button>
```
