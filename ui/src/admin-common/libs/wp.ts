declare namespace wp {
    interface PostType {
        slug: string;
        labels: {
            singularName: string;
            pluralName: string;
        };
    }

    interface Post {
        id: number;
        title: string;
        permalink: string;
    }

    interface MediaArgs {
        id?: string;
        title?: string;
        button?: { text: string };
        library?: { type: string };
        multiple?: boolean,
    }

    function media(args: MediaArgs): media.Frame;

    namespace media {
        interface LibraryOptions {
            id: string;
            title: string;
            priority: number;
            toolbar?: string;
            filterable?: string;
            library: unknown;
            multiple?: boolean;
            editable?: boolean;
        }

        interface State {
            get: (arg: "selection") => Selection;
        }

        interface Selection {
            models: Attachment[];
            length: number;
            multiple: boolean;

            add(attachmenst: Array<Attachment>);

            first(): Attachment;
        }

        interface Attachment {
            attributes: AttachmentAttributes;

            fetch();

            toJson();
        }

        interface AttachmentAttributes {
            id: string;
            url: string;
            width: number;
            height: number;
            type: AttachmentType;
        }

        const enum AttachmentType {
            IMAGE = "image",
            VIDEO = "video",
        }

        class Library {
            constructor(options: LibraryOptions);
        }

        class Frame {
            open();

            on(event: "open" | "close" | "ready" | "select" | "insert", callback: () => void);

            state(): State;
        }

        function attachment(id: number | string): Attachment;

        let frames: Array<Frame>;
    }
}

export default wp;
