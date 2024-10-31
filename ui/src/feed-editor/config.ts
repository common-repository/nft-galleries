import {ComponentType, ReactElement} from "react"
import {ConnectSidebar} from "spotlight/feed-editor/components/sidebars/ConnectSidebar/ConnectSidebar"
import {DesignSidebar} from "spotlight/feed-editor/components/sidebars/DesignSidebar"
import {FeedOptions} from "spotlight/feed"
import {fn} from "spotlight/utils/functions"
import {ModerateTab} from "spotlight/feed-editor/components/tabs/ModerateTab"
import {ChildProps as FeedEditorFieldChildProps} from "spotlight/feed-editor/components/core/FeedEditorField"
import {Wallet} from "spotlight/common/modules/wallets"
import {Token} from "spotlight/common/modules/tokens"

export type FakePreview = {
  wallet: Wallet;
  tokens: Token[];
}

export type FeedEditorConfig = {
  tabs: Tab[];
  isPro: boolean;
  isDemo: boolean;
  saveBtnText: string;
  cancelBtnText: string;
  showSaveBtn: boolean;
  showCancelBtn: boolean;
  showNameField: boolean;
  useSettings: boolean;
  showSettings: boolean;
  canAlwaysCancel: boolean;
  onSave: (name: string, options: FeedOptions) => Promise<any>;
  onCancel: () => void;
  selectMediaField: (props: FeedEditorFieldChildProps) => ReactElement;
  fakePreview: FakePreview;
};

export type Tab = {
  id: string;
  label: string;
  isPro?: boolean;
  // If true, the tab will be disabled if the editor's feed has no sources selected
  requireSources?: boolean;
  // A tab can choose to either provide a component that renders the entire editor tab ...
  component?: ComponentType;
  // ... or provide individual sidebar and viewport components. The viewport component can be omitted to use the
  // editor's default viewport, which is the feed preview
  sidebar?: ComponentType;
  viewport?: ComponentType;
};

export const FeedEditorDefaultConfig: FeedEditorConfig = {
  isPro: false,
  isDemo: false,
  saveBtnText: "Save",
  cancelBtnText: "Cancel",
  showSaveBtn: true,
  showCancelBtn: true,
  showNameField: true,
  useSettings: true,
  showSettings: true,
  canAlwaysCancel: false,
  onSave: () => Promise.resolve(null),
  onCancel: fn.noop,
  selectMediaField: () => null,
  fakePreview: {
    wallet: {
      address: "0x00000000000000000000000000",
      name: "My wallet",
    },
    tokens: [],
  },
  tabs: [
    {
      id: "connect",
      label: "Connect",
      sidebar: ConnectSidebar,
    },
    {
      id: "design",
      label: "Design",
      sidebar: DesignSidebar,
    },
    // {
    //     id: "filter",
    //     label: "Filter",
    //     isPro: true,
    //     requireSources: true,
    //     sidebar: FilterSidebar,
    // },
    {
      id: "moderate",
      label: "Moderate",
      isPro: true,
      requireSources: true,
      component: ModerateTab,
    },
  ],
}
