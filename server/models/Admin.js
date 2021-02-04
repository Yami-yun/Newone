const mongoose = require('mongoose');

// 관리자 페이지 관한 모델 입니다.

// 날짜 변환 함수
function getDate(){
    const date = new Date();
    const y = date.getFullYear().toString();
    const m = date.getMonth() + 1 >= 10 ? (date.getMonth() + 1).toString() : "0"+(date.getMonth() + 1).toString();
    const d = date.getDate() >= 10 ? date.getDate().toString() : "0"+date.getDate().toString();
    return y + "-" + m + "-" + d;
}

// 일일 접속자 수 스키마
const adminSchema = mongoose.Schema({
    // 생성 날짜
    date: {
        type: String,
        default: getDate(),
    }, 
    // 일일 접속자수(= array.lenth)
    count: {
        type: Array,
        default: [],
    },
});

// 일일 접속자수를 db에 저장하는 method
adminSchema.statics.countToday = function(key){
    const admin = this;

    admin.findOne( { date: getDate() }, (err, doc)=>{

        if(!doc){
            // admin db에서 금일 날짜가 없을 경우, db에 항목 생성

            const _admin = new admin({
                count:[key],
            });

            _admin.save((err, doc)=>{
                console.log(err);
                console.log(doc);
                if(err) return res.json({success: false, err});
            });

        }else{
            // 금일 날짜가 있을 경우, count +=1
            if(doc.count.indexOf(key) === -1){
                // visitor.$.count
                admin.updateOne({'date': getDate()}, {$push:{'count':key}}, (err, doc)=>{
                    if(err) return res.json({success: false, err});
                } );

            }
        }

        
    });

}


const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = { AdminModel };
