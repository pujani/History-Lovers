//
import './App.css';
import Home from '../src/pages/Home';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import Create_A_Learning_Plan from './pages/Create_A_Learning_Plan';
import ViewPlans from './pages/ViewPlans';
import AddTopics from './pages/AddTopics';
import UpdateTopic from './pages/UpdateTopic';
import RetriveAllPlans from './pages/RetriveAllPlans';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/create_a_learning_plan/:userId" element={<Create_A_Learning_Plan/>}/>
        <Route path="/viewPlans/:userId" element={<ViewPlans/>}/>
        <Route path="/addTopics/:planId" element={<AddTopics/>}/>
        <Route path="/updateLecture/:topicId" element={<UpdateTopic/>}/>
        <Route path="/retriveAllUser/:userId" element={<RetriveAllPlans/>}/>
      </Routes>
    </Router>
  );
}

export default App;