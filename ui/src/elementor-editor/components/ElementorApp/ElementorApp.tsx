import React from "react";
import classes from "./ElementorApp.pcss";
import {Router} from "react-router-dom";
import {createBrowserHistory} from "history";
import {AnyAction} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {Provider, useDispatch, useSelector, useStore} from "react-redux";
import {loadElementorApp} from "spotlight/elementor-editor/store/elementor-app/thunks";
import {ElementorAppStore} from "spotlight/elementor-editor/store";
import {selectFeedById, selectFeeds} from "spotlight/admin-common/stores/feeds/selectors";
import {CommonEditor, LEAVE_MESSAGE} from "spotlight/admin-common/components/CommonEditor/CommonEditor";
import {classList} from "spotlight/utils/jsx/classes";
import {FeedEditorActions, FeedEditorState} from "spotlight/feed-editor/store";
import {Feed, saveFeed, StateWithFeeds} from "spotlight/admin-common/stores/feeds";
import {StateWithElementorApp} from "spotlight/elementor-editor/store/elementor-app";
import {createFeedOptions} from "spotlight/feed/options";

interface Props {
    rows: Array<HTMLElement>;
    loading: HTMLDivElement;
    select: HTMLSelectElement;
    editBtn: HTMLButtonElement;
    newBtn: HTMLButtonElement;
    value: string;
    update: (id: string) => void;
}

const history = createBrowserHistory();

export function ElementorApp(props: Props) {
    return (
        <Provider store={ElementorAppStore}>
            <ElementorAppInner {...props} />
        </Provider>
    );
}

/**
 * The elementor app that loads the necessary data from the server, listens for clicks made to the new/edit buttons,
 * and manages the editor's state.
 */
function ElementorAppInner({rows, loading, select, editBtn, newBtn, value, update}: Props) {
    const dispatch = useDispatch<ThunkDispatch<any, any, AnyAction>>();
    const store = useStore<StateWithElementorApp & StateWithFeeds & FeedEditorState>();
    const isLoaded = useSelector<StateWithElementorApp, boolean>(state => state.elementorApp.isLoaded);
    const feeds = useSelector(selectFeeds);

    const [isEditorOpen, setIsEditorOpen] = React.useState(false);
    const [editorFeed, setEditorFeed] = React.useState<Feed>(null);

    const openEditor = React.useCallback(() => {
        setIsEditorOpen(true);
    }, []);

    const closeEditor = React.useCallback(() => {
        setIsEditorOpen(false);
    }, []);

    const cancelEditor = React.useCallback(() => {
        if (!store.getState().editor.isDirty || confirm(LEAVE_MESSAGE)) {
            closeEditor();
        }
    }, [store, closeEditor]);

    /**
     * Opens the editor with the feed selected in the `select` element of the elementor widget control.
     * Triggered when the `editBtn` is clicked by the user.
     */
    const editSelectedFeed = React.useCallback(() => {
        const feed = selectFeedById(select.value)(store.getState());

        dispatch(FeedEditorActions.editFeed({
            feedName: feed.name,
            feedOptions: feed.options,
            reset: true,
        }));

        setEditorFeed(feed);
        openEditor();
    }, [dispatch, setEditorFeed, openEditor]);

    /**
     * Opens the editor with a new feed.
     * Triggered when the `newBtn` is clicked by the user.
     */
    const createNewFeed = React.useCallback(() => {
        setEditorFeed({
            id: null,
            name: "",
            options: createFeedOptions({}),
            usages: [],
        });
        openEditor();
    }, [setEditorFeed, openEditor]);

    const updateElements = React.useCallback((newValue?: string | number) => {
        const feeds = selectFeeds(store.getState());
        const hasFeeds = feeds.length > 0;
        const selectVal = (newValue ?? value);
        console.log('updateElements', newValue);

        // Toggle the select row depending on whether the user has fields
        rows.forEach((row, idx) => {
            row.style.display = (idx === 0 && !hasFeeds) ? "none" : "flex";
        });

        // Replace the `select` element's children with new options, one for each feed
        while (select.options.length > 0) {
            select.remove(select.options.length - 1);
        }
        if (selectVal && selectFeedById(selectVal)(store.getState()) === undefined) {
            select.add(createOptionElement(selectVal, "(Missing feed)", true));
        }

        feeds.forEach(feed => {
            select.add(createOptionElement(feed.id.toString(), Feed.getLabel(feed), selectVal === feed.id.toString()));
        });

        // Update the new button's text
        newBtn.textContent = hasFeeds
            ? "Create a new feed"
            : "Design your feed";

        // Select the value in the `select` element and update the preview, if a different new value was given
        if (newValue !== value) {
            select.value = newValue.toString();
            update(select.value);
        }
    }, [feeds, store, select, value, update]);

    /**
     * Runs when the `loader` has finished running all the loading functions.
     */
    const onFinishedLoading = React.useCallback(() => {
        updateElements(value);
        loading.remove();
    }, [value, updateElements]);

    /*
     * Triggered when the save button in the editor is clicked.
     */
    const onEditorSave = React.useCallback(async (feed: Feed) => {
        const savedFeed = await dispatch(saveFeed(feed));

        setTimeout(closeEditor, 150);
        setTimeout(() => {
            updateElements(savedFeed.payload.id);
        }, 100);
    }, [dispatch, updateElements, closeEditor]);

    React.useEffect(() => {
        if (isLoaded) {
            onFinishedLoading();
        } else {
            dispatch(loadElementorApp()).then(onFinishedLoading);
        }

        editBtn.addEventListener("click", editSelectedFeed);
        newBtn.addEventListener("click", createNewFeed);

        return () => {
            editBtn.removeEventListener("click", editSelectedFeed);
            newBtn.removeEventListener("click", createNewFeed);
        };
    }, [isLoaded]);

    return isEditorOpen && (
        <Router history={history}>
            <div className={classList(classes.root, "wp-core-ui-override wp-core-ui spotlight-modal-target")}>
                <div className={classes.shade} onClick={cancelEditor} />

                {isLoaded && (
                    <div className={classes.container}>
                        <CommonEditor
                            feed={editorFeed}
                            onSave={onEditorSave}
                            onCancel={cancelEditor}
                            saveBtnText="Save and embed"
                            canAlwaysCancel
                            confirmOnCancel
                        />
                    </div>
                )}
            </div>
        </Router>
    );
}

function createOptionElement(value: string | number, text: string, selected?: boolean, disabled?: boolean) {
    const elem = document.createElement("option");
    elem.value = value.toString();
    elem.text = text;

    if (selected) {
        elem.selected = true;
    }

    if (disabled) {
        elem.disabled = true;
    }

    return elem;
}
