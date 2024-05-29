import { ErrorHandler, Injectable } from '@angular/core';
import { SharedService } from './shared.service';

@Injectable()
export class ErrorLogHandler implements ErrorHandler {

  constructor (
    private shared: SharedService
  ) {

  }
  handleError(error) {
    // this.shared.sendErrorReporting(error);
  }
}
