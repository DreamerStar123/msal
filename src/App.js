import { useState, useEffect } from "react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";
import {
  useMsal,
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

function ProtectedComponent() {
  const { instance, inProgress, accounts } = useMsal();
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    if (!apiData && inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: ["user.read"],
        account: accounts[0],
      };
      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          console.log(accessTokenResponse);

          // Call your API with token
          // callApi(accessToken).then((response) => {
          //   setApiData(response);
          // });
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenPopup(accessTokenRequest)
              .then(function (accessTokenResponse) {
                // Acquire token interactive success
                let accessToken = accessTokenResponse.accessToken;
                // Call your API with token
                // callApi(accessToken).then((response) => {
                //   setApiData(response);
                // });
              })
              .catch(function (error) {
                // Acquire token interactive failure
                console.log(error);
              });
          }
          console.log(error);
        });
    }
  }, [instance, accounts, inProgress, apiData]);

  return <p>Return your protected content here: {apiData}</p>;
}

function App() {
  const { instance } = useMsal();
  const [refreshToken, setRefreshToken] = useState('Refresh token');

  const handleRefreshToken = () => {
    let refreshToken = null;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const item = JSON.parse(localStorage.getItem(key));
      if (item.credentialType === 'RefreshToken') {
        refreshToken = item.secret;
        break;
      }
    }
    setRefreshToken(refreshToken);
  }

  async function signInClickHandler(instance) {
    const loginRequest = {
      scopes: ["Calendars.ReadWrite"]
    };
    await instance.loginPopup(loginRequest);
  }

  function signOutClickHandler(instance) {
    const logoutRequest = {
      // account: instance.getAccountByHomeId(homeAccountId),
      // mainWindowRedirectUri: "your_app_main_window_redirect_uri",
      // postLogoutRedirectUri: "your_app_logout_redirect_uri",
    };
    instance.logoutPopup(logoutRequest);
  }

  return (
    <>
      {/* <AuthenticatedTemplate> */}
      <ProtectedComponent />
      <button onClick={() => signOutClickHandler(instance)}>Sign Out</button>
      <button onClick={handleRefreshToken}>
        Get Refresh Token
      </button>
      <p id="refreshToken">{refreshToken}</p>
      {/* </AuthenticatedTemplate> */}
      {/* <UnauthenticatedTemplate> */}
      <p>This will only render if a user is not signed-in.</p>
      <button onClick={async () => {
        await signInClickHandler(instance);
        handleRefreshToken();
      }}>Sign In</button>
      {/* </UnauthenticatedTemplate> */}
    </>
  );
}

export default App;
