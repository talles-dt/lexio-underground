import { useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Text, View } from 'react-native';

export default function CallbackScreen() {
  const router = useRouter();
  const { license } = useLocalSearchParams();

  useEffect(() => {
    if (license) {
      supabase.rpc('redeem_license', { license_key: license as string })
        .then(({ error }) => {
          if (error) {
            alert(`Redemption failed: ${error.message}`);
            router.replace('/');
          } else {
            router.replace('/stitch_experience/founder');
          }
        });
    }
  }, [license]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redeeming your founder access...</Text>
    </View>
  );
}