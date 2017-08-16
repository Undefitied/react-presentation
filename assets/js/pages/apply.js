import React, { Component, PropTypes } from 'react';
import cx from 'classnames';
import Column from '../components/column';
import Hero from '../components/hero';
import Page from '../components/page';
import { connect } from 'react-redux';
import Field from '../components/field';
import Content from '../components/content';
import Promise from 'bluebird';
import { setTitle, setDescription } from '../actions/meta';
import isEmailish from '../lib/email-regexp';

import fetch from '../lib/fetch';

function hasEntry(v) {
    return v && v.trim().length;
}

const fields = [
    {
        name: 'companyName',
        label: 'What is your company name?',
        valid: hasEntry
    },
    {
        name: 'focusArea',
        label: 'To which focus area does your business fit?',
        valid: hasEntry
    },
    {
        name: 'location',
        label: 'Where are you based?',
        valid: hasEntry
    },
    {
        name: 'email',
        label: 'Contact email',
        valid: isEmailish
    },
    {
        name: 'www',
        label: 'What is your website address?',
        valid: hasEntry
    },
    {
        name: 'model',
        label: 'Describe your current business model (up to 500 characters)',
        valid: hasEntry,
        type: 'textarea'
    }
];

const subscribeField = [{
    name: 'subscribeEmail',
    label: 'Your email',
    valid: isEmailish
}];


class Apply extends Component {
    constructor() {
        super(...arguments);
        this.submit = this.submit.bind(this);
        this.submitSubscribe = this.submitSubscribe.bind(this);
        this.reset = this.reset.bind(this);
        this.update = this.update.bind(this);
        this.validate = this.validate.bind(this);
        const state = {
            valid: null,
            subscribeValid: null,
            applyResult: null,
            subscribeResult: null,
            submitting: false
        };
        fields.forEach(f => state[f.name] = '');
        subscribeField.forEach(f => state[f.name] = '');
        this.state = state;
    }
    componentWillMount() {
        this.props.dispatch(setTitle(this.props.data.metaTitle));
        this.props.dispatch(setDescription(this.props.data.metaDescription));
    }
    submit(e) {
        e.preventDefault();
        this.validate('valid', fields).then(() => {
            if (this.state.valid && !this.state.submitting) {
                this.setState({
                    submitting: true,
                    applyResult: null
                });
                const data = fields.reduce((d, f) => {
                    d[f.name] = this.state[f.name];
                    return d;
                }, {});
                fetch('/msg/apply', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then((r) => {
                    if (r.status !== 200) {
                        throw new Error('backend problem');
                    }
                    this.setState({
                        applyResult: 'Thanks for applying. Your application has been sent.'
                    });
                    this.reset();
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({
                        applyResult: false
                    })

                })
                .finally(() => {
                    this.setState({
                        submitting: false
                    });
                });
            }
        });
    }
    submitSubscribe(e) {
        e.preventDefault();
        this.validate('subscribeValid', subscribeField).then(() => {
            if (this.state.subscribeValid && !this.state.submitting) {
                this.setState({
                    submitting: true
                });
                const data = subscribeField.reduce((d, f) => {
                    d[f.name] = this.state[f.name];
                    return d;
                }, {});
                fetch('/msg/subscribe', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then((r) => {
                    if (r.status !== 200) {
                        throw new Error('backend problem');
                    }
                    alert('Thanks for subscribing.');
                    this.reset();
                })
                .catch((err) => {
                    console.log(err);
                    alert();
                })
                .finally(() => {
                    this.setState({
                        submitting: false
                    });
                });
            }
        });
    }
    validate(key = "valid", fields) {
        return new Promise((res) => {
            const nextState = {};
            nextState[key] = fields.reduce((valid, f) => {
                const name = f.name;
                const value = this.state[name];
                return !!(valid && f.valid(value));
            }, true);
            this.setState(nextState, res);
        });
    }
    reset(e) {
        e && e.preventDefault();
        if (this.state.submitting) return;
        const nextState = {
            valid: null
        };
        fields.forEach(f => { nextState[f.name] = ''; });
        this.setState(nextState);
    }
    update(field, e) {
        const nextState = {
            hasEntered: true
        };
        nextState[field] = e.target.value;
        this.setState(nextState);
    }
    buildForm(fields, validKey = 'valid') {
        return fields.map((f, idx) => {
            const name = f.name;
            const value = this.state[name];
            const isValid = (this.state[validKey] === null) ? true : f.valid(value);
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
            <Page key={data.url} className="apply enveloped" style={{
                paddingBottom: 0
            }}>
                <Hero data={heroData} />
                <Column>
                    <div className="two-thirds">
                        <Content components={data.components} />
                    </div>
                    <div className="third info">
                        <h2>Not ready to apply<br /> just yet?</h2>
                        <p>If your idea isn't quite ready, don't worry, just come back to us when you are.</p>
                        <p>In the meantime why not keep up with updates from the innovation hub:</p>
                        <form action="/dummy" method="get" onSubmit={this.submitSubscribe}>
                            {this.buildForm(subscribeField, 'subscribeValid')}
                            <input className="full" type="submit" value="Subscribe" />
                        </form>
                    </div>
                </Column>
                <div className="ribbon" style={{
                    marginTop: '6rem',
                    paddingBottom: '6rem',
                    paddingTop: '5rem'
                }}>
                    <Column>
                        <h1>Application Form</h1>
                        {typeof this.state.applyResult !== 'string' && <form className="apply-form form" action="/dummy" method="get" onSubmit={this.submit}>
                            {hasEntered && !isValid && <p className="error">Please check your responses - make sure you have completed every field</p>}
                            {this.buildForm(fields)}
                            <input type="submit" className="button" value={this.state.submitting ? 'Sending...' : 'Submit'} />
                        </form>}
                        {this.state.applyResult === false && <p className="error" style={{
                            fontWeight: 500,
                            fontStyle: 'italic'
                        }}>We are sorry but your application was not received. Please try again, or you can email us directly.</p>}
                        {this.state.applyResult && <p style={{
                            fontWeight: 500,
                            fontStyle: 'italic'
                        }}>Thank you for applying. Your application has been received.</p>}
                    </Column>
                </div>
            </Page>
        );
    }
}

Apply.propTypes = {
    data: PropTypes.object.isRequired,
    route: PropTypes.object
};

export default connect(function(state) {
    const { pages } = state.cful;
    return {
        data: pages.filter((page) => page.fields.pageType === 'apply')[0].fields
    };
})(Apply);
