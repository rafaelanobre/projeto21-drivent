import { Request, Response } from 'express';
import httpStatus from "http-status";

export async function getTicketTypes(req: Request, res: Response){
    const ticketTypes = await 'ehasuifheasfuih'

    return res.status(httpStatus.OK).send(ticketTypes);
}

export async function getTicket(req: Request, res: Response){
    const ticket = await 'asdhikdshnkasj'

    return res.status(httpStatus.OK).send(ticket);
}

export async function ticketPost(req: Request, res: Response){
    await 'fndsjkdfnjksfnmks'

    res.sendStatus(httpStatus.CREATED);
}