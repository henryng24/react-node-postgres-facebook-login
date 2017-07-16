import React, { Component } from 'react';

export class BaseField extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.submitHandler(this.state);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const fieldName = target.name;
    let state = Object.assign({}, this.state);
    state[fieldName] = value;
    if (this.props.id) {
      state.id = this.props.id;
    }
    this.setState(state);
  }

  render() {
    return (
      <div className='form-generic'>
      <input
        required='true'
        type='text'
        name='description'
        defaultValue={this.props.description}
        disabled={!this.props.canUpdate}
        onChange={this.handleChange.bind(this)}
        placeholder='Task'
      />
      <input
        required='true'
        type='text'
        name='time'
        defaultValue={this.props.time}
        disabled={!this.props.canUpdate}
        onChange={this.handleChange.bind(this)}
        placeholder='Time'
      />
      <form
        onSubmit={this.handleSubmit.bind(this)}
        hidden={!this.props.canUpdate}>
        <input type='submit' value='Submit'/>
      </form>
      </div>
    );
  }
}