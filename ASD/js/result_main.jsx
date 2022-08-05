import React from "react";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

class Result extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      prediction: -2 // -2 not available, -1 not mentioned in paper, 0 negative, 1 positive
    }
    this.onChange = this.onChange.bind(this);
    this.fetchResult = this.fetchResult.bind(this);
  }

  onChange(event) {
    event.preventDefault();
    this.setState({name: event.target.value})
  }

  fetchResult() {
    const {name} = this.state;
    if (name === '') {
      alert("请输入姓名(Name cannot be empty)")
      return
    }
    fetch('/api/v1/r/', {
      credentials: "same-origin", method: "POST", headers: {
        "Content-Type": "application/json"
      }, body: JSON.stringify({
        name: name
      })
    }).then((response) => {
      if (!response.ok) {
        this.setState({
          prediction: -2
        })
        response.json().then((data)=>{
          console.log(data);
        })
        // console.log(name);
        throw Error(response.statusText)
      }
      return response.json()
    }).then((data) => {
      console.log(data)
      // console.log(`${data.name}`)
      this.setState({prediction: data.prediction})
    }).catch((err) => console.log(err));
  }


  render() {
    const {name, prediction} = this.state;
    return <div>
      <Form>
        <Form.Group>
          <div class='item-col'>
            <h2>
              请输入想要查询孩子的姓名(Please input the name of the child you want to inquire)
            </h2>
          </div>
          <div className="item-col">
            <Form.Control type="text" value={name} onChange={this.onChange}/>
          </div>
        </Form.Group>
      </Form>
      <div class="item-col container-row">
        <Button class='item-row' onClick={this.fetchResult}>
          查询(Search)
        </Button>
      </div>
      <div class='item-col container-row'>
        {prediction === 0 && <p class="item-col">健康(The user is not likely to have ASD).</p>}
        {prediction === 1 && <p class="item-col">孩子有风险患有ASD(The user may have ASD).</p>}
        {prediction === -1 && <p class="item-col">未知(Unknown)</p>}
      </div>
    </div>
  }

}

export default Result;