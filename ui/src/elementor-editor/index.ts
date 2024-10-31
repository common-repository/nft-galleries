import React from "react";
import ReactDOM from "react-dom";
import JQuery from "jquery";
import {ElementorApp} from "spotlight/elementor-editor/components/ElementorApp/ElementorApp";

/**
 * Adds a handler to the `sli-select-feed` control that initializes the editor to open when the edit and new buttons
 * are clicked.
 */
elementor.addControlView("snft-select-feed", elementor.modules.controls.BaseData.extend({
    onReady() {
        const $rows = this.$el.find("div.snft-select-field-row") as JQuery;
        const $loading = this.$el.find("div.snft-select-loading") as JQuery;
        const $select = this.$el.find("select.snft-select-element") as JQuery;
        const $editBtn = this.$el.find("button.snft-select-edit-btn") as JQuery;
        const $newBtn = this.$el.find("button.snft-select-new-btn") as JQuery;

        if (!$select.length || !$editBtn.length || !$newBtn.length) {
            console.error("Could not initialize Spotlight editor. A necessary element is missing from the DOM", {
                $rows,
                $select,
                $editBtn,
                $newBtn,
            });

            return;
        }

        // Create a div on the body - this is where the app will be mounted
        const appNode = document.createElement("div");
        appNode.id = "spotlight-elementor-app";
        document.body.appendChild(appNode);

        // Create the app element using the obtained elements from the Elementor control
        const reactElem = React.createElement(ElementorApp, {
            rows: $rows.get(),
            loading: $loading[0],
            select: $select[0],
            editBtn: $editBtn[0],
            newBtn: $newBtn[0],
            value: this.elementSettingsModel.attributes.feed,
            update: (value: string) => this.updateElementModel(value),
        });

        // Render the app element on the created div
        ReactDOM.render(reactElem, appNode);
    },
    onBeforeDestroy() {
    },
    saveValue() {
    },
}));
