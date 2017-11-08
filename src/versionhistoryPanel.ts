import Avatar from "material-ui/Avatar";
import Divider from "material-ui/Divider";
import { List, ListItem } from "material-ui/List";
import Paper from "material-ui/Paper";
import ActionAlarm from "material-ui/svg-icons/action/alarm";
import ActionAssignment from "material-ui/svg-icons/action/assignment";
import ChangeHistory from "material-ui/svg-icons/action/change-history";
import Input from "material-ui/svg-icons/action/input";
import Subtitles from "material-ui/svg-icons/av/subtitles";
import SocialPerson from "material-ui/svg-icons/social/person";

import * as moment from "moment";
import { Component, createElement as __, DOM as _, ReactElement } from "react";

import "./versionhistoryPanel.less";

export type Version_t = {
    title: string
    editor: string,
    editDate: string,
    editComment: string,
    versionNumber: string,
    nodeRef: string,
};

export type VersionsHistoryPanel_t = {
    show: boolean,
    versions: Version_t[],
};

const iconsize = 30;

const avatarStyle = {
    color: "rgb(255, 255, 255)",
    backgroundColor: "rgb(188, 188, 188)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    borderRadius: "50%",
    height: "30px",
    µwidth: "30px",
};

const avatarSvgStyle = {
    display: "inline-block",
    color: "rgb(255, 255, 255)",
    fill: "rgb(255, 255, 255)",
    height: "18px",
    width: "18px",
    transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    fontSize: "18px",
    margin: "6px",
};

const avatar = _.div({size: iconsize, style: avatarStyle}, [
   _.svg({viewBox: "0 0 24 24", style: avatarSvgStyle}, [
      _.path({d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),
   ]),
]);

export function VersionsHistoryPanel({show, versions}: VersionsHistoryPanel_t): ReactElement<any> {
    if (show) {
        if (versions.length === 0) {
            return _.div({ className: "docversions" }, "Document has no version history.");
        }

        const versionItem = (v: Version_t) =>  _.div({className: "history-item"}, [
            _.div({}, [
                _.div({className: "history-version"}, [v.versionNumber]),
            ]),
            _.div({className: "history-meta-data"}, [
                _.div({className: "history-doc-name"}, [v.title]),
                _.div({className: "history-details"}, [
                    _.div({className: "history-avatar"}, [
                        avatar,
                    ]),
                    _.div({}, [
                        _.span({className: "history-user"}, [v.editor]),
                        _.span({className: "history-edited"}, [moment(new Date(Number.parseInt(v.editDate))).fromNow()]),
                        _.span({className: "history-comment"}, [v.editComment]),
                    ]),
                ]),
            ]),
        ]);

        return _.div({ className: "docversions" }, versions.map(v => versionItem(v)));
    } else {
        return _.div({});
    }
}
