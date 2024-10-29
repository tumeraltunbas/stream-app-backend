import { Response } from 'express';

export const successResponseHandler = (
   res: Response,
   httpCode: number,
   data?: object
) => {
   let jsonBody;

   if (data && Object.keys(data).length > 0) {
      jsonBody = {
         data: data
      };
   }

   res.status(httpCode).json(jsonBody);
};
