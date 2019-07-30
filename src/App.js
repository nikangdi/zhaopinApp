import React from 'react';




class App extends React.Component {  //架构，处理形成route的显示空间
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div>
          {this.props.children}
      </div>
    );
  }
}

export default App;
