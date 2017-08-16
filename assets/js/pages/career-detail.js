import React, { Component } from 'react';
import Column from '../components/column';
import Hero from '../components/hero';
import Page from '../components/page';
import Profile from '../components/profile';
import Tasks from '../components/tasks';
import { connect } from 'react-redux';
import fetch from "isomorphic-fetch";
import Content from '../components/content';
import { parseString } from 'xml2js';
import config from '../lib/config/index';
import { Link } from 'react-router';
import { setTitle, setDescription } from '../actions/meta';
import _ from 'lodash';


class CareerDetail extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            valid: null,
            messageValid: null,
            applyResult: null,
            messageResult: null,
            submitting: false
        };
    }

    componentDidMount() {
        this.setState({
            mounted: true
        });

        this.props.dispatch(setTitle(this.props.data.metaTitle));
        this.props.dispatch(setDescription(this.props.data.metaDescription));

        const _this = this;

        fetch(config.get("XMLJobsUrl"), {
            method: 'GET',
        })
            .then((response) => response.text())
            .then(function (data) {
                parseString(data, function (err, result) {

                    const positionId = Number(window.location.href.substr(window.location.href.lastIndexOf('/') + 1));

                    let position = {};
                    let positions = result['workzag-jobs'].position;
                    for (var i = 0; i < positions.length; i++) {
                        if (Number(positions[i].id) === positionId) {
                            position = positions[i];
                            break;
                        }
                    }
                    _this.setState({ position }, _this.getShortDescription(position));
                });
            })
            .then(() => {
                //display google map only if position has value USE_LOCATION true
                if (_.get(_this.state.position, 'jobDescriptions[0]')) {
                    _this.state.position.jobDescriptions[0].jobDescription.forEach(function (item) {
                        if (item.name[0] === 'USE_LOCATION' && item.value[0].match("true")) {
                            _this.getCityCoords(_this.state.position.office);
                        }
                    })
                }
            })
    }

    getShortDescription(position) {
        const _this = this;
        if (_.get(position, 'jobDescriptions[0]')) {
            position.jobDescriptions[0].jobDescription.forEach(function(item, index){
                if(item.name[0] === 'Short Description') {
                    _this.state.positionDescription = item.value;
                }
            })
        };
    }

    getCityCoords(city) {
        const _this = this;

        fetch('https://maps.google.com/maps/api/geocode/json?address=' + city, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                const coords = {
                    lat: data.results[0].geometry.location.lat,
                    lng: data.results[0].geometry.location.lng - 0.1 //offset from center
                };
                _this.setState({ coords });
            })
    }

    render() {
        const data = this.props.data;
        let profileContent;
        let tasksContent;
        if (_.get(this.state.position, 'jobDescriptions[0]')) {
            this.state.position.jobDescriptions[0].jobDescription.forEach(function (item, index) {
                if (item.name[0] === 'Profile') {
                    profileContent = item.value;
                } else if (item.name[0] === 'Tasks') {
                    tasksContent = item.value;
                }
            })
        }

        const ProfileBlock = profileContent ? <Profile profileContent={profileContent}/> : null;
        const TasksBlock = tasksContent ? <Tasks tasksContent={tasksContent}/> : null;
        const url = this.state.mounted ? window.location.href : 'https://innovationhub.innogy.com';
        const coords = this.state.coords ? this.state.coords : null;
        const title = this.state.position ? this.state.position.name : null;
        const schedule = this.state.position ? this.state.position.schedule : null;
        const office = this.state.position ? this.state.position.office : null;

        const heroData = {
            img: data.heroImage.fields.file.url,
            title: title,
            subtitle: schedule + ', ' + office,
            heroBackgroundColor: data.heroBackgroundColor,
            mapCoords: coords,
            positioned: true
        };

        const shortDescription = this.state.positionDescription;
        const linkedInDescription = shortDescription ? '&summary=' + shortDescription : "";
        const faceBookDescription = shortDescription ? '&description=' + shortDescription : "";
        const whatsAppDescription = shortDescription ? shortDescription : "";
        const mailDescription = shortDescription ? shortDescription : "";
        const linkedInRef = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}, ${schedule}, ${office}${linkedInDescription}`;
        const faceBookRef = `https://www.facebook.com/sharer/sharer.php?u=${url}${faceBookDescription}&title=${title}, ${schedule},  ${office}`;
        const mailRef = 'mailto:?subject=' + encodeURIComponent(title + ', ' + schedule + ', ' + office) + '&body=' + encodeURIComponent(mailDescription + url);
        const whatsAppRef = `whatsapp://send?text=I wanted you to see this link!${url} ${whatsAppDescription}`;

        return (
            <Page key={data.url} className="career-detail enveloped">
                <Hero data={heroData}>
                    <Link className="news-back" to="/career">Back to career page</Link>
                </Hero>
                <Column>
                    <div className="social">
                        <p className="title">Share this job:</p>
                        <a className="icon linked-in" href={linkedInRef}/>
                        <a className="icon facebook" href={faceBookRef}/>
                        <a className="icon twitter"
                           href={`https://twitter.com/intent/tweet?text=open vacancy%20on%20${url}&hashtags=innogy&via=innogy_en`}/>
                        <a className="icon mail" href={mailRef}
                           />
                        <a className="icon whatsapp" href={whatsAppRef}
                           data-action="share/whatsapp/share"/>
                    </div>
                    {TasksBlock}
                    {ProfileBlock}
                </Column>
                <Content components={data.components}/>
            </Page>
        );
    }
}

export default connect(function (state) {
    const { pages } = state.cful;
    return {
        data: pages.filter((page) => page.fields.pageType === 'career-detail')[0].fields
    };
})(CareerDetail);
