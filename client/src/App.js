import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import UserRow from './UserRow.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCount: 0,
      usersData: [],
    };

    const hostname = window && window.location && window.location.hostname;
    if (hostname === 'localhost') { 
      this.url = 'http://localhost:3001/api/users';
    } else {
      this.url = '/';
    }
    
  }

  componentDidMount() {
    this.loadUsersFromServer();
    setInterval(this.loadUsersFromServer, 10000);
  }

  loadUsersFromServer = () => {
    axios.get(this.url)
    .then(res => {
      this.setState({ usersData: res.data,
                      userCount: res.data.length });
    });
  }

  updateUseronServer = (user_id, user) => {
    console.log(user_id, user);
    axios.put(`${this.url}/${user_id}`, user)
    .catch(err => {
      console.log(err);
    });
  }

  deleteUseronServer = (user_id) => {
    axios.delete(`${this.url}/${user_id}`)
    .then(res => {
      console.log('User deleted');
    })
    .catch(err => {
      console.error(err);
    });
  }

  addUser = () => {
    const userRow = { "enter_queue_time": { "value": Date(),
                                            "clicked": false },
                       "start_service_time": { "value": Date(),
                                               "clicked": false },
                       "leave_service_time": { "value": Date(),
                                               "clicked": false },
                       "station_no": 0,
                       "age": 0,
                       "item_no": 0 };
    const usersData  = this.state.usersData;
    usersData.push(userRow);

    this.setState((prevState) => ({
      userCount: prevState.userCount+1,
      usersData: usersData,
    }));

    axios.post(this.url, userRow)
    // .then(res => {
    //   this.loadCommentsFromServer();
    // })
    .catch(err => {
      console.error(err);
    });
  }

  addStartTime = (userId, uniqueId) => {
      const usersData = this.state.usersData;
      usersData[userId]["enter_queue_time"] = { value: Date(),
                                                clicked: true };
      this.setState({
        usersData: usersData,
      });

      const body = {
        "enter_queue_time": { value: Date(),
                              clicked: true }
      };
      this.updateUseronServer(uniqueId, body);
  }

  addStartServiceTime = (userId, uniqueId) => {
    const usersData = this.state.usersData;
    usersData[userId]["start_service_time"] = { value: Date(),
                                                clicked: true };
    this.setState({
      usersData: usersData,
    });

    const body = {
      "start_service_time": { value: Date(),
                              clicked: true }
    };
    this.updateUseronServer(uniqueId, body);
  }

  addLeaveServiceTime = (userId, uniqueId) => {
    const usersData = this.state.usersData;
    usersData[userId]["leave_service_time"] = { value: Date(),
                                                clicked: true };
    this.setState({
      usersData: usersData,
    });

    const body = {
      "leave_service_time": { value: Date(),
                              clicked: true }
    };
    this.updateUseronServer(uniqueId, body);
  }

  addStationNo = (userId, uniqueId, stationNo) => {
    const usersData = this.state.usersData;
    usersData[userId]["station_no"] = stationNo;
    this.setState({
      usersData: usersData,
    });

    const body = { "station_no": stationNo };
    this.updateUseronServer(uniqueId, body);
  }

  addAge = (userId, uniqueId, age) => {
    const usersData = this.state.usersData;
    usersData[userId]["age"] = age;
    this.setState({
      usersData: usersData,
    });

    const body = { "age": age };
    this.updateUseronServer(uniqueId, body);
  }

  addItemNo = (userId, uniqueId, itemNo) => {
    const usersData = this.state.usersData;
    usersData[userId]["item_no"] = itemNo;
    this.setState({
      usersData: usersData,
    });

    const body = { "item_no": itemNo };
    this.updateUseronServer(uniqueId, body);
  }

  render() {
    let count = [];
    for (let a = 1; a <= this.state.userCount; a++) {
      count.push(a);
    }

    let userFunctions = { "addStartTime": this.addStartTime,
                          "addStartServiceTime": this.addStartServiceTime,
                          "addLeaveServiceTime": this.addLeaveServiceTime,
                          "addStationNo": this.addStationNo,
                          "addAge": this.addAge,
                          "addItemNo": this.addItemNo, };

    const usersData = this.state.usersData;
    let userSection = usersData.map((user, idx) => {
      return (<UserRow userId={idx} userTimes={user} userFunctions={userFunctions} />);
    });

    return (
      <div>
        NTUC Counter 
        <button class="ui primary button" onClick={this.addUser}>Add User</button>
        {userSection}
      </div>
    );
  }
}

export default App;
