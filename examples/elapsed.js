module.exports = function(mark, done){
    var elapsed = process.hrtime(mark)[1] / 1000000; // divide by a million to get nano to milli
    done(elapsed);
    return process.hrtime();
}