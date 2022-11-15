import { Field, InputType } from "@nestjs/graphql";
import { IsEthereumAddress } from "class-validator";

@InputType()
export class CreateUserDto {
    @Field()
    @IsEthereumAddress()
    address: string;
}