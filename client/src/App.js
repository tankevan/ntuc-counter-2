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
      collectorNo: 0,
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
  }

  loadUsersFromServer = (collectorNo = this.state.collectorNo) => {
    axios.get(`/api/${collectorNo}/users`)
    .then(res => {
      this.setState({ usersData: res.data,
                      userCount: res.data.length });
    });
  }

  updateUseronServer = (user_id, user) => {
    console.log(user_id, user);
    axios.put(`/api/users/${user_id}`, user)
    .then(res => {
      this.loadUsersFromServer();
    })
    .catch(err => {
      console.log(err);
    });
  }

  deleteUseronServer = (user_id) => {
    axios.delete(`/api/users/${user_id}`)
    .then(res => {
      this.loadUsersFromServer();
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

    axios.post(`/api/${this.state.collectorNo}/users/`, userRow)
    .then(res => {
      this.loadUsersFromServer();
    })
    .catch(err => {
      console.error(err);
    });
  }

  addStartTime = (userId, uniqueId) => {
      const usersData = this.state.usersData;
      usersData[userId]["enter_queue_time"] = { value: "loading",
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
    usersData[userId]["start_service_time"] = { value: "loading",
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
    usersData[userId]["leave_service_time"] = { value: "loading",
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
  removeUser = (userId, uniqueId) => {
    const usersData = this.state.usersData;
    usersData.splice(userId, 1);
    this.setState({
      usersData: usersData,
    })

    this.deleteUseronServer(uniqueId);
  }

  updateCollectorNo = (newNumber) => {
    this.setState({
      collectorNo: newNumber,
    }); // cannot depend on setState to set the state in time for function call
    this.loadUsersFromServer(newNumber);
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
                          "addItemNo": this.addItemNo,
                          "removeUser": this.removeUser };

    const usersData = this.state.usersData;
    let userSection = usersData.map((user, idx) => {
      return (<UserRow userId={idx} userTimes={user} userFunctions={userFunctions} collectorNo={this.state.collectorNo}/>);
    });

    const collector_list = [0, 1, 2];
    const collectorSection = collector_list.map((num) => {
      if (this.state.collectorNo === num) {
        return (<button className="ui primary button" onClick={() => this.updateCollectorNo(num)}>{num+1}</button>)
      } else {
        return (<button className="ui button" onClick={() => this.updateCollectorNo(num)}>{num+1}</button>)
      }
    })

    return (
      <div>
        <div style={headerDivStyle}>
          <div style={headerStyle} className="ui buttons">
            {collectorSection}
          </div>
        </div>
        <div style={bodyStyle}>
          NTUC Counter 
          {userSection}
          <button class="ui primary button" onClick={this.addUser}>Add User</button>
        </div>
      </div>
    );
  }
}

const bodyStyle = {
  'paddingTop': '70px',
}

const headerDivStyle = {
  'height': '60px',
  'width': '100%',
  'display': 'flex',
  'position': 'fixed',
  'background': 'white',
  'alignItems': 'center',
  'justifyContent': 'center',
  'zIndex': '1',
  'boxShadow': '1px 0.5px 5px rgba(0,0,0,0.2)',
}

const headerStyle = {
  'height': '50px',
}

export default App;
