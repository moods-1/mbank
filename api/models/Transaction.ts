import { Schema, models, model } from 'mongoose';

const TransactionSchema = new Schema(
	{
		client: {
			type: Schema.Types.ObjectId,
		},
		account: {
			type: Schema.Types.ObjectId,
		},
		transactionDate: {
			type: Date,
			default: Date.now(),
		},
		amount: {
			type: Number,
			default: 0,
		}
	},
	{ timestamps: true, collection: 'Transaction' }
);

const Transaction = models.Transaction || model('Transaction', TransactionSchema);
export default Transaction;
