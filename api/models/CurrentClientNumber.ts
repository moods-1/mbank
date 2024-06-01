import { Schema, models, model } from 'mongoose';

const ClientNumberSchema = new Schema(
	{
		clientNumber: {
			type: Number,
			required: true,
			maxLength: 9,
			default: 800000000,
		},
	},
	{ timestamps: true, collection: 'ClientNumber' }
);

const ClientNumber =
	models.ClientNumber || model('ClientNumber', ClientNumberSchema);
export default ClientNumber;
