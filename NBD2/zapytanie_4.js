var map = function() {
    var heightPower = this.height * this.height
    var bmi = this.weight / heightPower;
    emit(this.nationality, { bmi: bmi, bmi_avg: null, bmi_min: null, bmi_max: null });
};

var reduce = function(key, values) {
    var avg = 0
    var min = values[0].bmi
    var max = values[0].bmi
    var value = 0
    
    for (var i = 0; i < values.length; i++) {
        value = values[i];
        avg += value.bmi;
       
        if (value.bmi < min) 
            min = value.bmi;
       
        if (value.bmi > max) 
            max = value.bmi;
    }
    
    return {
        bmi_min: min,
        bmi_avg: avg / values.length,
        bmi_max: max,
        bmi: null
    };
};

db.people.mapReduce(map, reduce, { out: 'peopleBMI' });
db.peopleBMI.find({}).toArray();




db.people.aggregate([{
        $project: {
            nationality: "$nationality",
            bmi: { $divide: ["$weight", { $pow: ["$height", 2] }] }
        }
    }, {
        $group: {
            _id: "$nationality",
            bmi_min: { $min: "$bmi" },
            bmi_avg: { $avg: "$bmi" },
            bmi_max: { $max: "$bmi" }
        }
    }]).toArray();