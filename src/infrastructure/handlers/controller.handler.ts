import { Response } from 'express';
import { BaseResDto, ServiceResponse } from '../../models/dtos/response';

export const handleResponse = (
    httpStatusCode: number,
    resDto: ServiceResponse<BaseResDto>,
    res: Response
) => {
    if (resDto && resDto.success) {
        res.status(httpStatusCode).json(resDto);
    }
};
