export class CustomError extends Error {
   httpStatusCode: number;
   httpStatusText: string;

   constructor(
      httpStatusCode: number,
      httpStatusText: string,
      errorMessage: string
   ) {
      super(errorMessage);
      this.httpStatusCode = httpStatusCode;
      this.httpStatusText = httpStatusText;
   }
}
