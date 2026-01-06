import MapView, { Marker } from 'react-native-maps';
import { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function JobMap() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    async function fetchJobs() {
      // In Supabase SQL editor: CREATE TABLE jobs (id int, title text, location_lat float, location_lng float);
      const { data, error } = await supabase.from('jobs').select('*');
      if (data) setJobs(data);
    }
    fetchJobs();
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: -37.8136, // Default: Melbourne
          longitude: 144.9631,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {jobs.map((job) => (
          <Marker
            key={job.id}
            coordinate={{ latitude: job.location_lat, longitude: job.location_lng }}
            title={job.title}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
});