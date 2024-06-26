import { Schema, models, model } from 'mongoose';

const AccountSchema = new Schema(
	{
		clientNumber: {
			type: Number,
			ref: 'Client',
		},
		accountName: {
			type: String,
			required: true,
			minlength: 2,
		},
		accountType: {
			type: String,
			required: true,
		},
		accountBalance: {
			type: Number,
			default: 0,
		},
		debt: {
			type: Boolean,
			required: true,
			default: false,
		},
		transactions: [
			{
				type: Schema.Types.ObjectId,
			},
		],
	},
	{ timestamps: true, collection: 'Account' }
);

const Account = models.Account || model('Account', AccountSchema);
export default Account;
