import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function RecordVideo() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // 1. Loading State
  if (!cameraPermission || !micPermission) {
    return <View style={styles.container}><Text>Requesting permissions...</Text></View>;
  }

  // 2. Permission Denied State
  if (!cameraPermission.granted || !micPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          We need Camera and Microphone access to record your video resume.
        </Text>
        <Button onPress={requestCameraPermission} title="Grant Camera" />
        <View style={{ height: 10 }} />
        <Button onPress={requestMicPermission} title="Grant Microphone" />
      </View>
    );
  }

  // 3. Recording Logic
  async function startRecording() {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        console.log("Starting recording...");
        const video = await cameraRef.current.recordAsync({ maxDuration: 30 });
        console.log("Video recorded:", video?.uri);
        if (video) uploadVideo(video.uri);
      } catch (e) {
        console.error("Recording failed:", e);
        Alert.alert("Error", "Could not record video.");
      } finally {
        setIsRecording(false);
      }
    }
  }

  async function stopRecording() {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  }

  async function uploadVideo(uri: string) {
    console.log("1. Starting upload process...");
    
    // Check User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("No user logged in");
        return;
    }
    console.log("2. User found:", user.id);

    // Prepare File
    const timestamp = Date.now();
    const filename = `${user.id}/intro_${timestamp}.mp4`;
    console.log("3. Filename created:", filename);

    try {
      // Fetch File
      console.log("4. Fetching file from URI...");
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log("5. Blob created, size:", blob.size);

      // Upload to Storage
      console.log("6. Uploading to Supabase Storage...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filename, blob, {
          contentType: 'video/mp4',
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ Upload Error Details:", uploadError);
        throw uploadError;
      }
      console.log("✅ Upload success:", uploadData);

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filename);
      console.log("7. Public URL generated:", publicUrl);

      // Save to Database
      console.log("8. Updating profile in database...");
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ video_resume_url: publicUrl })
        .eq('id', user.id);

      if (dbError) {
        console.error("❌ Database Error:", dbError);
        throw dbError;
      }

      Alert.alert("Success!", "Video uploaded and profile updated!");
      
    } catch (e: any) {
      console.error("❌ FINAL ERROR:", e.message);
      Alert.alert("Upload Failed", e.message);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        mode="video" 
        facing="front"
        ref={cameraRef}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.recordBtn, { backgroundColor: isRecording ? 'red' : 'white' }]}
            onPress={isRecording ? stopRecording : startRecording}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  camera: { flex: 1 },
  buttonContainer: { 
    position: 'absolute', 
    bottom: 50, 
    alignSelf: 'center',
    alignItems: 'center'
  },
  recordBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)'
  }
});