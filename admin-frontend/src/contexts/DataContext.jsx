import { createContext, useContext, useState, useEffect } from 'react';
import { sampleStudents } from '../data/sampleStudents';
import { sampleStaff } from '../data/sampleStaff';
import { sampleEvents } from '../data/sampleEvents';
import { sampleMaterials } from '../data/sampleMaterials';
import { sampleActivities } from '../data/sampleActivities';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState({ preKG: [], lkg: [], ukg: [] });
  const [staff, setStaff] = useState([]);
  const [events, setEvents] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      // Load from localStorage or use sample data
      const storedStudents = localStorage.getItem('students');
      const storedStaff = localStorage.getItem('staff');
      const storedEvents = localStorage.getItem('events');
      const storedMaterials = localStorage.getItem('materials');
      const storedActivities = localStorage.getItem('activities');

      setStudents(storedStudents ? JSON.parse(storedStudents) : sampleStudents);
      setStaff(storedStaff ? JSON.parse(storedStaff) : sampleStaff);
      setEvents(storedEvents ? JSON.parse(storedEvents) : sampleEvents);
      setMaterials(storedMaterials ? JSON.parse(storedMaterials) : sampleMaterials);
      setActivities(storedActivities ? JSON.parse(storedActivities) : sampleActivities);
      setLoading(false);
    };

    loadData();
  }, []);

  const saveStudents = (data) => {
    localStorage.setItem('students', JSON.stringify(data));
    setStudents(data);
  };

  const saveStaff = (data) => {
    localStorage.setItem('staff', JSON.stringify(data));
    setStaff(data);
  };

  const saveEvents = (data) => {
    localStorage.setItem('events', JSON.stringify(data));
    setEvents(data);
  };

  const saveMaterials = (data) => {
    localStorage.setItem('materials', JSON.stringify(data));
    setMaterials(data);
  };

  const saveActivities = (data) => {
    localStorage.setItem('activities', JSON.stringify(data));
    setActivities(data);
  };

  return (
    <DataContext.Provider value={{
      students, 
      setStudents: saveStudents,
      staff, 
      setStaff: saveStaff,
      events, 
      setEvents: saveEvents,
      materials, 
      setMaterials: saveMaterials,
      activities, 
      setActivities: saveActivities,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};