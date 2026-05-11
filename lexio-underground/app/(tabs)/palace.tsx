import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useLearnerStore } from '@/stores/learnerStore';
import { colors, typography, spacing, stageColors } from '@/theme/tokens';

const { width } = Dimensions.get('window');
const ROOM_W = (width - 48) / 2;
const ROOM_H = 80;

interface RoomRect {
  id: string;
  label: string;
  x: number;
  y: number;
  isUnlocked: boolean;
  isActive: boolean;
}

const DEFAULT_LAYOUT: RoomRect[] = [
  { id: 'grammar', label: 'Grammar', x: 16, y: 16, isUnlocked: false, isActive: false },
  { id: 'vocab', label: 'Vocab', x: ROOM_W + 32, y: 16, isUnlocked: false, isActive: false },
  { id: 'logic', label: 'Logic', x: 16, y: ROOM_H + 32, isUnlocked: false, isActive: false },
  { id: 'culture', label: 'Culture', x: ROOM_W + 32, y: ROOM_H + 32, isUnlocked: false, isActive: false },
  { id: 'comm', label: 'Comm Hall', x: (width - 120) / 2, y: ROOM_H * 2 + 48, isUnlocked: false, isActive: false },
];

function Room({ room }: { room: RoomRect }) {
  const strokeColor = room.isUnlocked ? colors.phosphor : colors.zinc;
  const fillColor = room.isUnlocked ? colors.surface : 'transparent';

  return (
    <View
      style={[
        styles.room,
        {
          left: room.x,
          top: room.y,
          borderColor: strokeColor,
          backgroundColor: fillColor,
          borderStyle: room.isUnlocked ? 'solid' : 'dashed',
        },
      ]}
    >
      <Text
        style={[
          styles.roomLabel,
          { color: room.isUnlocked ? colors.ivory : colors.zinc },
        ]}
      >
        {room.label}
      </Text>
    </View>
  );
}

export default function PalaceScreen() {
  const { maturityStage, palaceRooms } = useLearnerStore();
  const stageColor = stageColors[maturityStage] ?? colors.phosphor;

  const rooms = DEFAULT_LAYOUT.map((r) => ({
    ...r,
    isUnlocked: palaceRooms.includes(r.id) || r.id === 'grammar',
  }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.stageLabel, { color: stageColor }]}>
          {maturityStage.toUpperCase()}
        </Text>
        <Text style={styles.title}>Your Palace</Text>
      </View>

      <View style={styles.blueprint}>
        {/* Entrance room */}
        <View style={[styles.entrance, { borderColor: stageColor }]}>
          <Text style={[styles.entranceLabel, { color: stageColor }]}>ENTRANCE</Text>
          <Text style={styles.itemCount}>3 items</Text>
        </View>

        {/* Grid overlay */}
        <View style={styles.gridOverlay} />

        {/* Rooms */}
        {rooms.map((room) => (
          <Room key={room.id} room={room} />
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.phosphor }]} />
          <Text style={styles.legendText}>Active room</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { borderColor: colors.zinc, borderWidth: 1, backgroundColor: 'transparent' }]} />
          <Text style={styles.legendText}>Locked room</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.obsidian,
  },
  content: {
    padding: spacing[4],
    paddingBottom: spacing[16],
  },
  header: {
    marginBottom: spacing[6],
  },
  stageLabel: {
    ...typography.caption,
    letterSpacing: 2,
    marginBottom: spacing[2],
  },
  title: {
    ...typography.h1,
    color: colors.ivory,
  },
  blueprint: {
    height: ROOM_H * 3 + 160,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: colors.ivory,
  },
  entrance: {
    position: 'absolute',
    top: 16,
    left: (width - 80) / 2 - 24,
    width: 80,
    height: 60,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  entranceLabel: {
    ...typography.caption,
    letterSpacing: 1,
  },
  itemCount: {
    ...typography.caption,
    color: colors.zinc,
    fontSize: 10,
  },
  room: {
    position: 'absolute',
    width: ROOM_W - 16,
    height: ROOM_H - 16,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roomLabel: {
    ...typography.ui,
    letterSpacing: 1,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing[6],
    marginTop: spacing[4],
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendText: {
    ...typography.caption,
    color: colors.zinc,
  },
});