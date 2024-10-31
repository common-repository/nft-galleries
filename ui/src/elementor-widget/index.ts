import {feed} from "spotlight/front/front";
import JQuery from "jquery";

class SpotlightElementorWidget extends elementorModules.frontend.handlers.Base<{ $feed: JQuery }> {
    getDefaultSettings() {
        return {};
    }

    getDefaultElements() {
        return {
            $feed: this.$element.find("div.snft-feed"),
        };
    }

    bindEvents() {
        if (this.elements.$feed.length > 0) {
            feed(this.elements.$feed.get(0));
        }
    }
}

JQuery(window).on("elementor/frontend/init", () => {
    elementorFrontend.hooks.addAction("frontend/element_ready/snft-feed.default", ($element) => {
        elementorFrontend.elementsHandler.addHandler(SpotlightElementorWidget, {$element});
    });
});
