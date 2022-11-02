import { Schema, Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose'

@Schema()
export class AbstractBaseEntity {
    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: string;
}