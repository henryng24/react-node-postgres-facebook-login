import React, { Component } from 'react';
import { TaskForm } from './task-form.jsx';

export class FormList extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.submitHandler = this.submitHandler.bind(this);
  }

  componentWillMount() {
    this.getAllTasks();
  }

  getAllTasks() {
    fetch('/tasks', {method: 'GET', credentials: 'same-origin'})
    .then(response => response.json())
    .then(json => { this.setState((prev) => {
      let newState = Object.assign({}, prev);
      newState.tasks = json
      return newState;
      });
    });
  }

  createPostObject(state) {
    return {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      credentials: 'same-origin',
      body: JSON.stringify(state)
    };
  }

  submitHandler(formState) {
    console.log(formState)
    fetch('/createOrUpdateTask', this.createPostObject(formState))
      .then(this.getAllTasks.bind(this))
      .catch(function(err) {
        console.log('Fetch Error:', err);
    });
  }

  render() {
    return (
       <TaskForm
        tasks={this.state.tasks}
        submitHandler={this.submitHandler}
      />
    )
  }
}