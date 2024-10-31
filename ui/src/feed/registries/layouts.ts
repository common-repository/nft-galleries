import {FeedLayout} from "spotlight/feed/types";
import {Dictionary} from "spotlight/utils/dictionary";

export const FeedLayouts = new class {
    protected layouts: Dictionary<FeedLayout> = {};

    add(name: string, layout: FeedLayout): void {
        Dictionary.set(this.layouts, name, layout);
    }

    get(id: string): FeedLayout | undefined {
        return Dictionary.get(this.layouts, id ?? "grid") ?? Dictionary.values(this.layouts)[0] ?? undefined;
    }
};
