import { Frame, Elements } from "not-bulma";

const notCRUD = Frame.notCRUD;
const UICommon = Elements.UICommon;

const MODULE_NAME = "";
const MODEL_NAME = "notification";

const LABELS = {
    plural: "not-notification:labelPlural",
    single: "not-notification:labelSingle",
};

import NotificationActionInbox from "./actions/inbox.js";
import NotificationActionDetails from "./actions/details.js";

const ACTIONS = {
    inbox: NotificationActionInbox,
    details: NotificationActionDetails,
};

import NotificationRouter from "./router.js";

class ncNotification extends notCRUD {
    static MODULE_NAME = MODULE_NAME;
    static MODEL_NAME = MODEL_NAME;

    constructor(app, params) {
        super(app, `${MODULE_NAME}.${MODEL_NAME}`, {
            actions: ACTIONS,
            router: NotificationRouter,
        });
        this.setModuleName(MODULE_NAME.toLowerCase());
        this.setModelName(MODEL_NAME.toLowerCase());
        this.setOptions("names", LABELS);
        this.setOptions("Validators", {});
        this.setOptions("params", params);
        this.setOptions("list", {
            interface: {
                combined: true,
                factory: this.getInterface(),
            },
            endless: false,
            preload: {},
            sorter: {
                createdAt: -1,
            },
            actions: [],
            showSearch: true,
            idField: "_id",
            fields: [
                {
                    path: ":title",
                    title: "not-notification:fieldTitle",
                    searchable: true,
                    sortable: true,
                    maxLength: 100,
                },
                {
                    path: ":text",
                    title: "not-notification:fieldText",
                    searchable: true,
                    sortable: true,
                    maxLength: 100,
                },
                {
                    path: ":owner",
                    title: "not-notification:fieldOwner",
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":createdAt",
                    title: "not-notification:fieldCreatedAt",
                    sortable: true,
                    searchable: true,
                    preprocessor: (value) => {
                        return UICommon.formatTimestamp(
                            new Date(value).getTime()
                        );
                    },
                },
                {
                    path: ":new",
                    title: "not-notification:fieldNew",
                    type: "boolean",
                    sortable: true,
                    searchable: true,
                    preprocessor(value) {
                        return [{ value }];
                    },
                },
                {
                    path: ":_id",
                    title: "not-notification:fieldAction",
                    type: "button",
                    preprocessor: (value) => {
                        return [
                            {
                                action: () => this.goDetails(value),
                                title: "not-notification:actionDetails",
                                size: "small",
                            },
                            {
                                action: () => this.goDelete(value),
                                color: "danger",
                                title: "not-notification:actionDelete",
                                size: "small",
                                style: "outlined",
                            },
                        ];
                    },
                },
            ],
        });
        this.start();
        return this;
    }

    goInbox() {
        this.app
            .getWorking("router")
            .navigate(this.getModelActionURL(false, "inbox"));
    }

    goMarkAsRead(value) {
        this.app
            .getWorking("router")
            .navigate(this.getModelActionURL(value, "markAsRead"));
    }

    updateNotifications() {
        this.app.getService("nsNotification").update();
    }
}

export default ncNotification;
