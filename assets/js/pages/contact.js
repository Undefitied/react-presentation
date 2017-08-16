import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Column from '../components/column';
import Hero from '../components/hero';
import Page from '../components/page';
import { connect } from 'react-redux';
import Field from '../components/field';
import { setTitle, setDescription } from '../actions/meta';
import isEmailish from '../lib/email-regexp';
import fetch from '../lib/fetch';

function hasEntry(v) {
    return v && v.trim().length;
}

const fields = [
    {
        name: 'email',
        label: 'Your email',
        valid: isEmailish
    },
    {
        name: 'name',
        label: 'Your name',
        valid: hasEntry
    },
    {
        name: 'intention',
        label: 'Your intention',
        valid: hasEntry
    },
    {
        name: 'message',
        label: 'Your message',
        valid: hasEntry,
        type: 'textarea'
    }
];


class Contact extends Component {
    constructor() {
        super(...arguments);
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
        this.update = this.update.bind(this);
        this.validate = this.validate.bind(this);
        this.state = {
            valid: null,
            submitResult: null,
            submitting: false,
            name: '',
            email: '',
            intention: '',
            message: ''
        };
    }
    componentWillMount() {
        this.props.dispatch(setTitle(this.props.data.metaTitle));
        this.props.dispatch(setDescription(this.props.data.metaDescription));
    }
    validate() {
        this.setState({
            valid: fields.reduce((valid, f) => {
                const name = f.name;
                const value = this.state[name];
                return !!(valid && f.valid(value));
            }, true)
        });
    }
    reset() {
        if (this.state.submitting) return;
        const nextState = {
            valid: null
        };
        fields.forEach(f => { nextState[f.name] = ''; });
        this.setState(nextState);
    }
    submit(e) {
        e.preventDefault();
        this.validate();
        if (this.state.valid && !this.state.submitting) {
            this.setState({
                submitResult: null,
                submitting: true
            });
            fetch('/msg/contact', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.state.name,
                    email: this.state.email,
                    intention: this.state.intention,
                    message: this.state.message
                })
            })
            .then(() => {
                this.setState({
                    submitResult: true
                });
                this.reset();
            })
            .catch(function(err) {
                console.log(err);
                this.setState({
                    submitResult: false
                });
            })
            .finally(() => {
                this.setState({
                    submitting: false
                });
            });
        }
    }
    update(field, e) {
        const nextState = {
            hasEntered: true
        };
        nextState[field] = e.target.value;
        this.setState(nextState);
    }
    buildForm() {
        return fields.map((f, idx) => {
            const name = f.name;
            const value = this.state[name];
            const isValid = (this.state.valid === null) ? true : f.valid(value);
            const classes = cx({
                error: !isValid
            });

            return <Field key={idx} className={classes} disabled={this.state.submitting} onChange={this.update.bind(this, name)} value={this.state[name]} label={f.label} type={f.type || 'text'} />;
        });
    }
    render() {
        const data = this.props.data;
        const hasEntered = this.state.valid !== null;
        const isValid = this.state.valid;

        const heroData = {
            img: data.heroImage.fields.file.url,
            title: data.heroTitle,
            subtitle: data.heroSubtitle,
            heroBackgroundColor: data.heroBackgroundColor
        };

        return (
            <Page key={data.url} className="apply enveloped">
                <Hero data={heroData} />
                <Column>
                    <h1>Get in touch</h1>
                    {this.state.submitResult === null && <div className="form">
                        {this.buildForm()}
                        <button className="button secondary" onClick={this.reset}>Reset Form</button>
                        <button className="button" onClick={this.submit}>{this.state.submitting ? "Sending..." : "Submit"}</button>
                    </div>}
                    {hasEntered && !isValid && <p className="error">Please check your responses - make sure you have filled out every field</p>}
                    {this.state.submitResult === false && <p>We are sorry, but something went wrong. Please try again later, or email us directly</p>}
                    {this.state.submitResult === true && <p>Thanks for getting in touch!</p>}
                </Column>
            </Page>
        );
    }
}

Contact.propTypes = {
    data: PropTypes.object.isRequired,
    route: PropTypes.object
};

export default connect(function(state) {
    const { pages } = state.cful;
    return {
        data: pages.filter((page) => page.fields.pageType === 'contact')[0].fields
    };
})(Contact);
