// import React, { Component } from 'react';
// import { useHistory } from "react-router-dom";
// import Keycloak from 'keycloak-js';

// class Secured extends Component {

//   constructor(props) {
//     super(props);
//     this.state = { keycloak: null, authenticated: false };
//   }

//   componentDidMount() {
//     // componentWillMount() {
//     //const history = useHistory();

//     const keycloak = Keycloak('/keycloak.json');
//     if(this.state.authenticated) {
//       return;
//     }
    
//     //console.log("Keycloak:");
//     //console.log(keycloak);
    
//     //keycloak.init({
//       //onLoad: 'check-sso',
//       //silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
//       keycloak.init({onLoad: 'login-required'}).then(authenticated => {
//         if(!authenticated) {
//           //this.state({authenticated: true});
//           console.log("Nicht authentifiziert!");
//           this.setState({ keycloak: keycloak, authenticated: authenticated });
//         } else {
//           console.log("Ich bin drin!");
//           alert("ich bin drin");
//           this.setState({ keycloak: keycloak, authenticated: authenticated });
//         }
//         console.log(this);
//         alert(this);
//         // keycloak.login();
//         // keycloak.logout();
//         var authenticatedUser = keycloak.idTokenParsed.name;
//         alert(keycloak.tokenParsed.exp);
//         alert(authenticatedUser);
//         alert("Token: " + keycloak.idToken);
//         alert("RedirectUri: " + keycloak.redirectUri);
//         alert("Rollen: " + keycloak.realmAccess.roles);
//         alert("Authenticated User: " + keycloak.realmAccess.authenticatedUser);
//         alert("nach login");
//         //this.setState({ keycloak: keycloak, authenticated: authenticated });
//         alert(this.state.authenticated);
//         //history.push("/");

//       })
//   }

//   render() {
//     if (this.state.keycloak) {
//       if (this.state.authenticated) return (
//         <div>
//           <p>This is a Keycloak-secured component of your application. You shouldn't be able
//           to see this unless you've authenticated with Keycloak.</p>
//         </div>
//       ); else return (<div>Unable to authenticate!</div>)
//     }
//     return (
//       <div>Initializing Keycloak...</div>
//     );
//   }
// }
// export default Secured;