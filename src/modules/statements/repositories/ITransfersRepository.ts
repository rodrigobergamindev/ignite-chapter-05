import { ICreateTransferDTO } from "../dtos/ICreateTransferDTO";
import { Transfer } from "../entities/Transfer";

interface ITransfersRepository {
    create(data: ICreateTransferDTO): Promise<Transfer>;
}

export { ITransfersRepository };