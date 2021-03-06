import Course from './Course'
import firebase from 'firebase';

export function lookup_course_by_id(course_id, callback){
    firebase.database().ref('Catalog/'+course_id).once('value').then((snapshot)=>{
        if (snapshot.val()===null){
            callback({"msg":"course not found"},null);
        } else {
            callback(null, new Course(
                snapshot.val().course_id,
                snapshot.val().course_code,
                snapshot.val().course_name,
                snapshot.val().section,
                snapshot.val().days,
                snapshot.val().time,
                snapshot.val().location,
                snapshot.val().instructor
            ))
        }
    })

}


/* precise lookup by id, callback list of Course */
export function lookup_course_by_code(course_code, callback){
    let db = firebase.database().ref();
    db.child("Catalog").orderByChild("course_code").equalTo(course_code)
        .on("value", function(snapshot){

            var ret = [];
            snapshot.forEach(function(entry){
                var entry_json = entry.toJSON();
                ret.push(new Course(
                    entry_json.course_id,
                    entry_json.course_code,
                    entry_json.course_name,
                    entry_json.section,
                    entry_json.days,
                    entry_json.time,
                    entry_json.location,
                    entry_json.instructor
                ))
            });

            callback(null, ret);
        });
}

/* fuzzy lookup. BUGGY dont use this for now */
export function lookup_course_instructor_prefix(prefix, callback){
    let db = firebase.database().ref();
    db.child("Catalog").orderByChild("instructor")
        .startAt(prefix).endAt(prefix +"\uf8ff")
        .on("value", function(snapshot){

            var ret = [];
            snapshot.forEach(function(entry){
                var entry_json = entry.toJSON();
                ret.push(new Course(
                    entry_json.course_id,
                    entry_json.course_code,
                    entry_json.course_name,
                    entry_json.section,
                    entry_json.days,
                    entry_json.time,
                    entry_json.location,
                    entry_json.instructor
                ))

            });

            callback(null, ret);
        })
}

/* precise lookup by instructor, callback list of Course */
export function lookup_course_by_instructor(instructor, callback){
    let db = firebase.database().ref();
    db.child("Catalog").orderByChild("instructor").equalTo(instructor)
        .on("value", function(snapshot){

            var ret = [];
            snapshot.forEach(function(entry){
                var entry_json = entry.toJSON();
                ret.push(new Course(
                    entry_json.course_id,
                    entry_json.course_code,
                    entry_json.course_name,
                    entry_json.section,
                    entry_json.days,
                    entry_json.time,
                    entry_json.location,
                    entry_json.instructor
                ))
            });

            callback(null, ret);
        });
}


/* combine lookup by code and by instructor, callback list of Course  */
export function lookup_course(keyword, callback){
    var by_code_result = [];
    var by_instructor_result = [];
    var done = 0;

    var course_key = keyword.replace(/\s+/g, '').toUpperCase();
    lookup_course_by_code(course_key, function(err,data){
        by_code_result = data;
        done += 1;
        /*does not callback until the other lookup is done*/
        if (done === 2)
            callback(null, by_code_result.concat(by_instructor_result));
    });

    var instructor_key = keyword.charAt(0).toUpperCase() + keyword.slice(1).toLowerCase();
    lookup_course_instructor_prefix(instructor_key, function(err,data){
        by_instructor_result = data;
        done += 1;
        /*does not callback until the other lookup is done*/
        if (done === 2)
            callback(null, by_code_result.concat(by_instructor_result));
    });

}
