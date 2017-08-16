import React, { Component } from 'react';
import Column from './column';
import BlockWrap from './block-wrap';
import Field from './field';
import Select from 'react-select';
import fetch from 'isomorphic-fetch';
import isEmailish from '../lib/email-regexp';
import config from '../lib/config/index';
import cx from 'classnames';
import { parseString } from 'xml2js';
import Dropzone from 'react-dropzone';
import {polyfill} from 'es6-promise';
polyfill();

function hasEntry(v) {
    return v && v.trim().length;
}

const placeholder="Referred from";

const fields = [
    {
        name: 'first_name',
        label: 'First name',
        valid: hasEntry
    },
    {
        name: 'last_name',
        label: 'Last name',
        valid: hasEntry
    },
    {
        name: 'email',
        label: 'Contact email',
        valid: isEmailish
    },
    {
        name: 'phone',
        label: 'Phone',
        valid: hasEntry
    },
];

export default class ApplicationForm extends Component {
    constructor() {
        super(...arguments);
        this.submit = this.submit.bind(this);
        this.reset = this.reset.bind(this);
        this.update = this.update.bind(this);
        this.validate = this.validate.bind(this);
        const state = {
            valid: null,
            messageValid: null,
            applyResult: null,
            messageResult: null,
            submitting: false
        };
        fields.forEach(f => state[f.name] = '');
        state.message = '';
        this.state = state;
    }

    componentDidMount() {

        //disable mobile keyboard (select option only)
        const input = document.querySelector('.Select-input').children[0];
        input.setAttribute('readonly','readonly');

        const _this = this;
        let options = [];
        this.props.data.referredFrom.forEach(function(item){
            options.push({
                id: item.fields.id,
                label: item.fields.label,
                value: item.fields.label
            });
        });

        _this.setState({options});

        fetch(config.get("XMLJobsUrl"), {
            method: 'GET',
        })
            .then(function(response){
            return response.text()
        })
            .then(function(data){
                parseString(data, function (err, result) {
                    const positionId = Number(window.location.href.substr(window.location.href.lastIndexOf('/') + 1));

                    let position = {};
                    let positions =  result['workzag-jobs'].position;
                    for (var i = 0; i < positions.length; i++) {
                        if (Number(positions[i].id) === positionId) {
                            position = positions[i];
                            break;
                        }
                    }
                    _this.setState({position});
                });
            });
    }

    submit(e) {
        e.preventDefault();

        this.validate('valid', fields).then(() => {
            if (this.state.valid && !this.state.submitting) {
                this.setState({
                    submitting: true,
                    applyResult: null
                });

                const data = new FormData();

                data.append("company_id", config.get("companyId"));
                data.append("access_token", config.get("accessToken"));
                data.append("job_position_id", this.state.position.id[0]);

                if (this.state.files) {
                    this.state.files.forEach((item, index) => {
                        data.append('documents[]', this.state.files[index], this.state.files[index].name);
                    });
                }

                if (this.state.active) {
                    data.append("recruiting_channel_id", this.state.active.id);
                }


                if (this.props.data.messageField) {
                    data.append("message", this.state.message);
                }

                fields.forEach((item) => {
                    data.append(item.name, this.state[item.name]);
                });

                fetch(config.get("personioPostLink"), {
                    method: 'POST',
                    body: data
                })
                    .then((r) => {
                        if (r.status !== 200) {
                            throw new Error('backend problem');
                        }
                        this.setState({
                            applyResult: 'Thanks for applying. Your application has been sent.'
                        });

                        const formSection = document.querySelector('.form-section');
                        window.scrollTo(0, formSection.offsetTop);

                        this.reset();
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({
                            applyResult: false
                        })

                    })
                    .then(() => {
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

    onSelectChange(data){
        this.setState(
            {
                active: {
                    label: data.label,
                    id: data.id
                }
            }
        );
    }

    onDrop(files) {
        const callback = () => {
            const field = document.getElementById('files-placeholder');
            const input = field.nextElementSibling;
            const defaultValue = 'Click to select multiple files or use drag-and-drop. Max file size 5mb';

            if (input.files && input.files.length > 1) {
                field.innerHTML = input.files.length + ' files';
            } else if(files.length){
                field.innerHTML = files[0].name;
            } else {
                field.innerHTML = defaultValue;
            }
        };

        this.setState({
            files: files
        }, callback(files));
    }



    onInputKeyDown(event) {
        //disable manual input (select option only)
        event.preventDefault();
    }

    render() {
        const data = this.props.data;
        const hasEntered = this.state.valid !== null;
        const isValid = this.state.valid;
        const active = this.state.active ? this.state.active.label : placeholder;

        const messageFieldBlock = data.messageField
            ?
            <div className="row" onChange={this.update.bind(this, "message")}>
                <label>Your message</label>
                <textarea className="textarea" name="message" label="Your message"/>
            </div>
            : null;

        return (
            <BlockWrap className="block-wrap">
                <div className="form-section">
                    <Column>
                        <h2 className="heading">Application Form</h2>
                        {typeof this.state.applyResult !== 'string' && <form className="form" id="application-form" action="/dummy" method="get" onSubmit={this.submit}>
                            {hasEntered && !isValid && <p className="error">Please check your responses - make sure you have completed every field</p>}
                            {this.buildForm(fields)}
                            <Select
                                instanceId='select'
                                name="form-field-name"
                                options={this.state.options}
                                placeholder={placeholder}
                                value={active}
                                onInputKeyDown={this.onInputKeyDown.bind(this)}
                                onChange={this.onSelectChange.bind(this)}
                            />
                            <h3 className="subtitle">Documents</h3>
                            <p className="description">Please upload any documents that you want to include with your application. CV and cover letter are required, and you should also attach copies of your references and certificates.</p>

                            <Dropzone className="dropzone"
                                accept={".pdf,.docx,.doc,.jpg,.zip,.png,.txt,.jpeg,.odt,.xlsx,.rtf,.htm,.xls,.p7s,.pptx,.pages,.rar,.ppt,.gif,.tif,.html,.msg,.asc,.py,.tiff,.wps,.bmp,.7z,.c,.csv,.h,.ics,.vcf,.cpp,.dat,.dotx,.mp4,.numbers,.eps,.gdoc,.gz,.java,.key,.mov,.mp3,.ods,.otf,.odp,.odg,.r,.ra,.rtfd,.textclipping,.txz,.webarchive,.xml,.xps,.md"}
                                multiple={true}
                                maxSize={5242880}
                                onDrop={this.onDrop.bind(this)}>
                                <div id="files-placeholder">Click to select multiple files or use drag-and-drop</div>
                            </Dropzone>

                            {messageFieldBlock}
                            <input type="submit" className="button button-submit" value={this.state.submitting ? 'Sending...' : 'Send'} />
                        </form>}
                        {this.state.applyResult === false && <p className="error" style={{
                            fontWeight: 500,
                            fontStyle: 'italic'
                        }}>We are sorry but your application was not received. Please try again, or contact us via Contact page.</p>}
                        {this.state.applyResult && <p style={{
                            fontWeight: 500,
                            fontStyle: 'italic'
                        }}>Thank you for applying. Your application has been received.</p>}
                    </Column>
                </div>
            </BlockWrap>
        );
    }
};

