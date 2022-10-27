import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewUserInput } from './dto/newUserInput.dto';
import { User } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findById(id: string): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    findByAddress(address: string): Promise<User> {
        return (this.userRepository.findBy({ address }))[0];
    }

    create(newUserData: NewUserInput): Promise<User> {
        const user = this.userRepository.create({
            address: newUserData.address,
        });

        return this.userRepository.save(user);
    }
}
