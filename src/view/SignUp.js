import React, {Component} from 'react';
import firebase from 'firebase';
import ReactDOM from 'react-dom';
import UserProfile from './UserProfile';


class SignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user_email:'put user_email here',
            password:'put password here',
            err_msg: "",
            success_msg:""
        };
        this.title = "SignUp.js";
    }

    handle_signup_button(event){
        event.preventDefault(); /* make react happy */

        firebase.auth().createUserWithEmailAndPassword(this.state.user_email, this.state.password) /*create account*/

            /* handle create success, log in, go to profile */
            .then(function(){
                this.setState({
                    success_msg:"signup success!",
                    err_msg:""
                });
                ReactDOM.render(<UserProfile />, document.getElementById('root'))

            }.bind(this))

            /* handle create failure, show err message */
            .catch(function(error){
                // var error_code = error.code;
                var error_msg = error.message;
                this.setState({err_msg:error_msg});
            }.bind(this));
    }

    render() {
        return (

            <div align={"center"}>

                <img src={"https://res.cloudinary.com/teepublic/image/private/s--8-dGDDZg--/t_Preview/b_rgb:ffffff,c_limit,f_jpg,h_630,q_90,w_630/v1470902298/production/designs/627022_1.jpg"} alt={""}/>

                <h1>{this.title}</h1>
                <form >
                    <label>user_email </label>
                    <input type={"text"} value={this.state.user_email}
                           onChange={e=> this.setState({user_email: e.target.value})}/>
                    <label>{this.state.err_msg}</label>
                </form>
                <form>
                    <label>password </label>
                    <input type={"text"} value={this.state.password}
                           onChange={ e=> this.setState({password: e.target.value})}/>
                    <label>{this.state.success_msg}</label>
                </form>
                <br/>

                <form>
                    <button onClick={this.handle_signup_button.bind(this)}>Signup and login</button>
                </form>

            </div>

        );
    }
}

export default SignUp;
