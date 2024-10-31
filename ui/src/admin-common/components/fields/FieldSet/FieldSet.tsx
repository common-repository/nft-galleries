import React from "react";
import classes from "spotlight/admin-common/components/fields/FieldSet/FieldSet.pcss";
import {classList} from "spotlight/utils/jsx/classes";

export function FieldSet({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={classList(classes.root, className)} {...props} />;
}
