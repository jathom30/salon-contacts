import { Chair } from "assets";
import { FlexBox } from "components/Box";
import React from "react";

export const NotFound = () => {
  return (
    <div className="NotFound">
      <FlexBox gap="1rem" padding="2rem" flexDirection="column" alignItems="center">
        <Chair />
        <FlexBox flexDirection="column" alignItems="center">
          <h1>404: Not found</h1>
          <p>Please return to the previous screen and try again.</p>
        </FlexBox>
      </FlexBox>
    </div>
  )
}