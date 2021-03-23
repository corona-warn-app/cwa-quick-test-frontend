import React, { Component } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import { Redirect, Route, RouteProps, RouterProps } from 'react-router-dom';


interface Props {
    // component: any,
    component : Component,
    roles: string[]
}

//  const PrivateRoute: React.FC<Props> = ( { component, roles, ...rest } )  => {
    const PrivateRoute = (props: any) => {

    const { keycloak, initialized } = useKeycloak();

    const isAutherized = (roles: string[]) => {
        console.log("initialized: " + initialized);
        if (keycloak && roles) {
            console.log("isAutherized:" );
            return roles.some(r  => {
                // In keycloak there are two ways of assiging roles to the user 
                // You can assign roles to realm & client 
                // In that case you have to use both scinarios with hasRealmRole & hasResourceRole
                const realm =  keycloak.hasRealmRole(r);
                const resource = keycloak.hasResourceRole(r);
                console.log(roles);
                console.log(realm);
                console.log(resource);
                console.log(realm || resource);
                console.log("realmaccess: " + keycloak.realmAccess);
                console.log("Token: " + keycloak.idToken);
                if(keycloak.realmAccess) {
                    console.log(keycloak.realmAccess.roles);
                }
                
                return realm || resource;
            });
        }
        return false;
    }

    return (
        <Route
            render={routeprops => {
                console.log("routeprops: " + routeprops);
                return isAutherized(props.roles)
                    ? <Component {...routeprops} />
                    :  
                    <Redirect
                        to={{
                            pathname: '/',
                        }}
                    />
            }

            }
        />
    )
}

export default PrivateRoute;