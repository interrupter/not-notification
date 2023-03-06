const notNode = require("not-node");
const log = require("not-log")(module, "notification:model");
const { notError } = require("not-error");

const MODEL_NAME = "Notification";
const FIELDS = [
    ["title", { default: "" }, "title"],
    [
        "text",
        {
            default: "",
            placeholder: "not-notification:placeholderText",
            label: "not-notification:fieldText",
        },
        "description",
    ],
    ["link", { required: false }, "title"],
    ["owner", { required: true }],
    ["ownerModel", { required: true }],
    [
        "new",
        {
            label: "not-notification:fieldNew",
            searchable: true,
            sortable: true,
            default: true,
        },
        "active",
    ],
    ["createdAt", { sortable: true }],
];

exports.enrich = {
    versioning: true,
    validators: true,
    increment: false,
};

exports.thisModelName = MODEL_NAME;
exports.FIELDS = FIELDS;

exports.thisMethods = {
    async markAsRead() {
        this.new = false;
        return await this.save();
    },
};

exports.thisStatics = {
    async ownNotification(_id, owner, ownerModel = "User") {
        return this.makeQuery("findOne", { _id, owner, ownerModel }).exec();
    },
    async notify(message, owner, ownerModel) {
        try {
            const data = {
                title: message.title,
                text: message.text,
                owner,
                ownerModel,
                createdAt: new Date(),
            };
            if (message.link && message.link.length) {
                data.link = message.link;
            }
            return await this.add(data);
        } catch (e) {
            log.error(e);
            notNode.Application.report(
                new notError("notification.notify", { owner, ownerModel }, e)
            );
        }
    },
    async inbox(skip, size, filter, owner, ownerModel) {
        try {
            return await this.listAndCount(
                skip,
                size,
                { createdAt: -1 },
                { ...filter, owner, ownerModel }
            );
        } catch (e) {
            log.error(e);
            notNode.Application.report(
                new notError(
                    "notification.inbox",
                    { filter, owner, ownerModel },
                    e
                )
            );
        }
    },
    async countNew(owner, ownerModel) {
        try {
            return await this.countWithFilter({ owner, ownerModel, new: true });
        } catch (e) {
            log.error(e);
            notNode.Application.report(
                new notError("notification.countNew", { owner, ownerModel }, e)
            );
        }
    },
    async markAsRead(_id, owner, ownerModel) {
        try {
            await this.update(
                { _id, owner, ownerModel, new: true },
                { new: false }
            );
        } catch (e) {
            log.error(e);
            notNode.Application.report(
                new notError(
                    "notification.markAsRead",
                    { owner, ownerModel },
                    e
                )
            );
        }
    },
    async markAllAsRead(owner, ownerModel) {
        try {
            await this.update(
                { owner, ownerModel, new: true },
                { new: false },
                true
            );
        } catch (e) {
            log.error(e);
            notNode.Application.report(
                new notError(
                    "notification.markAllAsRead",
                    { owner, ownerModel },
                    e
                )
            );
        }
    },
};
