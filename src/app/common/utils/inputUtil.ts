import { ElementRef } from "@angular/core";
import * as currency from "currency.js";
import * as numeral from 'numeral';


export class InputUtil {

  static keyPressFTE(event: KeyboardEvent): boolean {
    let result = false;
    let charCode = (event.which) ? event.which : event.keyCode;
    if (                  // allow only
      charCode == 46 ||   // . decimal point
      (charCode >= 48 && charCode <= 57) // 0-9
    ) {
      result = true;
    } else if (charCode == 43) {  // +
      // value += 0.1
      console.log('value += 0.1');
    } else if (charCode == 45) {  // -
      // value -= 0.1
      console.log('value -= 0.1');
    } else {
      event.preventDefault();
    }
    return result;
  }
  
  static keyPressNumbersWithDecimal(event: KeyboardEvent): boolean {
    let result = false;
    let charCode = (event.which) ? event.which : event.keyCode;
    if (                  // allow only
      charCode == 46 ||   // . decimal point
      (charCode >= 48 && charCode <= 57) // 0-9
    ) {
      result = true;
    } else {
      event.preventDefault();
    }
    return result;
  }

  static blink(element :ElementRef<HTMLElement>, seconds: number = 2000){
    element.nativeElement.classList.add('blink-bg');
    setTimeout(() => element.nativeElement.classList.remove('blink-bg'), seconds);
  }

  static numberToCurrency(number: number): string {
    return currency(number, {pattern: `! #`, negativePattern: `-! #`, precision: 0}).format();
  }

  static currency2Number(currencyStr: string): number {
    return Number(currencyStr.replace(/[^0-9\.-]+/g,"")); // "$ 1,000" -> 1000
  }

  static formatPercentage(value: number): string {
    return numeral(value/100).format('0.00 %'); // source: http://numeraljs.com/
  }

  static formatDecimalNumber(value: number): string {
    return numeral(value).format('0.00'); // source: http://numeraljs.com/
  }

  static removePercentage(value: string): string {  // '6.75 %'
    return value.replace(/[^a-zA-Z0-9.]/g, ''); // '6.75'
  }

  static removeText(value: string): string {  // '1.00 FTE'
    return value.replace(/[^0-9.]/g, ''); // '1.00'
  }
}