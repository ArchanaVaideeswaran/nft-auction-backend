import { IsEthereumAddress } from "class-validator";

export class NewUserInput {
    @IsEthereumAddress()
    address: string;
}