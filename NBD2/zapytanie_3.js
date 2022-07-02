var map = function() {
    emit(this.job, null);
};

var reduce = function(key, values) {
    return null;
};

db.people.mapReduce(map, reduce, { out: 'distinctJobs' });
db.distinctJobs.find({}).toArray()



db.people.aggregate({
        $sort: { job: -1 }
    }, {
    $group: {
        _id: "$job"
    }
}).toArray()