import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom';

interface PrivateRouteParams extends RouteProps {
    component:
      | React.ComponentType<RouteComponentProps<any>>
      | React.ComponentType<any>,
      roles?: string[]
  }

  export function PrivateRoute({
    component: Component,
    roles,
    ...rest}: PrivateRouteParams) {

    const { keycloak, initialized } = useKeycloak();

    const isAutherized = () => {
        console.log("initialized: " + initialized);
        if (keycloak && roles) {
            console.log("isAutherized:" );
            return roles.some(role  => {
                // In keycloak there are two ways of assiging roles to the user 
                // You can assign roles to realm & client 
                // In that case you have to use both scenarios with hasRealmRole & hasResourceRole
                const realm =  keycloak.hasRealmRole(role);
                const resource = keycloak.hasResourceRole(role);

                console.log("realmaccess: " + realm);
                console.log("resourceaccess: " + resource);
                
                return realm || resource;
            });
        }
        return false;
    }

    return (
        <Route
          {...rest}
          render={(props) =>
            isAutherized() ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: '/',
                  state: { from: props.location },
                }}
              />
            )
          }
        />
      )
}

export default PrivateRoute;