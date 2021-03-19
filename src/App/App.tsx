import { BrowserRouter, Route, Link } from 'react-router-dom';
import './App.scss';
import '../i18n';
import { useTranslation } from 'react-i18next';
import Secured from '../components/Secured';
import Welcome from '../components/Welcome';

const App =() => {

  const { t } = useTranslation();

  document.title = t('translation:title');

  return (
    <BrowserRouter>
       <div>
         <ul>
           <li><Link to="/">landing Page</Link></li>
           <li><Link to="/secured">Secured component</Link></li>
         </ul>
         {/* <Route exact path="/" render={() => <div>not Secured</div>} /> */}
         <Route path="/" component={ Welcome} />
         <Route path="/secured" component={ Secured }/>
       </div>
     </BrowserRouter>  
    // <div>hallo</div>
  );
}

export default App;
