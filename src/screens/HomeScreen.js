import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { WORKOUTS, CATEGORIES, LEVEL_COLORS } from '../data/workouts';

export default function HomeScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = selectedCategory === 'All'
    ? WORKOUTS
    : WORKOUTS.filter(w => w.category === selectedCategory);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good day, Athlete! 👋</Text>
          <Text style={styles.subtitle}>Ready to crush your home workout?</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{WORKOUTS.length}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Streak 🔥</Text>
          </View>
        </View>

        {/* Category Filter */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Workout Cards */}
        <Text style={styles.sectionTitle}>Workouts</Text>
        {filtered.map(workout => (
          <TouchableOpacity
            key={workout.id}
            style={[styles.workoutCard, { borderLeftColor: workout.color }]}
            onPress={() => navigation.navigate('Workout', { workout })}
            activeOpacity={0.85}
          >
            <View style={styles.cardTop}>
              <View style={[styles.emojiCircle, { backgroundColor: workout.color + '22' }]}>
                <Text style={styles.cardEmoji}>{workout.emoji}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{workout.title}</Text>
                <Text style={styles.cardCategory}>{workout.category}</Text>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLORS[workout.level] + '22' }]}>
                <Text style={[styles.levelText, { color: LEVEL_COLORS[workout.level] }]}>
                  {workout.level}
                </Text>
              </View>
            </View>
            <Text style={styles.cardDesc} numberOfLines={2}>{workout.description}</Text>
            <View style={styles.cardMeta}>
              <Text style={styles.metaItem}>⏱ {workout.duration} min</Text>
              <Text style={styles.metaItem}>🔥 {workout.calories} cal</Text>
              <Text style={styles.metaItem}>💪 {workout.exercises.length} exercises</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#8892b0',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#64ffda',
  },
  statLabel: {
    fontSize: 11,
    color: '#8892b0',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#16213e',
    borderWidth: 1,
    borderColor: '#0f3460',
  },
  categoryChipActive: {
    backgroundColor: '#64ffda',
    borderColor: '#64ffda',
  },
  categoryText: {
    color: '#8892b0',
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#1a1a2e',
  },
  workoutCard: {
    backgroundColor: '#16213e',
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardCategory: {
    fontSize: 12,
    color: '#8892b0',
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDesc: {
    fontSize: 13,
    color: '#8892b0',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 14,
  },
  metaItem: {
    fontSize: 12,
    color: '#64ffda',
    fontWeight: '600',
  },
  footer: {
    height: 30,
  },
});
