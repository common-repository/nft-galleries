import {FeedEditorField} from "spotlight/feed-editor/components/core/FeedEditorField"
import {CheckboxField} from "spotlight/admin-common/components/fields/CheckboxField/CheckboxField"

export function ShowNameField() {
  return (
    <FeedEditorField id="show-names" option="showNames" label="Show names">
      {props => <CheckboxField {...props} />}
    </FeedEditorField>
  )
}
