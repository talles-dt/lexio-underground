import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '@/theme/tokens';

// Simple icon components (inline SVG-style)
function PulseIcon({ active }: { active: boolean }) {
  return (
    <View style={[styles.iconBox, active && styles.iconActive]}>
      <Text style={[styles.iconText, active && styles.iconTextActive]}>◉</Text>
    </View>
  );
}

function PalaceIcon({ active }: { active: boolean }) {
  return (
    <View style={[styles.iconBox, active && styles.iconActive]}>
      <Text style={[styles.iconText, active && styles.iconTextActive]}>◇</Text>
    </View>
  );
}

function ShadowIcon({ active }: { active: boolean }) {
  return (
    <View style={[styles.iconBox, active && styles.iconActive]}>
      <Text style={[styles.iconText, active && styles.iconTextActive]}>◈</Text>
    </View>
  );
}

function VaultIcon({ active }: { active: boolean }) {
  return (
    <View style={[styles.iconBox, active && styles.iconActive]}>
      <Text style={[styles.iconText, active && styles.iconTextActive]}>▣</Text>
    </View>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <View style={[styles.iconBox, active && styles.iconActive]}>
      <Text style={[styles.iconText, active && styles.iconTextActive]}>◎</Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.obsidian,
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.ivory,
        tabBarInactiveTintColor: colors.zinc,
        tabBarLabelStyle: {
          ...typography.caption,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pulse',
          tabBarIcon: ({ focused }) => <PulseIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="palace"
        options={{
          title: 'Palace',
          tabBarIcon: ({ focused }) => <PalaceIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="shadow"
        options={{
          title: 'Shadow',
          tabBarIcon: ({ focused }) => <ShadowIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          title: 'Vault',
          tabBarIcon: ({ focused }) => <VaultIcon active={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <ProfileIcon active={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {},
  iconText: {
    fontSize: 18,
    color: colors.zinc,
  },
  iconTextActive: {
    color: colors.ivory,
  },
});