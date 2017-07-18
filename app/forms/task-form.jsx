import React, { Component } from 'react';
import { BaseField } from './base-components/base-field.jsx';

export class TaskForm extends Component {
  constructor(props) {
    super(props);
  }

  returnAllFields() {
    if (this.props.tasks) {
      const taskInformation = this.props.tasks.map((task, index) => {
        const beginningOfToday = new Date();
        beginningOfToday.setHours(0,0,0,0)
        const canUpdate = beginningOfToday < Date.parse(task.updatedTime)
        const inputProps = {
          key: index,
          description: task.description,
          time: task.time,
          canUpdate: canUpdate,
          required: true,
          onChange: this.handleChange,
          submitHandler: this.props.submitHandler,
          id: task.id
        };
        return <BaseField {...inputProps} />
      });
      const inputProps = {
        key: this.props.tasks ? this.props.tasks.length : 1,
        canUpdate: true,
        required: true,
        description: undefined,
        time: undefined,
        onChange: this.handleChange,
        submitHandler: this.props.submitHandler
      };
      taskInformation.push(<BaseField {...inputProps} />)
      return taskInformation;
    }
  }

  render() {
    const allFields = this.returnAllFields();
    return (
      <div>
        {allFields}
      </div>
    )
  }
}