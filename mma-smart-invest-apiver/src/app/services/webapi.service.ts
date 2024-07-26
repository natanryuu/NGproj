import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, shareReplay } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { ApiReturnData } from '../interfaces/plan.interfaces';
import { ModalService } from './modal.service';
import { delay } from 'q';

@Injectable({
  providedIn: 'root'
})
export class WebapiService {

  AI_GRS1 = '/ws/ai/aiquery/ws_aiGetRetirementStep1.ashx'; // 退休規劃_步驟一
  AI_GRS2 = '/ws/ai/aiquery/ws_aiGetRetirementStep2.ashx'; // 退休規劃_步驟二
  AI_GEE = '/ws/ai/aiquery/ws_aiGetEquityExpo.ashx'; // 退休規劃 & 自訂計畫股債比
  AI_AE = '/ws/ai/aiquery/ws_aiAddEmail.ashx'; // 試算留存Email
  AI_GP = '/ws/ai/aiquery/ws_aiGetProjection.ashx'; // Projection 表
  AI_GMS1 = '/ws/ai/aiquery/ws_aiGetMyPlanStep1.ashx'; // 自訂計畫_步驟一
  AI_GMS2 = '/ws/ai/aiquery/ws_aiGetMyPlanStep2.ashx'; // 自訂計畫_步驟二
  CAPTCHA = '/ws/ai/aiquery/ws_aiCaptchaNo.ashx'; // 產生圖型驗證碼
  AI_GBP = '/ws/ai/aiquery/ws_aiGetBackProjection.ashx'; // 歷史模擬
  AI_GBPH = '/ws/ai/aiquery/ws_aiGetBackProjectionHistory.ashx'; // 歷史模擬清單

  constructor(
    private http: HttpClient,
    private modalsvc: ModalService
  ) { }

  /**
   * 退休規劃_步驟一
   * @param data: {
   *  "Gender": "M",
   *  "Age": "36",
   *  "Salary": "60000",
   * }
   */

  getRetirementStep1(data) {
    //console.log(data);
    return this.http
      .post<ApiReturnData>(this.AI_GRS1, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 退休規劃_步驟二
   * @param data: {
   *  "Gender": "M",
   *  "Age": "36",
   *  "Salary": "60000",
   *  "RetirementAge": "65",
   *  "TargetDollar": "2000000",
   *  "PFType": "01"
   * }
   */

  getRetirementStep2(data) {
    //console.log(data);
    return this.http
      .post<ApiReturnData>(this.AI_GRS2, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 取得股債比
   * @param data: {
   *  "Gender": "M",
   *  "Age": "35",
   *  "Salary": "60000",
   *  "InitialDollar": "500000", // 期初投入
   *  "RSPDollar": "6000", // 每月投入
   *  "RetirementAge": "65" // 預期退休年齡
   *  "TargetDollar": "5130000" // 目標金額
   *  "PFType": "01" // 試算組別
   *  "PFName": "退休規劃" // 試算名稱
   *  "InvestYear": "30" // 投資年期
   * }
   */

  getEquityExpo(data) {
    return this.http
      .post<ApiReturnData>(this.AI_GEE, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 試算留存 Email
   * @param data: {
   *  "Email": "jasontsai@sinopac.com",
   *  "CalSeqNo": "2018112000000001", // 步驟二的時候會回傳，要記下來
   *  "CaptchaNo": "061565" // 圖形驗證碼
   * }
   */

  sendMail(data) {
    return this.http
      .post<ApiReturnData>(this.AI_AE, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Projection 表
   * @param data: {
   *  "InitialDollar": "500000", // 期初投入金額
   *  "RSPDollar": "60000", // 每月投入金額
   *  "TargetDollar": "6000000", // 目標金額
   *  "InvestYear": "5" // 投資年期
   * }
   */

  getProjection(data) {
    return this.http
      .post<ApiReturnData>(this.AI_GP, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 自訂計劃_步驟一
   * @param data: {
   *  "Gender": "M",
   *  "Age": "35",
   *  "Salary": "60000",
   *  "PFType": "02" // 計劃代號：01：退休規劃，02：自訂計畫命名，03：旅遊基金，04：子女教育基金，05：購屋頭期款
   *  "RFName": "自訂計劃名稱"
   * }
   */

  getCustomStep1(data) {
    // console.log(data);
    return this.http
      .post<ApiReturnData>(this.AI_GMS1, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 自訂計劃_步驟二
   * @param data: {
   *  "Gender": "M",
   *  "Age": "36",
   *  "Salary": "60000",
   *  "InvestYear": "5", // 投資年期
   *  "TargetDollar": "2000000", // 目標金額
   *  "PFType": "01" // 計劃代號： 01：退休規劃，02：自訂計畫命名，03：旅遊基金，04：子女教育基金，05：購屋頭期款
   *  "RFName": "自訂計劃名稱"
   * }
   */

  getCustomStep2(data) {
    // console.log(data);
    return this.http
      .post<ApiReturnData>(this.AI_GMS2, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 取得圖形驗證碼
   * @param num_count: number
   */

  getCaptchaCode(num_count?: number) {
    let NumCount = '';
    const randomNum = '?' + Math.random() * 10000000;
    if (num_count) { NumCount = '&NumCount=' + num_count; }
    return this.CAPTCHA + randomNum + NumCount;
  }

  /**
   * 歷史模擬
   * @param data
   */

  getBackProj(data) {
    return this.http
      .post<ApiReturnData>(this.AI_GBP, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 歷史模擬清單
   * @param data
   */

  getBackProjHistory(data) {
    return this.http
      .post<ApiReturnData>(this.AI_GBPH, this.packData(data))
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 送出前先包裝
   * @param data: Object
   */

  packData(data) {
    const obj = {
      'SvcRq': {
        'Rq': data
      }
    };
    return obj;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
      this.apiReturnError(`系統忙線中，請稍候再試[FEErr] '${error.error.message}'`);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        this.apiReturnError(`系統忙線中，請稍候再試[FEErr] '${error.status}' '${error.error}'`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  async apiReturnError(err) {
    console.error(err);
    this.modalsvc.modal_trigger_close.emit(true);
    await delay(300);
    this.modalsvc.modal_container_class.emit('error');
    this.modalsvc.componentName.emit('messages');
    this.modalsvc.msg_type = 'error';
    this.modalsvc.loadingText(err);
  }

}
