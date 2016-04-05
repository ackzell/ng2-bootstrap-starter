import {Component} from 'angular2/core';

@Component({
    selector: 'hello-app',
    templateUrl: 'src/hello.template.html'
})
export class HelloApp {
    name: string = 'World ';

    constructor() {

    }
}
