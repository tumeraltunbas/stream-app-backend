import { Response } from 'express';
import { BaseResDto } from '../../models/dtos/response';

export const handleResponse = (
    httpStatusCode: number,
    resDto: BaseResDto,
    res: Response
) => {
    if (resDto && resDto.success) {
        res.status(httpStatusCode).json(resDto);
    }
};
