import React, {useState} from "react";
import "spotlight/front/styles/front.css";
import {FeedState} from "spotlight/feed";
import {TokenFeed} from "spotlight/feed/components/TokenFeed";

interface Props {
    feedState: FeedState;
}

export function FrontApp({feedState}: Props) {
    const [state, setState] = useState<FeedState>(feedState);

    return (
        <div className="snft-app">
            <TokenFeed state={state} onUpdateState={setState} autoDevice autoLoad />
        </div>
    );
}
