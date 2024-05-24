import { Schema, models, model } from 'mongoose';

const AccountSchema = new Schema(
	{
		client: {
			type: Schema.Types.ObjectId,
		},
		accountName: {
			type: String,
			required: true,
			minlength: 2,
		},
		accountType: {
			type: String,
			required: true,
			minlength: 2,
		},
		accountBalance: {
			type: Number,
			default: 0,
		},
		transactions: [
			{
				type: Schema.Types.ObjectId,
			},
		],
	},
	{ timestamps:true, collection: 'Account' }
);

const Account = models.Account || model('Account', AccountSchema);
export default Account;
