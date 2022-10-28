import { Field, InputType } from "@nestjs/graphql";
import { IsEthereumAddress } from "class-validator";

@InputType()
export class NewUserInput {
    @Field()
    @IsEthereumAddress()
    address: string;
}