import {NewsState} from "spotlight/admin-common/stores/news";

export const selectNewsMessages = (state: NewsState) => state.news.messages;
export const selectIsNewsOpen = (state: NewsState) => state.news.isOpen;
export const selectIsNewsHidden = (state: NewsState) => state.news.isHidden;
