export class ErrorMessagesConfig {

  public static readonly ERROR_MESSAGE = {
    PS101: 'Invalid STEP in PeopleSoft HR database. Please contact HR to correct data and retry.',
  };

  public static getErrorMessage(errorCode: string): string {
    return this.ERROR_MESSAGE[errorCode];
  }
}

