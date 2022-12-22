import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuid } from 'uuid';

import { User } from "../../users/entities/User";

@Entity('transfers')
class Transfer {

    constructor() {
        if(!this.id) {
            this.id = uuid();
        }
    }

    @PrimaryColumn('uuid')
    id?: string;

    @Column('uuid')
    user_id: string;

    @Column('uuid')
    sender_id: string;

    @ManyToOne(() => User, user => user.statement)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => User, user => user.statement)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @Column()
    description: string;

    @Column('decimal', { precision: 5, scale: 2 })
    amount: number;

    @Column({ default: 'transfer' })
    type: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export { Transfer };