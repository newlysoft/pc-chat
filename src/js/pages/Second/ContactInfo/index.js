
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import pinyin from 'han';
import clazz from 'classname';

import classes from './style.css';
import Avatar from 'components/Avatar';
import Conversation from '../../../wfc/model/conversation';
import ConversationType from '../../../wfc/model/conversationType';

@inject(stores => ({
    chatTo: (conversation) => {
        stores.members.show = false;
        stores.chat.chatToN(conversation);
    },
    toggle: stores.contactInfo.toggle,
    show: stores.contactInfo.show,
    user: stores.contactInfo.user,
    setRemarkName: stores.userinfo.setRemarkName,
}))

@observer
class ContactInfo extends Component {
    state = {
        showEdit: true,
    };

    handleError(e) {
        e.target.src = 'http://i.pravatar.cc/200';
    }

    async handleEnter(e) {
        // 设置好友昵称
        // TODO
        if (e.charCode !== 13) return;

        var value = e.target.value.trim();
        var res = await this.props.setRemarkName(value, this.props.user.UserName);

        if (res) {
            this.props.refreshContacts({
                ...this.props.user,
                RemarkName: value,
                RemarkPYInitial: value ? (pinyin.letter(value)[0]).toUpperCase() : value,
            });
            this.toggleEdit(false);
        } else {
            this.props.showMessage('Failed to set remark name.');
        }
    }

    handleAction(user) {
        if (this.props.history.location.pathname !== '/') {
            this.props.history.push('/');
        }

        setTimeout(() => {
            //if (helper.isContact(user) || helper.isChatRoom(user.UserName)) {
            let conversation = new Conversation(ConversationType.Single, user.uid, 0);
            this.props.chatTo(conversation);
            this.props.toggle(false, null);
            document.querySelector('#messageInput').focus();
        });
    }

    render() {
        var user = this.props.user;
        var RemarkName = 'remarkName';
        var gradient = 'none';
        var fontColor = '#777';
        var buttonColor = '#777';

        var background = '#fff';

        return (
            <div className={classes.container}>
                {
                    user ? (<div
                        className={clazz(classes.hero)}
                        style={{
                            background,
                            color: fontColor,
                        }}>


                        <div className={classes.inner}>
                            <div
                                className={classes.mask}
                                style={{
                                    background: gradient
                                }} />
                            <Avatar src={user.portrait} />
                        </div>

                        <div
                            className={classes.username}
                            dangerouslySetInnerHTML={{ __html: user.displayName }} />


                        {
                            /* eslint-disable */
                            this.state.showEdit && (
                                <input
                                    autoFocus={true}
                                    defaultValue={RemarkName}
                                    onKeyPress={e => this.handleEnter(e)}
                                    placeholder="Type the remark name"
                                    ref="input"
                                    type="text" />
                            )
                            /* eslint-enable */
                        }
                        <div
                            className={classes.action}
                            onClick={() => this.handleAction(this.props.user)}
                            style={{
                                color: buttonColor,
                                opacity: .6,
                            }}>
                            Send Message
                        </div>
                    </div>
                    ) : (
                            <div className={clazz({
                                [classes.noselected]: true,
                            })}>
                                <img
                                    className="disabledDrag"
                                    src="assets/images/noselected.png" />
                                <h1>No Contact selected :(</h1>
                            </div>
                        )
                }
            </div>
        );
    }
}

export default withRouter(ContactInfo);
