import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RecordVideo() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!cameraPermission || !micPermission) return <View />;

  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <View style={styles.permissionContainer}>
        {!cameraPermission.granted && (
          <Button onPress={requestCameraPermission} title="Grant Camera Permission" />
        )}
        {!micPermission.granted && (
          <Button onPress={requestMicPermission} title="Grant Microphone Permission" />
        )}
      </View>
    );
  }

  async function startRecording() {
    if (cameraRef.current) {
      setIsRecording(true);
      try {
        const video = await cameraRef.current.recordAsync({ maxDuration: 30 });
        if (video) uploadVideo(video.uri);
      } catch (e) {
        console.error(e);
      } finally {
        setIsRecording(false);
      }
    }
  }

  async function stopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  }

  async function uploadVideo(uri: string) {
    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 2. Prepare file
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `${user.id}/intro_video.mp4`;

    // 3. Upload to Supabase Storage
    const { error } = await supabase.storage.from('videos').upload(filename, blob, {
        upsert: true,
        contentType: 'video/mp4'
    });

    if (error) {
        console.error("Upload failed", error);
        return;
    }

    // 4. Get Public URL
    const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(filename);

    // 5. Save URL to Profile
    await supabase.from('profiles').update({ video_resume_url: publicUrl }).eq('id', user.id);
    alert("Video Resume Updated!");
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} mode="video" ref={cameraRef}>
        <View style={styles.buttonContainer}>
           <Button 
             title={isRecording ? "Stop Recording" : "Record Intro"} 
             onPress={isRecording ? stopRecording : startRecording} 
             color={isRecording ? "red" : "blue"}
           />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  buttonContainer: { position: 'absolute', bottom: 50, alignSelf: 'center' },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 }
});