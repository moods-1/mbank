import { Schema, models, model } from 'mongoose';

const TransactionSchema = new Schema(
	{
		clientId: {
			type: Schema.Types.ObjectId,
		},
		destinationId: {
			type: Schema.Types.ObjectId,
		},
		destinationName: {
			type: String,
			minLength: 2,
		},
		sourceAccount: {
			type: Schema.Types.ObjectId,
		},
		sourceAccountName: {
			type: String,
			minLength: 2,
		},
		transactionDate: {
			type: Date,
			default: Date.now(),
		},
		amount: {
			type: Number,
			default: 0,
		},
		credit: {
			type: Boolean,
			required: true,
		},
		accountBalance: {
			type: Number,
			default: 0,
		},
		referenceNumber: {
			type: Number,
		}
	},
	{ timestamps: true, collection: 'Transaction' }
);

const Transaction =
	models.Transaction || model('Transaction', TransactionSchema);
export default Transaction;
