import { Schema, Prop } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Entity, ObjectID, ObjectIdColumn } from 'typeorm';

// @Schema()
@Entity()
export class AbstractBaseEntity {
    // @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    @ObjectIdColumn()
    _id: ObjectID;
}