var map = function() {
    if (this.nationality !== "Poland" || this.sex !== "Female")
        return;
    
    for (var i = 0; i < this.credit.length; i++)
        emit(this.credit[i].currency, this.credit[i].balance);
};

var reduce = function(key, values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) 
    	sum += values[i];

    var avgBalance = sum / values.length;
    
    return { summed_balance: sum, avg_balance: avgBalance};
};

db.people.mapReduce(map, reduce, { out: 'poepleFemalePolandCurrencyRemainings' });
db.poepleFemalePolandCurrencyRemainings.find({}).toArray();




db.people.aggregate([{
        $match: {
            sex: "Female",
            nationality: "Poland"
        }}, {
            $unwind: "$credit"
        }, {
            $group: {
            _id: "$credit.currency",
            "summed_balance": { "$sum": "$credit.balance" },
            "avg_balance": { "$avg": "$credit.balance" }
        }
    }]).toArray();