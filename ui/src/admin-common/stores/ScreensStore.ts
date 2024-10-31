import {ComponentType} from "react"
import {ParsedQuery} from "query-string"

export enum SCREENS {
    NEW_FEED = "new",
    EDIT_FEED = "edit",
    GALLERY_LIST = "galleries",
    SETTINGS = "settings",
}

export interface Screen {
    id: string;
    title: string;
    component: ComponentType;
    state?: ParsedQuery;
    position?: number;
    isHidden?:boolean;
    isDisabled?: () => boolean;
}

export namespace Screens {
    const list: Screen[] = [];

    export function getList(): readonly Screen[] {
        return list;
    }

    export function register(screen: Screen) {
        list.push(screen);
        sortScreens();

        return Screens;
    }

    export function getScreen(id: string): Screen {
        return list.find(screen => screen.id === id);
    }

    function sortScreens() {
        list.sort((s1, s2) => {
            const pos1 = s1.position ?? 0;
            const pos2 = s2.position ?? 0;

            return Math.sign(pos1 - pos2);
        });
    }
}
