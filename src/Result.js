import React from 'react';
import './Result.css';
import Carousel from 'nuka-carousel';
import { storage } from './DB';
import ArrowLeft from 'react-icons/lib/io/ios-arrow-thin-left'
import WorkingHours from './WorkingHours';
import DirectionsMap from './DirectionsMap';
import ArrowUp from 'react-icons/lib/io/ios-arrow-up';
import ArrowDown from 'react-icons/lib/io/ios-arrow-down';

class Result extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExpanded: false,
            workingHoursModalActive: false,
            mapsModalActive: false,
            urls: []
        };

        this.buildWorkingHours = this.buildWorkingHours.bind(this);

        [1, 2, 3, 4, 5].map((i) => {
            storage.child(`${props.restaurant.name}/${i}.jpg`).getDownloadURL().then((url) => {
                this.setState((prevState) => {
                    return { urls: prevState.urls.concat(url) }
                })
            })
        });
    }

    expandHandler() {
        this.setState((prevState) => {
            return { isExpanded: !prevState.isExpanded };
        });
    }

    renderImages() {
        return this.state.urls
        .map((link, index) => {
            return <div style={{backgroundImage: `url(${link})`}} className="restoImages" key={index}/>;
        })
    }

    buildWorkingHours() {
        let workingHours =

            Object.keys(this.props.restaurant)
            .filter((k) => {
                if (k.includes('working_hours__')) {
                    return k;
                }
            })
            .map((k) => {
                let mergedTimes = "";

                try {
                    mergedTimes = JSON.parse(this.props.restaurant[k]);
                    mergedTimes = mergedTimes.reduce((prevTime, nextTime) => {
                        return prevTime + (prevTime == "" ? "" : " | ") + nextTime.startTime.trim() + " - " + nextTime.endTime.trim();
                    }, "");
                }
                catch (e) {
                    mergedTimes = this.props.restaurant[k];
                }

                return {
                    "day": [k.slice(-3)],
                    "hours": mergedTimes 
                    
                };
            })

        return workingHours;
    }
    
    toggleWorkingHoursModal() {
        this.setState((prevState) => {
            return {workingHoursModalActive: !prevState.workingHoursModalActive}
        })    
    }
    
    toggleMapsModal() {
        this.setState((prevState) => {
            return {mapsModalActive: !prevState.mapsModalActive}
        })  
    }
    
    render() {
        return (
            <div className="result-container">
            <WorkingHours hours={ this.buildWorkingHours() } active={this.state.workingHoursModalActive} closeHandler={ () => {this.toggleWorkingHoursModal()} }/>
            {this.state.mapsModalActive && <DirectionsMap userLocation={this.props.location} restaurantLocation={{latitude: this.props.restaurant.latitude, longitude: this.props.restaurant.longitude}} closeHandler={() => {this.toggleMapsModal();}}/>}
            <div className="result-pictures">
                <Carousel>
                    {this.renderImages()}
                </Carousel>
            </div>
            <div className="result-close-button" onClick={this.props.closeHandler}>
                <ArrowLeft size={25}/>
            </div>
            <div className={this.state.isExpanded ? "result-info expanded" : "result-info"}>
                <div className="expand-toggle" onClick={() => {this.expandHandler();}}>{this.state.isExpanded ?  <ArrowDown size={25} /> : <ArrowUp size={25} />}</div>
                <h2>{this.props.restaurant.name}</h2>
                <h6 className="grey">{this.props.restaurant.address}</h6>
                <h6 className="grey">
                    <span>{this.props.restaurant.price_range}</span>&nbsp;|&nbsp;<span className={this.props.restaurant.isOpen ? 'green' : 'red'}>{this.props.restaurant.isOpen ? (this.props.restaurant.isOpen24hrs ? "Open 24 hrs" : (this.props.restaurant.untilTime ? "Open now until " + this.props.restaurant.untilTime : ""))  : ((this.props.restaurant.untilTime ? "Closed now until " + this.props.restaurant.untilTime : "Closed now"))}</span>
                    &nbsp;|&nbsp;<span className="working-hours-active" onClick={() => {this.toggleWorkingHoursModal();}}>View full hours</span>
                </h6>
                <div className="result-description">
                    {this.state.isExpanded ? this.props.restaurant.description : this.props.restaurant.description.slice(0, 161).concat("...")}
                </div>
                <div className="result-actions">
                        <a target="_blank" href={this.props.restaurant['Menu Link'] ? this.props.restaurant['Menu Link'] : "#"}>
                            <button className="small-button" disabled={!this.props.restaurant['Menu Link'] ? 'disabled' : ''}>
                                Menu
                            </button>
                        </a>
                            <button className="small-button" onClick={() => {this.toggleMapsModal();}}>
                                Map
                            </button>
                        <a target="_blank" href={this.props.restaurant['Booking Link'] ? this.props.restaurant['Booking Link'] : "#"}>
                            <button className="small-button" disabled={!this.props.restaurant['Booking Link'] ? 'disabled' : ''}>
                                Book
                            </button>
                        </a>
                    </div>
            </div>
        </div>
        );
    }
}

export default Result;
