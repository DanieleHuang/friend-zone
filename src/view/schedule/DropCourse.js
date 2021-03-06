import {remove_course_from_profile, lookup_profile_by_user_id} from "../../dao/ProfileManager";
import {remove_user_from_enrollment} from "../../dao/EnrollmentManager";
import React, {Component} from 'react';
import firebase from 'firebase';
import PageTitle from "../components/PageTitle";
import './DropCourse.css'

class DropCourse extends Component {

    constructor(props) {
        super(props);
        this.title = "DropCourse.js";
        this.state = {
            //result: [],
            course_id_to_drop: "",
            courses_list: [], // array of strings of courses
            course_obj: {},
            success_msg : ""
        };

        //get full schedule of user
        lookup_profile_by_user_id(firebase.auth().currentUser.uid, function (err, profile) {
            this.setState({courses_list: Object.getOwnPropertyNames(profile.enrolled_courses)})
        }.bind(this))
    }

    handle_drop_course() {

        if(window.confirm("Are you sure you want to drop "+this.state.course_id_to_drop + "?")) {
            remove_course_from_profile(firebase.auth().currentUser.uid, this.state.course_id_to_drop)
            remove_user_from_enrollment(firebase.auth().currentUser.uid, this.state.course_id_to_drop)

            this.setState({success_msg:"The course \"" + this.state.course_id_to_drop + "\" was successfully removed from your schedule!"})
            /*remove the item once clicked drop*/
            var new_course_list = this.state.courses_list;
            new_course_list.splice(new_course_list.indexOf(this.state.course_id_to_drop), 1);
            //window.alert("The course \"" + this.state.course_id_to_drop + "\" was successfully removed from your schedule!")
            this.setState({
                courses_list: new_course_list,
                course_id_to_drop: ""
            })
        }
    }

    render() {
        return (
            <div align={'center'}>

                <PageTitle title="Drop Course"/>


                <table className="tableStyle">
                    <tbody>
                    <tr>
                        <th className= "th1">Course Name</th>
                        <th className= "th1"> Action </th>
                        <th></th>
                    </tr>

                    {   //print each class with drop button
                        this.state.courses_list.map(function (entry) {
                            return (
                                <tr key={"course-search-result" + entry}>
                                    <td className= "td1"> {entry} </td>
                                    <td className= "td1">
                                        <button className='dropbutton'
                                            onClick={() => {
                                            this.setState({course_id_to_drop: entry}, () => {
                                                this.handle_drop_course();
                                            })
                                        }}> Drop
                                        </button>
                                    </td>
                                </tr>
                            )
                        }.bind(this))}
                    </tbody>
                </table>
                <br/>
                <div className="success-message">{this.state.success_msg}</div>


                <pre>{/*JSON.stringify(this.state.courses_list, null, 2)*/}</pre>

            </div>
        )
    }

}

export default DropCourse;