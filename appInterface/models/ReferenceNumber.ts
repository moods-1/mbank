import { Schema, models, model } from 'mongoose';

const ReferenceNumberSchema = new Schema(
	{
		referenceNumber: {
			type: Number,
			required: true,
			maxLength: 8,
			default: 30000000,
		},
	},
	{ timestamps: true, collection: 'ReferenceNumber' }
);

const ReferenceNumber =
	models.ReferenceNumber || model('ReferenceNumber', ReferenceNumberSchema);
export default ReferenceNumber;