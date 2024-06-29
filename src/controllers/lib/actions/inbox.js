import { Frame, Elements } from "not-bulma";

const { notTable } = Frame;
const { UICommon } = Elements;

const ACTION = "inbox";

export default class NotificationActionInbox {
    static async run(controller) {
        try {
            await controller.preloadVariants(ACTION);

            controller.setBreadcrumbs([
                {
                    title: "not-notification:list",
                    url: controller.getModelURL(),
                },
            ]);

            if (controller.ui[ACTION]) {
                return;
            } else {
                controller.$destroyUI();
            }

            controller.ui[ACTION] = new notTable(
                NotificationActionInbox.prepareOptions(controller)
            );
            controller.emit(`after:render:${ACTION}`);
        } catch (e) {
            controller.report(e);
            controller.showErrorMessage(e);
        }
    }

    static prepareOptions(controller) {
        const DEFAULT_OPTIONS_TABLE = {
            interface: {
                combined: true,
                combinedAction: "inbox",
                factory: controller.getInterface(),
            },
            preload: {},
            pager: {
                size: 50,
                page: 0,
            },
            filter: undefined,
            endless: false,
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
                    maxLength: 100,
                    searchable: true,
                    sortable: true,
                },
                {
                    path: ":text",
                    title: "not-notification:fieldText",
                    searchable: true,
                    sortable: true,
                    maxLength: 100,
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
                        return [
                            {
                                value,
                            },
                        ];
                    },
                },
                {
                    path: ":_id",
                    title: "not-notification:fieldAction",
                    type: "button",
                    preprocessor: (value) => {
                        return [
                            {
                                action: () => controller.goDetails(value),
                                title: "not-notification:actionDetails",
                                size: "small",
                            },
                            {
                                action: () => controller.goDelete(value),
                                color: "danger",
                                title: "not-notification:actionDelete",
                                size: "small",
                                style: "outlined",
                            },
                        ];
                    },
                },
            ],
        };
        const TABLE_OPTIONS = {
            options: {
                targetEl: controller.getContainerInnerElement(),
                ...DEFAULT_OPTIONS_TABLE,
            },
        };
        return TABLE_OPTIONS;
    }
}
