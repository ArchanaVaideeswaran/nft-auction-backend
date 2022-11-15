import { Field, InputType } from "@nestjs/graphql";
import { IsEthereumAddress, IsNumberString } from "class-validator";


@InputType()
export class NftTokenIdDto {
    @Field()
    @IsEthereumAddress()
    nft: string;
    @Field()
    @IsNumberString()
    tokenId: string;
}