var map = function() {
    var w = this.weight
    var h = this.height
    
    if (w === null) 
        w = 0
    if (h === null) 
        h = 0
    
    emit(this.sex, {weight: w, height: h})
};

var reduce = function(key, values) {
    var wSum = 0
    var hSum = 0
    var avgH = 0
    var avgW = 0
    
    for (var i = 0; i < values.length; i++) {
        hSum += values[i].height
        wSum += values[i].weight
    }
    
    avgH = hSum / values.length
    avgW = wSum / values.length
    
    return {height: avgH, weight: avgW}
};

db.people.mapReduce(map, reduce, { out: 'peopleAvgWidthHeight' })
db.peopleAvgWidthHeight.find({})

db.people.aggregate([{
    $group: {
        _id: "$sex",
        avg_weight: { $avg: "$weight" },
        avg_height: { $avg: "$height" }
    }
}])