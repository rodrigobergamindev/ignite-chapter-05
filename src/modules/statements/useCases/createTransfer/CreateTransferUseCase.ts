import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";

import { ICreateTransferDTO } from "../../dtos/ICreateTransferDTO";
import { Transfer } from "../../entities/Transfer";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

@injectable()
class CreateTransferUseCase {
    constructor(
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository,
        @inject('TransfersRepository')
        private transfersRepository: ITransfersRepository
    ) {}

    async execute({ user_id, sender_id, amount, description }: ICreateTransferDTO): Promise<Transfer> {

        const userStatement = await this.statementsRepository.getUserBalance({ user_id });

        if(userStatement.balance < amount) {
            throw new AppError('Balance below necessary');
        }

        const transfer = await this.transfersRepository.create({
            user_id,
            sender_id,
            amount,
            description
        });

        //withdraw
        await this.statementsRepository.create({
            user_id,
            amount,
            description,
            type: OperationType.WITHDRAW,
            transfer_id: transfer.id
        });

        //deposit
        await this.statementsRepository.create({
            user_id: `${sender_id}`,
            amount,
            description,
            type: OperationType.DEPOSIT,
            transfer_id:transfer.id
        })
      
        return transfer
    }
}

export { CreateTransferUseCase };