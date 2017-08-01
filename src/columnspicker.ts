import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import FontIcon from "material-ui/FontIcon";
import IconButton from "material-ui/IconButton";
import { Component, createElement as __ } from "react";

import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";

declare var require: any;
// tslint:disable-next-line:no-var-requires
const Sortable: any = require("react-sortablejs");

import "./columnspicker.less";

export type Column_t = {
    name: string,
    label: string,
};

export type ColumnsPicker_t = {
    visible: boolean,
    allColumns: Column_t[],
    selectedColumns: string[], // list of names
    onDone: (selectedColumns: string[]) => void,
};

const sortableOptions = {
    animation: 150,
    sort: false,
    group: {
        name: "clone2",
        pull: true,
        put: true,
    },
};

const saveButtonStyle = {
    position: "relative",
    top: -30,
    left: 20,

};

type ColumnSet_t = {
    label: string,
    columns: string[], // list of column names.
};

type State_t = {
    opened: boolean, // open dialog.
    selected: string[], // list of labels
    sets: ColumnSet_t[],
    selectedSet: string, // selected ColumnSet label.
};

const storageKey = "users-column-sets";

//@Component ColumnsPicker
//@ComponentDescription "presents a dialog to select the columns to be displayed in the DocList"
//@ComponentDescription "this components allows also to save current column sets for later selection."
//@Method ColumnsPicker Returns ReactComponent
//@MethodDescription "ColumnsPicker({param1: value1, param2: value2, ...})"
//@Param visible boolean "controls the display of the dialog, displays it when put to true"
//@Param allColumns Column_t[] "all possible columns that can be selected"
//@Param selectedColumns string[] "list of selected column names "
//@Param onDone (selectedColumns: string[]) => void "'Done' button pressed on the dialog"

export class ColumnsPicker extends Component<ColumnsPicker_t, State_t> {

    private mappingByName: {[k: string]: Column_t};
    private mappingByLabel: {[k: string]: Column_t};

    constructor(props: ColumnsPicker_t) {
        super(props);

        this.mappingByName = this.props.allColumns.reduce((map, c) => { map[c.name] = c; return map; }, {});
        this.mappingByLabel = this.props.allColumns.reduce((map, c) => { map[c.label] = c; return map; }, {});

        this.state = {
            opened: false,
            selected: this.props.selectedColumns.map(a => this.mappingByName[a].label),
            sets: JSON.parse(localStorage.getItem(storageKey) || "[]"),
            selectedSet: "",
        };
    }

    private handleDone () {
        this.props.onDone(this.state.selected.map((c: string) => this.mappingByLabel[c].name));
        this.setState({ opened: false} as State_t);
    }

    private handleShowDialog () {
        this.setState({opened: true} as State_t);
    }

    private handleSave () {
        const set = this.state.sets.filter(s => s.label === this.state.selectedSet)[0];
        set.columns = this.state.selected.map(l => this.mappingByLabel[l].name  );
        localStorage.setItem(storageKey, JSON.stringify(this.state.sets));
    }

    private handleSaveAsNew () {
        const name: string = prompt("Column set name") || "DEFAULT";
        let list = this.state.sets;

        list.push({label: name, columns: this.state.selected.map(l => this.mappingByLabel[l].name  )});
        localStorage.setItem(storageKey, JSON.stringify(list));

        this.setState({sets: list, selectedSet: name} as State_t);
    }

    private handleChangeSet (event: any, index: number, value: string) {
        const set = this.state.sets.filter(s => s.label === value)[0];
        this.setState({
            selectedSet: value,
            selected: set.columns.map(a => this.mappingByName[a].label),
        } as State_t);
    }

    private handleDelete() {
        const newSets = this.state.sets.filter(s => s.label !== this.state.selectedSet);
        const selectedSet = newSets.length > 0 ? newSets[0] : null;
        this.setState({
            sets: newSets,
            selected: selectedSet ?  selectedSet.columns.map(a => this.mappingByName[a].label) : [],
            selectedSet: selectedSet ? selectedSet.label : "",
        } as State_t);
        localStorage.setItem(storageKey, JSON.stringify(newSets));
    }

    private handleChangeTargetSortable(items: string[]) {
        this.setState( {selected: items } as State_t );
    }

    private handleChangeSourceSortable(items: string[]) {
        const selected = this.props.allColumns.map(c => c.label).filter(a => items.indexOf(a) === -1);
        this.setState({ selected } as State_t );
    }

    public render() {

        const selected = this.state.selected.map((val: string) => __("li", {"key": val, "data-id": val}, val));
        const others = this.props.allColumns.filter(a => this.state.selected.indexOf(a.label) === -1).map(c => c.label).map((val: string) => __("li", {"key": val, "data-id": val}, val));

        const dialogButtons = [
            __(FlatButton, {
                key: "buttonDone",
                label: "Done",
                primary: true,
                keyboardFocused: false,
                onTouchTap: this.handleDone.bind(this),
                onClick: this.handleDone.bind(this),
            }),
        ];

        const dialog = __(Dialog, {
            key: "dialog",
            title: "Columns to display",
            actions: dialogButtons,
            modal: true,
            open: this.state.opened,
            className: "columns-picker-dialog",
            bodyClassName: "columns-picker-content",
            autoScrollBodyContent: true,
        }, [

            __("h3", {key: "hdr-1"}, "Saved column sets"),

            __(SelectField, {key: "sf", value: this.state.selectedSet, onChange: this.handleChangeSet.bind(this)}, this.state.sets.map(o => __(MenuItem, {value: o.label, primaryText: o.label}) )),
            __(FlatButton, {key: "bs", style: saveButtonStyle, label: "Save", onClick: this.handleSave.bind(this)}),
            __(FlatButton, {key: "bsa", style: saveButtonStyle, label: "Save as new...", onClick: this.handleSaveAsNew.bind(this)}),
            __(FlatButton, {key: "bd", style: saveButtonStyle, label: "Delete", onClick: this.handleDelete.bind(this)}),

            __("hr", {key: "hr-1"}),

            __("h3", {key: "hdr-2"}, "Columns to display"),
            __("div", {key: "selected"} ),
                __(Sortable, {
                    options: sortableOptions,
                    className: "block-list-target",
                    onChange: this.handleChangeTargetSortable.bind(this),
                    tag: "ul",
                }, selected),
            __("hr", {key: "hr-2"}),
            __("h3", {key: "hdr-3"}, "Other available columns"),
            __("div", {key: "other", style: {marginBottom: 40}},
                __(Sortable, {
                    options: sortableOptions,
                    className: "block-list-source",
                    onChange: this.handleChangeSourceSortable.bind(this),
                    tag: "ul",
                }, others),
              ),
            __("p", {key: "footer"}, "Drag and drop the name on the above section to display it."),
            ],
        );

        return __("div", {className: "columns-picker"}, [
            this.props.visible ? __(IconButton, {
                key: "button",
                keyboardFocused: false,
                onTouchTap: this.handleShowDialog.bind(this),
                onClick: this.handleShowDialog.bind(this),
            }, __(FontIcon, {className: "fa fa-gear"})) : undefined,
            dialog,
        ]);

    }
}