import React, {Component} from 'react';
import './Form.css';

export class FormSection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedIds: props.defaultSelected || []
        };
    }
   
   renderFormSectionBody() {
       if(this.props.inputType === 'range') {
           return <input type="range" value={this.props.value} min={this.props.range.min} max={this.props.range.max} name={this.props.name} onChange={this.props.changeHandler} style={{marginTop: "20px"}}/>
       }
       return this.props.options.map((option, index) => {
           return (
                <div className="form-button-wrap" key={index}>
                    <button type="button" className={this.state.selectedIds.indexOf(index) > -1 ? 'active' : ''}
                        key={index} 
                        id = {"option" + index}
                        onClick={(e) => {
                          this.setState((prevState) => {
                              if(this.state.selectedIds.indexOf(index) > -1) {
                                  if(! this.props.multiple) {
                                        return {selectedIds: []};
                                  }
                                  else {    
                                        let indexToRemove = prevState.selectedIds.indexOf(index);
                                        let _selectedIds  = prevState.selectedIds.slice(0, indexToRemove).concat(prevState.selectedIds.slice(indexToRemove + 1));
                                        return {selectedIds: _selectedIds}
                                  }
                                   
                              }
                              else {
                                  if(! this.props.multiple) {
                                        return {selectedIds: [index]};   
                                  }
                                  else 
                                        return {selectedIds: prevState.selectedIds.concat(index)};
                              }
                          });
                          this.props.changeHandler(e.target, this.props.multiple);
                        }}
                        
                        name={this.props.name} 
                        value={option}>
                        {option}
                    </button>
                </div>
           )
       });
   }
   
   render() {
       return (
        <div className="form-section">
            <div className="title-smallbutton">
            {this.props.name || ""}&nbsp;{this.props.shouldShowValue && `(${this.props.value} ${this.props.unit})`}
            </div>
            <div className={`form-section-container ${this.props.className || ""}`} ref={(el) => {this.buttonContainer = el;}}>
                {this.props.children}
                {this.renderFormSectionBody()}
            </div>
        </div>
    );
   }
   
};

export default class Form extends Component {
    render() {
    return (
            <form>
                {this.props.children}
            </form>
        );
    }
}