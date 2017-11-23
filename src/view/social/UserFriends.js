import React, {Component} from 'react';
import {get_friend_profiles, get_self_profile} from "../../api/StaticData";
import OtherProfile from "../profile/FriendProfile";
import ReactDOM from 'react-dom';
import {delete_friend} from "../../dao/ProfileManager";


class UserFriends extends Component {

    constructor(props) {
        super(props);
        this.title = "UserFriends.js";
        this.state = {
            profile_obj: get_self_profile(),
            friend_profiles: get_friend_profiles()
        }
    }

    goto_other_profile(friend_id) {
        ReactDOM.render(<OtherProfile user_id={friend_id}/>, document.getElementById('main-layout'));
    }

    /*    This function should result in removing the friend from the list and
 block all communication with the friend such as chat, sending another friend request, showing up
 for recommended friends
  */
    block_friend(friend_id) {
        flag_friend(this.state.profile_obj.user_id, friend_id);

    }


    render() {
        return (

            <div>

                <img
                    src={"https://res.cloudinary.com/teepublic/image/private/s--8-dGDDZg--/t_Preview/b_rgb:ffffff,c_limit,f_jpg,h_630,q_90,w_630/v1470902298/production/designs/627022_1.jpg"}
                    alt={""} width={"300"}/>
                <h1>{this.title}</h1>

                <h4>うまるの友達!</h4>
                <table>
                    <tr>
                        <th>Friends</th>
                        <th></th>
                    </tr>
                    {
                        Object.keys(this.state.friend_profiles).map((friend_id, index) => {
                            return (
                                <tr key={"friend-profile-" + index}>
                                    <td>
                                        {this.state.friend_profiles[friend_id].first_name}
                                        {this.state.friend_profiles[friend_id].last_name}
                                    </td>
                                    <td>
                                        <button onClick={() => {
                                            this.goto_other_profile(friend_id);
                                        }}>
                                            goto profile
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => {
                                            this.block_friend(friend_id);
                                        }}>
                                            Block friend
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>

                <pre>{JSON.stringify(this.state, null, 2)}</pre>

            </div>

        )

    }
}

    export default UserFriends;