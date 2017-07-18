var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    equipment: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
    },
    quantity: Integer,
    remarks: String,
    url: String,
    timestamp: Date,
    status: Integer
    /*
     * ステータス一覧
     * 1: 依頼
     * 2: 発注
     * 3: 完了
     * 4: 却下
     * 0: 論理削除
     */
});

module.exports = mongoose.model('Request', RequestSchema);
