import React from 'react';
import {Button, Form, Input} from 'antd';
import {userLogin} from '../../actions/user';
import '../../styles/LoginForm.less';

const HelpMsg = {
    username: {
        missing: '请输入您的姓名',
        incorrect: '姓名输入错误'
    },
    password: {
        missing: '请输入您的身份证号',
        incorrect: '身份证号码格式错误'
    }
};

class _LoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            username: {
                hasValue: false,
                validStatus: '',
                helpMsg: ''
            },
            password: {
                hasValue: false,
                validStatus: '',
                helpMsg: ''
            }
        };
    }
    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields(async (err, { username, password }) => {
            if (err) {
                let vstatus = {};
                Object.keys(err).forEach(key => {
                    vstatus[key] = {
                        hasValue: false,
                        validStatus: 'error',
                        helpMsg: err[key].errors[0].message
                    };
                });
                this.setState({...vstatus});
            } else {
                const {user, errorMsg} = await userLogin(username, password);
                if (!user || !user.token) {
                    this.setState({
                        username: {
                            hasValue: errorMsg.username !== 'missing',
                            validStatus: errorMsg.username !== '' ? 'error' : '',
                            helpMsg: HelpMsg.username[errorMsg.username]
                        },
                        password: {
                            hasValue: errorMsg.password !== 'missing',
                            validStatus: errorMsg.password !== '' ? 'error' : '',
                            helpMsg: HelpMsg.password[errorMsg.password]
                        }
                    });
                } else {
                    this.props.handleLogin && this.props.handleLogin(user);
                }
            }
        });
    }

    inputChange = (key, value) => {
        let vstatus = {...this.state};
        vstatus[key] = {
            hasValue: !!value,
            validStatus: value === '' ? 'error' : '',
            helpMsg: value === '' ? HelpMsg[key].missing : ''
        };
        // for other fields, clear error msg
        Object.keys(vstatus).forEach(tempKey => {
            if (vstatus[tempKey].hasValue) {
                vstatus[tempKey] = {
                    hasValue: true,
                    validStatus: '',
                    helpMsg: ''
                };
            }
        });
        this.setState({...vstatus});
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} className='login-form '>
                <Form.Item label='考生姓名' validateStatus={this.state.username.validStatus} help={this.state.username.helpMsg}>
                    {getFieldDecorator('username', { rules: [{ message: HelpMsg.username.missing }] })(
                        <Input placeholder={'请输入您的姓名'} onChange={e => this.inputChange('username', e.target.value)}/>
                    )}
                </Form.Item>
                <Form.Item label='身份证号' validateStatus={this.state.password.validStatus} help={this.state.password.helpMsg}>
                    {getFieldDecorator('password', { rules: [{ message: HelpMsg.password.missing }] })(
                        <Input placeholder={'请输入正确的身份证号码'} onChange={e => this.inputChange('password', e.target.value)}/>
                    )}
                </Form.Item>
                <div className='login-footer'>
                    <Button type='primary' htmlType='submit' className='login-button'>
                        开始答题
                    </Button>
                </div>
            </Form>
        );
    }
}

const LoginForm = Form.create()(_LoginForm);

export default LoginForm;
