const mongoose = require('mongoose');

function getDate(){
    const date = new Date();
    const y = date.getFullYear().toString();
    const m = date.getMonth() + 1 >= 10 ? (date.getMonth() + 1).toString() : "0"+(date.getMonth() + 1).toString();
    const d = date.getDate() >= 10 ? date.getDate().toString() : "0"+date.getDate().toString();
    //const test= "2021-01-23";
    return y + "-" + m + "-" + d;
}



const adminSchema = mongoose.Schema({

    date: {
        type: String,
        default: getDate(),
    }, 
    count: {
        type: Array,
        default: [],
    },


});

adminSchema.statics.countToday = function(key){
    const admin = this;

    
    admin.findOne( { date: getDate() }, (err, doc)=>{

        if(!doc){
            // admin db에서 금일 날짜가 없을 경우

            const _admin = new admin({
                count:[key],
            });

            _admin.save((err, doc)=>{
                console.log(err);
                console.log(doc);
                if(err) return res.json({success: false, err});
            });

        }else{
            if(doc.count.indexOf(key) === -1){
                // visitor.$.count
                admin.updateOne({'date': getDate()}, {$push:{'count':key}}, (err, doc)=>{
                    if(err) return res.json({success: false, err});
                } );

            }
        }

        
    });

    // admin.findOne( {visitor: { $elemMatch : {date: getDate()} }}, (err, doc)=>{
    //     console.log("################################ DOC S ################################");
    //     console.log(err);
    //     console.log(doc);
        
    //     console.log("################################ DOC E ################################");
    //     if(!doc){
    //         // admin db에서 금일 날짜가 없을 경우
    //         const _admin = new admin({visitor:[
    //             {
    //                 count:[key],
    //             }
    //         ]});

    //         _admin.save((err, doc)=>{
    //             console.log(err);
    //             console.log(doc);
    //             if(err) return res.json({success: false, err});
    //         });

    //     }else{
    //         const today = doc.visitor.findIndex(value=>value.date === getDate());
    //         if(doc.visitor[today].count.indexOf(key) === -1){
    //             doc.visitor[today].count.push(key);
    //             AdminModel.updateOne({'visitor.date': getDate()}, {$push:{'visitor.$.count':key}}, (err, doc)=>{
    //                 if(err) return res.json({success: false, err});
    //             } );

    //         }
    //         // if(doc.visitor.count.indexOf(user.key) === -1) doc.update({visitor:})
    //     }

        
    // });

}


const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = { AdminModel };
