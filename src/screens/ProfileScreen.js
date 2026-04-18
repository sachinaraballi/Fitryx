import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { WORKOUTS } from '../data/workouts';

const TIPS = [
  { emoji: '💧', title: 'Stay Hydrated', body: 'Drink water before, during, and after your workout. Aim for at least 8 glasses per day.' },
  { emoji: '😴', title: 'Rest & Recover', body: 'Muscles grow during rest. Aim for 7-9 hours of sleep and take rest days seriously.' },
  { emoji: '🥗', title: 'Eat Clean', body: 'Fuel your body with whole foods. Protein after workouts helps muscle repair.' },
  { emoji: '🔄', title: 'Consistency Wins', body: 'Short daily workouts beat sporadic long ones. Build the habit first, then increase intensity.' },
  { emoji: '📈', title: 'Progressive Overload', body: 'Gradually increase reps, sets, or time each week to keep making gains.' },
];

export default function ProfileScreen() {
  const totalCalories = WORKOUTS.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = WORKOUTS.reduce((sum, w) => sum + w.duration, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🏋️</Text>
          </View>
          <Text style={styles.name}>Home Athlete</Text>
          <Text style={styles.tagline}>Fitryx Member</Text>
        </View>

        {/* Overview Stats */}
        <Text style={styles.sectionTitle}>Program Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{WORKOUTS.length}</Text>
            <Text style={styles.statLbl}>Total Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalMinutes}</Text>
            <Text style={styles.statLbl}>Total Minutes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{totalCalories}</Text>
            <Text style={styles.statLbl}>Total Calories</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{WORKOUTS.reduce((s, w) => s + w.exercises.length, 0)}</Text>
            <Text style={styles.statLbl}>Total Exercises</Text>
          </View>
        </View>

        {/* Workout Levels */}
        <Text style={styles.sectionTitle}>Difficulty Breakdown</Text>
        {[
          { level: 'Beginner', color: '#2A9D8F', count: WORKOUTS.filter(w => w.level === 'Beginner').length },
          { level: 'Intermediate', color: '#F4A261', count: WORKOUTS.filter(w => w.level === 'Intermediate').length },
          { level: 'Advanced', color: '#E63946', count: WORKOUTS.filter(w => w.level === 'Advanced').length },
        ].map(item => (
          <View key={item.level} style={styles.levelRow}>
            <View style={[styles.levelDot, { backgroundColor: item.color }]} />
            <Text style={styles.levelName}>{item.level}</Text>
            <View style={styles.levelBarTrack}>
              <View
                style={[
                  styles.levelBarFill,
                  { backgroundColor: item.color, width: `${(item.count / WORKOUTS.length) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.levelCount}>{item.count}</Text>
          </View>
        ))}

        {/* Fitness Tips */}
        <Text style={styles.sectionTitle}>Fitness Tips</Text>
        {TIPS.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <Text style={styles.tipEmoji}>{tip.emoji}</Text>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipBody}>{tip.body}</Text>
            </View>
          </View>
        ))}

        {/* About */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>⛺ About Fitryx</Text>
          <Text style={styles.aboutText}>
            Fitryx is your starting point for building a strong, healthy body from home.
            No gym membership, no equipment — just your body and the will to move.{'\n\n'}
            All workouts are designed to be done in your living room, backyard, or anywhere you have a few square feet of space.
          </Text>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1a1a2e' },
  container: { flex: 1, backgroundColor: '#1a1a2e' },
  hero: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#16213e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#64ffda',
  },
  avatarText: { fontSize: 44 },
  name: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 },
  tagline: { fontSize: 13, color: '#64ffda' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    width: '47%',
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  statNum: { fontSize: 28, fontWeight: '900', color: '#64ffda' },
  statLbl: { fontSize: 11, color: '#8892b0', marginTop: 4, textAlign: 'center' },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  levelDot: { width: 10, height: 10, borderRadius: 5 },
  levelName: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', width: 90 },
  levelBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#16213e',
    borderRadius: 4,
    overflow: 'hidden',
  },
  levelBarFill: { height: 8, borderRadius: 4 },
  levelCount: { color: '#8892b0', fontSize: 13, width: 20, textAlign: 'right' },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  tipEmoji: { fontSize: 28, marginTop: 2 },
  tipContent: { flex: 1 },
  tipTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  tipBody: { color: '#8892b0', fontSize: 12, lineHeight: 17 },
  aboutCard: {
    backgroundColor: '#16213e',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#64ffda',
  },
  aboutTitle: { color: '#64ffda', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  aboutText: { color: '#8892b0', fontSize: 13, lineHeight: 20 },
  footer: { height: 30 },
});
