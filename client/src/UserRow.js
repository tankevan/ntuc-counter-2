import React, { Component } from 'react';

class UserRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      add_time_state: 0,
    };
  }

  render() {
    const { userId, userTimes, userFunctions, collectorNo } = this.props;
    const { _id,
            enter_queue_time,
            start_service_time,
            leave_service_time,
            station_no,
            age,
            item_no } = userTimes;
    const { addStartTime,
            addStartServiceTime,
            addLeaveServiceTime,
            addStationNo,
            addAge,
            addItemNo,
            removeUser } = userFunctions;

    let add_enter_queue_button;
    let add_start_service_button;
    let add_leave_service_button;
    if (enter_queue_time.value === 'loading') {
      add_enter_queue_button = <div style={buttonStyle} class="mini blue loading ui button">Loading</div>;
    } else if (!enter_queue_time.clicked) {
      add_enter_queue_button = <div style={buttonStyle} class="mini ui button" onClick={() => {addStartTime(userId, _id)}}>Enter Queue</div>;
    } else {
      add_enter_queue_button = <div style={buttonStyleHighlighted} class="mini ui blue button">{enter_queue_time.value}</div>;
    };
    if (start_service_time.value === 'loading') {
      add_start_service_button = <div style={buttonStyle} class="mini blue loading ui button">Loading</div>;
    } else if (!start_service_time.clicked) {
      add_start_service_button = <div style={buttonStyle} class="mini ui button" onClick={() => {addStartServiceTime(userId, _id)}}>Start Service</div>;
    } else {
      add_start_service_button = <div style={buttonStyleHighlighted} class="mini ui blue button">{start_service_time.value}</div>;
    };
    if (leave_service_time.value === 'loading') {
      add_leave_service_button = <div style={buttonStyle} class="mini blue loading ui button">Loading</div>;
    } else if (!leave_service_time.clicked) {
      add_leave_service_button = <div style={buttonStyle} class="mini ui button" onClick={() => {addLeaveServiceTime(userId, _id)}}>Leave Service</div>;
    } else {
      add_leave_service_button = <div style={buttonStyleHighlighted} class="mini ui blue button">{leave_service_time.value}</div>;
    };

    let add_station_buttons;
    let station_list = [1, 2, 3, 4, 5, 6, 7, 8];
    add_station_buttons = station_list.map((number) => {
      if (number === station_no) {
        return <button style={buttonStyleHighlighted} class="mini ui blue button" onClick={() => {addStationNo(userId, _id, number)}}>S{number}</button>;
      } else {
        return <button style={buttonStyle} class="mini ui button" onClick={() => {addStationNo(userId, _id, number)}}>S{number}</button>;
      }
    });

    let add_age_buttons;
    let age_list = ["Youth", "Working", "Elderly"];
    add_age_buttons = age_list.map((label, idx) => {
      if ((idx+1) === age) {
        return <button style={buttonStyleHighlighted} class="ui blue button" onClick={() => {addAge(userId, _id, idx+1)}}>{label}</button>;
      } else {
        return <button style={buttonStyle} class="ui button" onClick={() => {addAge(userId, _id, idx+1)}}>{label}</button>;
      }
    });

    let add_item_buttons;
    let item_list = ["Handful", "Basket", "Trolley"];
    add_item_buttons = item_list.map((label, idx) => {
      if ((idx+1) === item_no) {
        return <button style={buttonStyleHighlighted} class="ui blue button" onClick={() => {addItemNo(userId, _id, idx+1)}}>{label}</button>;
      } else {
        return <button style={buttonStyle} class="ui button" onClick={() => {addItemNo(userId, _id, idx+1)}}>{label}</button>;
      }
    });

    const remove_user_button = (
      <button style={buttonStyle} className="mini ui icon red button" onClick={() => {removeUser(userId, _id)}}>
        <i className="window close icon"></i>
      </button>
    )

    return (
      <div className="user_row">
        <p style={inlineBlock}>User {userId} Collector No {collectorNo + 1}</p>
        <div class="mini ui buttons">
          {add_enter_queue_button}
          {add_start_service_button}
          {add_leave_service_button}
        </div>
        <div class="mini ui buttons">
          {add_station_buttons}
        </div>
        <div class="mini ui buttons">
          {add_age_buttons}
        </div>
        <div class="mini ui buttons">
          {add_item_buttons}
        </div>
        {remove_user_button}   
      </div>
    );
  }
}

const buttonStyle = {
  'display': 'inline-block',
  //'background': 'lightblue',
}

const buttonStyleHighlighted = {
  'display': 'inline-block',
  //'background': 'blue',
}

const inlineBlock = {
  'display': 'inline',
};

export default UserRow;
