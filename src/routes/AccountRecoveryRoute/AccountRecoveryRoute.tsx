import { FlexBox } from "components";
import React, { useEffect } from "react";
import { useIdentityContext } from "react-netlify-identity";
import { useQuery } from "react-query";

export const AccountRecoveryRoute = () => {
  const {recoverAccount, param, user} = useIdentityContext()
  const {token} = param

  useEffect(() => {
    console.log(param)
  }, [param])

  useQuery(['recover', token], () => recoverAccount(), {
    enabled: !!param.token,
    onSuccess: () => {
      console.log(user)
    }
  })

  return (
    <div className="AccountRecoveryRoute">
      <FlexBox flexDirection="column" gap="1rem" alignItems="center" padding="2rem">
        <h1>Password recovery</h1>
        {token || 'none'}
          {/* <p>Following the link below will log you in and redirect you to the account settings page where you will have the opportunity to update your password and any other user related settings.</p>
          <Button type="submit"  onClick={() => recoverAccountQuery.refetch()}>Go to Account settings</Button> */}
      </FlexBox>
    </div>
  )
}